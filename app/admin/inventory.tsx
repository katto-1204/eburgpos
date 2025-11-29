"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal, TextInput, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import { router } from "expo-router"
import { supabase } from "../../utils/supabaseClient"

interface InventoryItem {
  product_id: number
  name: string
  price: number
  category_name: string
  quantity_in_stock: number
  minimum_threshold: number
  last_restock_date: string | null
  last_updated: string
}

export default function AdminInventory() {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryTrigger, setRetryTrigger] = useState(0)
  const [restockModalVisible, setRestockModalVisible] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [restockQuantity, setRestockQuantity] = useState("")
  const [restockLoading, setRestockLoading] = useState(false)

  useEffect(() => {
    const fetchInventory = async () => {
      console.log(`📦 Fetching inventory data (trigger: ${retryTrigger})...`)
      setLoading(true)
      setError(null)

      try {
        // First, get all active products
        const { data: activeProducts, error: productsError } = await supabase
          .from("product")
          .select(`
            product_id,
            name,
            price,
            category:category(name)
          `)
          .eq("is_active", true)

        if (productsError) throw productsError

        // Then get inventory data for these products
        const productIds = activeProducts?.map(p => p.product_id) || []
        const { data: inventoryData, error: inventoryError } = await supabase
          .from("inventory")
          .select(`
            product_id,
            quantity_in_stock,
            minimum_threshold,
            last_restock_date,
            last_updated
          `)
          .in("product_id", productIds)

        if (inventoryError) throw inventoryError

        // Create inventory map for quick lookup
        const inventoryMap = new Map()
        inventoryData?.forEach(inv => {
          inventoryMap.set(inv.product_id, inv)
        })

        if (error) {
          setError("Failed to load inventory data")
          console.error("Inventory fetch error:", error)
          return
        }

        console.log(`📊 Active products:`, activeProducts?.slice(0, 3).map((p: any) => ({
          product_id: p.product_id,
          name: p.name
        })))
        console.log(`📦 Inventory records:`, inventoryData?.slice(0, 3).map((inv: any) => ({
          product_id: inv.product_id,
          quantity_in_stock: inv.quantity_in_stock
        })))

        // Format data by merging products with inventory
        const formattedData: InventoryItem[] = (activeProducts || []).map((product: any) => {
          const inventory = inventoryMap.get(product.product_id)
          return {
            product_id: product.product_id,
            name: product.name,
            price: product.price,
            category_name: product.category?.name || "Uncategorized",
            quantity_in_stock: inventory?.quantity_in_stock || 0,
            minimum_threshold: inventory?.minimum_threshold || 10,
            last_restock_date: inventory?.last_restock_date,
            last_updated: inventory?.last_updated || new Date().toISOString(),
          }
        })

        console.log(`✅ Formatted inventory data:`, formattedData.slice(0, 3).map(item => ({
          id: item.product_id,
          name: item.name,
          stock: item.quantity_in_stock
        })))

        setInventoryData(formattedData)

        setInventoryData(formattedData)
      } catch (err) {
        setError("An unexpected error occurred")
        console.error("Inventory fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchInventory()
  }, [retryTrigger])

  const handleRestock = async () => {
    if (!selectedItem || !restockQuantity.trim()) {
      Alert.alert("Error", "Please enter a quantity to restock")
      return
    }

    const quantityToAdd = parseInt(restockQuantity.trim())
    if (isNaN(quantityToAdd) || quantityToAdd <= 0) {
      Alert.alert("Error", "Please enter a valid positive number")
      return
    }

    setRestockLoading(true)
    try {
      const newStock = selectedItem.quantity_in_stock + quantityToAdd

      // Check if inventory record exists
      const { data: existingInventory } = await supabase
        .from("inventory")
        .select("product_id")
        .eq("product_id", selectedItem.product_id)
        .single()

      let error
      if (existingInventory) {
        // Update existing inventory
        const result = await supabase
          .from("inventory")
          .update({
            quantity_in_stock: newStock,
            last_restock_date: new Date().toISOString(),
            last_updated: new Date().toISOString()
          })
          .eq("product_id", selectedItem.product_id)
        error = result.error
      } else {
        // Create new inventory record
        const result = await supabase
          .from("inventory")
          .insert({
            product_id: selectedItem.product_id,
            quantity_in_stock: newStock,
            minimum_threshold: 10,
            last_restock_date: new Date().toISOString(),
            last_updated: new Date().toISOString()
          })
        error = result.error
      }

      if (error) {
        console.error("Restock error:", error)
        Alert.alert("Error", "Failed to update inventory")
        return
      }

      // Refresh inventory data
      setRetryTrigger(prev => prev + 1)

      // Reset modal
      setRestockModalVisible(false)
      setSelectedItem(null)
      setRestockQuantity("")

      Alert.alert("Success", `Successfully added ${quantityToAdd} items to ${selectedItem.name}`)
    } catch (err) {
      console.error("Restock error:", err)
      Alert.alert("Error", "Something went wrong while restocking")
    } finally {
      setRestockLoading(false)
    }
  }

  const openRestockModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setRestockQuantity("")
    setRestockModalVisible(true)
  }

  const getStockStatus = (stock: number, threshold: number) => {
    if (stock <= threshold) return "low"
    if (stock <= threshold * 2) return "medium"
    return "high"
  }

  const getStockColor = (status: string) => {
    switch (status) {
      case "low":
        return "#EF4444"
      case "medium":
        return "#F59E0B"
      case "high":
        return "#10B981"
      default:
        return "#6B7280"
    }
  }

  const lowStockItems = inventoryData.filter((item) => item.quantity_in_stock <= item.minimum_threshold)
  const totalItems = inventoryData.length
  const totalValue = inventoryData.reduce((sum, item) => sum + item.price * item.quantity_in_stock, 0)

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#92400E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory Management</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F97316" />
          <Text style={styles.loadingText}>Loading inventory...</Text>
        </View>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#92400E" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Inventory Management</Text>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#EF4444" />
          <Text style={styles.errorText}>
            {error}
          </Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => setRetryTrigger(prev => prev + 1)}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#92400E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Inventory Management</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Inventory Summary */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{totalItems}</Text>
            <Text style={styles.summaryLabel}>Total Items</Text>
            <Ionicons name="list" size={20} color="#2563EB" style={styles.summaryIcon} />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>{lowStockItems.length}</Text>
            <Text style={styles.summaryLabel}>Low Stock Alerts</Text>
            <Ionicons name="warning" size={20} color="#EF4444" style={styles.summaryIcon} />
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>₱{totalValue.toLocaleString()}</Text>
            <Text style={styles.summaryLabel}>Total Inventory Value</Text>
            <Ionicons name="cash" size={20} color="#10B981" style={styles.summaryIcon} />
          </View>
        </View>

        {/* Low Stock Alerts */}
        {lowStockItems.length > 0 && (
          <View style={styles.alertSection}>
            <View style={styles.alertHeader}>
              <Ionicons name="warning" size={20} color="#EF4444" />
              <Text style={styles.alertTitle}>Low Stock Alerts</Text>
            </View>
            <View style={styles.alertItems}>
              {lowStockItems.map((item) => (
                <View key={item.product_id} style={styles.alertItem}>
                  <Text style={styles.alertItemName}>{item.name}</Text>
                  <Text style={styles.alertItemStock}>{item.quantity_in_stock} remaining</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Inventory List */}
        <View style={styles.inventoryList}>
          <Text style={styles.sectionTitle}>All Items</Text>
          {inventoryData.map((item) => {
            const stockStatus = getStockStatus(item.quantity_in_stock, item.minimum_threshold)
            const stockColor = getStockColor(stockStatus)

            return (
              <View key={item.product_id} style={styles.inventoryItem}>
                <View style={styles.itemLeft}>
                  <View style={styles.itemImage}>
                    <Text style={styles.itemImageText}>🍔</Text>
                  </View>
                  <View style={styles.itemDetails}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCategory}>{item.category_name}</Text>
                    <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
                  </View>
                </View>

                <View style={styles.itemRight}>
                  <View style={styles.stockInfo}>
                    <Text style={[styles.stockNumber, { color: stockColor }]}>{item.quantity_in_stock}</Text>
                    <Text style={styles.stockLabel}>in stock</Text>
                  </View>

                  <View style={[styles.stockIndicator, { backgroundColor: stockColor }]} />

                  <TouchableOpacity style={styles.restockButton} onPress={() => openRestockModal(item)}>
                    <Ionicons name="add-circle-outline" size={20} color="#F97316" />
                    <Text style={styles.restockText}>Restock</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )
          })}
        </View>
      </ScrollView>

      {/* Restock Modal */}
      <Modal
        visible={restockModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setRestockModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Restock Item</Text>
              <TouchableOpacity
                onPress={() => setRestockModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {selectedItem && (
              <View style={styles.modalBody}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemInfoName}>{selectedItem.name}</Text>
                  <Text style={styles.itemInfoCategory}>{selectedItem.category_name}</Text>
                  <Text style={styles.itemInfoStock}>
                    Current stock: {selectedItem.quantity_in_stock}
                  </Text>
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Quantity to add:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={restockQuantity}
                    onChangeText={setRestockQuantity}
                    placeholder="Enter quantity"
                    keyboardType="numeric"
                    autoFocus
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={[styles.modalButton, styles.cancelButton]}
                    onPress={() => setRestockModalVisible(false)}
                    disabled={restockLoading}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.modalButton, styles.confirmButton]}
                    onPress={handleRestock}
                    disabled={restockLoading || !restockQuantity.trim()}
                  >
                    {restockLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Ionicons name="add-circle" size={16} color="#FFFFFF" />
                        <Text style={styles.confirmButtonText}>Add Stock</Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#6B7280",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: "#EF4444",
    textAlign: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#F97316",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  summaryIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  alertSection: {
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  alertHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#DC2626",
    marginLeft: 8,
  },
  alertItems: {
    gap: 8,
  },
  alertItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 8,
  },
  alertItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  alertItemStock: {
    fontSize: 14,
    color: "#DC2626",
    fontWeight: "600",
  },
  inventoryList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  inventoryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  itemImage: {
    width: 50,
    height: 50,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  itemImageText: {
    fontSize: 24,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F97316",
  },
  itemRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  stockInfo: {
    alignItems: "center",
  },
  stockNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  stockLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  restockButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F97316",
  },
  restockText: {
    fontSize: 14,
    color: "#F97316",
    fontWeight: "600",
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: "100%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  modalCloseButton: {
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  itemInfo: {
    marginBottom: 20,
  },
  itemInfoName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  itemInfoCategory: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  itemInfoStock: {
    fontSize: 14,
    color: "#F97316",
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#F9FAFB",
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
  },
  cancelButton: {
    backgroundColor: "#F3F4F6",
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  cancelButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#F97316",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
