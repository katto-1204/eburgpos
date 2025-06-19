import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import { menuItems } from "../../utils/constants"

export default function Inventory() {
  // Sample inventory data with stock levels
  const inventoryData = menuItems.map((item) => ({
    ...item,
    stock: Math.floor(Math.random() * 100) + 10, // Random stock between 10-110
    lowStockThreshold: 20,
    lastRestocked: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date within last week
  }))

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

  const lowStockItems = inventoryData.filter((item) => item.stock <= item.lowStockThreshold)
  const totalItems = inventoryData.length
  const totalValue = inventoryData.reduce((sum, item) => sum + item.price * item.stock, 0)

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>
        <Header showSearch={false} />

        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <Ionicons name="cube" size={24} color="#F97316" />
            <Text style={styles.pageTitle}>Inventory Management</Text>
          </View>
          <Text style={styles.pageSubtitle}>Monitor and manage your stock levels</Text>
        </View>

        <ScrollView style={styles.inventoryContainer} showsVerticalScrollIndicator={false}>
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
                  <View key={item.id} style={styles.alertItem}>
                    <Text style={styles.alertItemName}>{item.name}</Text>
                    <Text style={styles.alertItemStock}>{item.stock} remaining</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Inventory List */}
          <View style={styles.inventoryList}>
            <Text style={styles.sectionTitle}>All Items</Text>
            {inventoryData.map((item) => {
              const stockStatus = getStockStatus(item.stock, item.lowStockThreshold)
              const stockColor = getStockColor(stockStatus)

              return (
                <View key={item.id} style={styles.inventoryItem}>
                  <View style={styles.itemLeft}>
                    <View style={styles.itemImage}>
                      <Text style={styles.itemImageText}>🍔</Text>
                    </View>
                    <View style={styles.itemDetails}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemCategory}>{item.category}</Text>
                      <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
                    </View>
                  </View>

                  <View style={styles.itemRight}>
                    <View style={styles.stockInfo}>
                      <Text style={[styles.stockNumber, { color: stockColor }]}>{item.stock}</Text>
                      <Text style={styles.stockLabel}>in stock</Text>
                    </View>

                    <View style={[styles.stockIndicator, { backgroundColor: stockColor }]} />

                    <TouchableOpacity style={styles.restockButton}>
                      <Ionicons name="add-circle-outline" size={20} color="#F97316" />
                      <Text style={styles.restockText}>Restock</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#F9FAFB",
  },
  content: {
    flex: 1,
  },
  pageHeader: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginLeft: 12,
  },
  pageSubtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  inventoryContainer: {
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
})
