"use client"

import { useState, createContext, useContext, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions, ActivityIndicator, TextInput } from "react-native"
import Toast from "react-native-toast-message"
import { Ionicons } from "@expo/vector-icons"

import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import type { MenuItem, OrderItem } from "../../types"
import { supabase } from "../../utils/supabaseClient"

const { width } = Dimensions.get("window")

// Calculate card width to prevent distortion - clamp between 160-220px for 4 columns
const MENU_CARD_WIDTH = Math.max(Math.min((width - 400 - 60) / 4 - 15, 220), 160)

// Create context for inventory refresh
export const InventoryRefreshContext = createContext<{
  refreshInventory?: () => void
  setRefreshInventory: (fn: (() => void) | undefined) => void
}>({
  refreshInventory: undefined,
  setRefreshInventory: () => {},
})

// Create context for cart state
const CartContext = createContext<{
  orderItems: OrderItem[]
  setOrderItems: (items: OrderItem[]) => void
  addToOrder: (item: MenuItem) => void
  updateItemQuantity: (itemId: string, change: number) => void
  clearCart: () => void
  confirmOrder: () => Promise<void>
  orderType: "Dine In" | "Take Out"
  setOrderType: (type: "Dine In" | "Take Out") => void
  customerName: string
  setCustomerName: (name: string) => void
  customerPhone: string
  setCustomerPhone: (phone: string) => void
  currentOrderNumber: number
  isConfirmingOrder: boolean
  setIsConfirmingOrder: (loading: boolean) => void
}>({
  orderItems: [],
  setOrderItems: () => {},
  addToOrder: () => {},
  updateItemQuantity: () => {},
  clearCart: () => {},
  confirmOrder: async () => {},
  orderType: "Dine In",
  setOrderType: () => {},
  customerName: "",
  setCustomerName: () => {},
  customerPhone: "",
  setCustomerPhone: () => {},
  currentOrderNumber: 2128,
  isConfirmingOrder: false,
  setIsConfirmingOrder: () => {},
})

export const useCart = () => useContext(CartContext)

export default function CashierPOS() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [orderType, setOrderType] = useState<"Dine In" | "Take Out">("Dine In")
  const [currentOrderNumber, setCurrentOrderNumber] = useState(2128)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("+63 9056829865")
  const [searchQuery, setSearchQuery] = useState("")
  const [isConfirmingOrder, setIsConfirmingOrder] = useState(false)
  const [refreshInventory, setRefreshInventory] = useState<(() => void) | undefined>()
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [categories, setCategories] = useState<string[]>(["All"])
  const [menuLoading, setMenuLoading] = useState(true)

  // Fetch menu items from database
  useEffect(() => {
    const fetchMenuItems = async () => {
      setMenuLoading(true)
      try {
        // Fetch products with their categories
        const { data: products, error } = await supabase
          .from("product")
          .select(`
            product_id,
            name,
            price,
            category:category(name)
          `)
          .eq("is_active", true)

        if (error) {
          console.error("Error fetching menu items:", error)
          return
        }

        // Convert to MenuItem format
        const formattedItems: MenuItem[] = (products || []).map((product: any) => ({
          id: String(product.product_id),
          name: product.name,
          price: product.price,
          category: product.category?.name || "Uncategorized",
          image: "/placeholder.svg"
        }))

        setMenuItems(formattedItems)

        // Extract unique categories
        const uniqueCategories = ["All", ...new Set(formattedItems.map(item => item.category))]
        setCategories(uniqueCategories)

      } catch (err) {
        console.error("Error loading menu items:", err)
      } finally {
        setMenuLoading(false)
      }
    }

    fetchMenuItems()
  }, [])

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Check inventory stock for a product
  const checkInventoryStock = async (productId: string): Promise<number> => {
    try {
      const { data, error } = await supabase
        .from("inventory")
        .select("quantity_in_stock")
        .eq("product_id", productId)
        .single()

      if (error || !data) {
        console.error("Error checking inventory:", error)
        return 0 // Assume out of stock if error
      }

      return data.quantity_in_stock || 0
    } catch (err) {
      console.error("Error checking inventory stock:", err)
      return 0 // Assume out of stock if error
    }
  }

  const addToOrder = async (item: MenuItem) => {
    // Check inventory stock
    const stock = await checkInventoryStock(item.id)
    const currentQuantityInCart = orderItems.find(orderItem => orderItem.id === item.id)?.quantity || 0

    if (stock <= currentQuantityInCart) {
      Toast.show({
        type: "error",
        text1: "Out of Stock",
        text2: `${item.name} is currently out of stock`,
        visibilityTime: 3000,
      })
      return
    }

    const existingItem = orderItems.find((orderItem) => orderItem.id === item.id)
    if (existingItem) {
      setOrderItems(
        orderItems.map((orderItem) =>
          orderItem.id === item.id ? { ...orderItem, quantity: orderItem.quantity + 1 } : orderItem,
        ),
      )
    } else {
      setOrderItems([...orderItems, { ...item, quantity: 1 }])
    }
    Toast.show({
      type: "success",
      text1: "Item Added",
      text2: `${item.name} added to cart`,
      visibilityTime: 2000,
    })
  }

  const updateItemQuantity = async (itemId: string, change: number) => {
    const item = menuItems.find((m) => m.id === itemId)
    if (!item) return

    const existingItem = orderItems.find((orderItem) => orderItem.id === itemId)

    if (existingItem) {
      const newQuantity = existingItem.quantity + change
      if (newQuantity <= 0) {
        setOrderItems(orderItems.filter((orderItem) => orderItem.id !== itemId))
        Toast.show({
          type: "info",
          text1: "Item Removed",
          text2: `${item.name} removed from cart`,
          visibilityTime: 2000,
        })
      } else {
        // Check inventory stock when increasing quantity
        if (change > 0) {
          const stock = await checkInventoryStock(itemId)
          const currentQuantityInCart = orderItems
            .filter(orderItem => orderItem.id !== itemId)
            .reduce((sum, orderItem) => sum + orderItem.quantity, 0)

          if (stock <= currentQuantityInCart + existingItem.quantity) {
            Toast.show({
              type: "error",
              text1: "Out of Stock",
              text2: `Cannot add more ${item.name} - insufficient stock`,
              visibilityTime: 3000,
            })
            return
          }
        }

        setOrderItems(
          orderItems.map((orderItem) =>
            orderItem.id === itemId ? { ...orderItem, quantity: newQuantity } : orderItem,
          ),
        )
      }
    } else if (change > 0) {
      // Check inventory stock when adding new item
      const stock = await checkInventoryStock(itemId)
      if (stock <= 0) {
        Toast.show({
          type: "error",
          text1: "Out of Stock",
          text2: `${item.name} is currently out of stock`,
          visibilityTime: 3000,
        })
        return
      }

      setOrderItems([...orderItems, { ...item, quantity: 1 }])
      Toast.show({
        type: "success",
        text1: "Item Added",
        text2: `${item.name} added to cart`,
        visibilityTime: 2000,
      })
    }
  }

  const clearCart = () => {
    setOrderItems([])
    Toast.show({
      type: "info",
      text1: "Cart Cleared",
      text2: "All items removed from cart",
      visibilityTime: 2000,
    })
  }

  const confirmOrder = async () => {
    if (orderItems.length === 0) {
      Toast.show({
        type: "error",
        text1: "Empty Cart",
        text2: "Please add items to cart before placing order",
        visibilityTime: 3000,
      })
      return
    }

    setIsConfirmingOrder(true)

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const tax = 6.0
    const discount = 0.0
    const total = subtotal + tax - discount

    try {

      // 1) Insert main order
      const { data: insertedOrder, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: customerName,
          total_amount: total,
          status: "Completed",
          notes: orderType, // "Dine In" / "Take Out"
        })
        .select("order_id")
        .maybeSingle()

      if (orderError || !insertedOrder) {
        Toast.show({ type: "error", text1: "Order Failed", text2: "Could not save order. Please try again." })
        return
      }

      const orderId = insertedOrder.order_id as number

      // 2) Insert line items
      const lineItems = orderItems.map((item) => ({
        order_id: orderId,
        product_id: Number(item.id),
        quantity: item.quantity,
        unit_price: item.price,
      }))

      const { error: lineError } = await supabase.from("order_product").insert(lineItems)
      if (lineError) {
        Toast.show({ type: "error", text1: "Order Failed", text2: "Could not save order items. Please try again." })
        return
      }

      // 3) Inventory stock will be automatically decreased by database trigger when order_product records are inserted
      console.log("📦 Inventory will be automatically decreased by database trigger (trigger_update_inventory)")

      // 4) Clear cart immediately and show success
      setOrderItems([])
      const nextOrderNumber = currentOrderNumber + 1
      setCurrentOrderNumber(nextOrderNumber)

      Toast.show({
        type: "success",
        text1: "Order Confirmed!",
        text2: `Order #${nextOrderNumber} has been placed successfully`,
      })

      // 5) Trigger inventory refresh after a brief delay to ensure DB updates are complete
      setTimeout(() => {
        if (refreshInventory) {
          console.log("🔄 Triggering inventory refresh...")
          refreshInventory()
        }
      }, 500)
    } catch (err) {
      console.error("Order confirmation error:", err)
      Toast.show({ type: "error", text1: "Order Failed", text2: "Something went wrong. Please try again." })
    } finally {
      setIsConfirmingOrder(false)
    }
  }

  const getItemQuantity = (itemId: string) => {
    const orderItem = orderItems.find((item) => item.id === itemId)
    return orderItem ? orderItem.quantity : 0
  }

  const cartContextValue = {
    orderItems,
    setOrderItems,
    addToOrder,
    updateItemQuantity,
    clearCart,
    confirmOrder,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    currentOrderNumber,
    isConfirmingOrder,
    setIsConfirmingOrder,
  }

  return (
    <InventoryRefreshContext.Provider value={{ refreshInventory, setRefreshInventory }}>
      <CartContext.Provider value={cartContextValue}>
        <View style={styles.container}>
          <Sidebar />
          <View style={styles.mainContent}>
            <Header searchQuery={searchQuery} onSearchChange={setSearchQuery} />

          {/* Category Tabs */}
          <View style={styles.categoriesContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonActive]}
                  onPress={() => setSelectedCategory(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Menu Items Grid */}
          <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
            {menuLoading ? (
              <View style={{ alignItems: "center", paddingVertical: 40 }}>
                <ActivityIndicator size="large" color="#F97316" />
                <Text style={{ marginTop: 16, fontSize: 16, color: "#6B7280" }}>Loading menu...</Text>
              </View>
            ) : (
              <View style={styles.menuGrid}>
                {filteredItems.map((item) => {
                  const quantity = getItemQuantity(item.id)
                  return (
                    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={() => addToOrder(item)}>
                      <View style={styles.menuItemContent}>
                        <View style={styles.menuItemImage}>
                          <Text style={styles.menuItemImageText}>🍔</Text>
                        </View>
                        <View style={styles.menuItemTextContainer}>
                          <Text style={styles.menuItemName} numberOfLines={2} ellipsizeMode="tail">{item.name}</Text>
                          <Text style={styles.menuItemCategory} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
                        </View>
                        <View style={styles.menuItemFooter}>
                          <Text style={styles.menuItemPrice}>₱{item.price.toFixed(2)}</Text>
                          <View style={styles.quantityControls}>
                            <TouchableOpacity
                              style={styles.quantityButton}
                              onPress={(e) => {
                                e.stopPropagation()
                                updateItemQuantity(item.id, -1)
                              }}
                            >
                              <Ionicons name="remove" size={12} color="#92400E" />
                            </TouchableOpacity>
                            <Text style={styles.quantityText}>{quantity}</Text>
                            <TouchableOpacity
                              style={[styles.quantityButton, styles.quantityButtonAdd]}
                              onPress={(e) => {
                                e.stopPropagation()
                                updateItemQuantity(item.id, 1)
                              }}
                            >
                              <Ionicons name="add" size={12} color="#000000" />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </ScrollView>
        </View>

        {/* Order Panel */}
        <OrderPanel />
      </View>
      </CartContext.Provider>
    </InventoryRefreshContext.Provider>
  )
}

// Order Panel Component
function OrderPanel() {
  const {
    orderItems,
    setOrderItems,
    clearCart,
    confirmOrder,
    orderType,
    setOrderType,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    currentOrderNumber,
    isConfirmingOrder,
  } = useCart()

  const updateOrderQuantity = (id: string, change: number) => {
    setOrderItems(
      orderItems
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + change)
            return newQuantity === 0 ? null : { ...item, quantity: newQuantity }
          }
          return item
        })
        .filter(Boolean) as OrderItem[],
    )
  }

  const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = 6.0
  const discount = 0.0
  const total = subtotal + tax - discount

  return (
    <View style={styles.orderPanel}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderTitle}>Order Details</Text>
        <TouchableOpacity>
          <Ionicons name="download-outline" size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <Text style={styles.orderNumber}>Order #{currentOrderNumber}</Text>

      <View style={styles.orderTypeButtons}>
        <TouchableOpacity
          style={[styles.orderTypeButton, orderType === "Dine In" && styles.orderTypeButtonActive]}
          onPress={() => setOrderType("Dine In")}
        >
          <Text style={[styles.orderTypeButtonText, orderType === "Dine In" && styles.orderTypeButtonTextActive]}>
            Dine In
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.orderTypeButton, orderType === "Take Out" && styles.orderTypeButtonActive]}
          onPress={() => setOrderType("Take Out")}
        >
          <Text style={[styles.orderTypeButtonText, orderType === "Take Out" && styles.orderTypeButtonTextActive]}>
            Take Out
          </Text>
        </TouchableOpacity>
      </View>

      {/* Customer Name Input */}
      <View style={styles.customerNameContainer}>
        <Text style={styles.customerNameLabel}>Customer Name</Text>
        <TextInput
          style={styles.customerNameInput}
          placeholder="Enter customer name"
          value={customerName}
          onChangeText={setCustomerName}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.orderItems} showsVerticalScrollIndicator={false}>
        {orderItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="restaurant-outline" size={40} color="#9CA3AF" />
            <Text style={styles.emptyCartText}>No items in cart</Text>
            <Text style={styles.emptyCartSubtext}>Add items from the menu</Text>
          </View>
        ) : (
          orderItems.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemControls}>
                <TouchableOpacity style={styles.orderItemButton} onPress={() => updateOrderQuantity(item.id, -1)}>
                  <Ionicons name="remove" size={12} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.orderItemQuantity}>x{item.quantity}</Text>
                <TouchableOpacity
                  style={[styles.orderItemButton, styles.orderItemButtonAdd]}
                  onPress={() => updateOrderQuantity(item.id, 1)}
                >
                  <Ionicons name="add" size={12} color="#000000" />
                </TouchableOpacity>
              </View>
              <View style={styles.orderItemImage}>
                <Text style={styles.orderItemImageText}>🍔</Text>
              </View>
              <View style={styles.orderItemDetails}>
                <Text style={styles.orderItemName}>{item.name}</Text>
              </View>
              <Text style={styles.orderItemPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.paymentSummary}>
        <Text style={styles.paymentTitle}>Payment Summary</Text>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Subtotal</Text>
          <Text style={styles.paymentValue}>₱ {subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Tax</Text>
          <Text style={styles.paymentValue}>₱ {tax.toFixed(2)}</Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={styles.paymentLabel}>Discount</Text>
          <Text style={styles.paymentValue}>₱ {discount.toFixed(2)}</Text>
        </View>
        <View style={[styles.paymentRow, styles.paymentTotal]}>
          <Text style={styles.paymentTotalLabel}>Total</Text>
          <Text style={styles.paymentTotalValue}>₱ {total.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, styles.clearButton]}
          onPress={clearCart}
          disabled={orderItems.length === 0}
        >
          <Text style={styles.clearButtonText}>Clear</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.confirmButton]}
          onPress={confirmOrder}
          disabled={orderItems.length === 0 || isConfirmingOrder}
        >
          {isConfirmingOrder ? (
            <ActivityIndicator size="small" color="#000000" />
          ) : (
            <Ionicons name="checkmark" size={16} color="#000000" />
          )}
          <Text style={styles.confirmButtonText}>
            {isConfirmingOrder ? "Confirming..." : "Confirm Order"}
          </Text>
        </TouchableOpacity>
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
  mainContent: {
    flex: 1,
  },
  categoriesContainer: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  categoriesScroll: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: "#E5E7EB",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  categoryButtonActive: {
    backgroundColor: "#FCD34D",
  },
  categoryButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "600",
  },
  categoryButtonTextActive: {
    color: "#000000",
  },
  menuContainer: {
    flex: 1,
    padding: 20,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  menuItem: {
    width: MENU_CARD_WIDTH,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#92400E",
    padding: 15,
    minHeight: 180, // Consistent card height
  },
  menuItemContent: {
    flex: 1,
    justifyContent: "space-between",
  },
  menuItemImage: {
    aspectRatio: 1,
    backgroundColor: "#F9FAFB",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  menuItemImageText: {
    fontSize: 30,
  },
  menuItemTextContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  menuItemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#92400E",
    marginBottom: 5,
    textAlign: "left",
  },
  menuItemCategory: {
    fontSize: 10,
    color: "#A16207",
    marginBottom: 0,
    textAlign: "left",
  },
  menuItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    paddingTop: 10,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400E",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  quantityButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#92400E",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  quantityButtonAdd: {
    backgroundColor: "#FCD34D",
    borderColor: "#FCD34D",
  },
  quantityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#92400E",
    minWidth: 20,
    textAlign: "center",
  },
  orderPanel: {
    width: 320,
    backgroundColor: "#FFFFFF",
    borderLeftWidth: 1,
    borderLeftColor: "#E5E7EB",
    padding: 20,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
  orderNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 15,
  },
  orderTypeButtons: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },
  orderTypeButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  orderTypeButtonActive: {
    backgroundColor: "#FCD34D",
    borderColor: "#FCD34D",
  },
  orderTypeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  orderTypeButtonTextActive: {
    color: "#000000",
  },
  customerNameContainer: {
    marginBottom: 20,
  },
  customerNameLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  customerNameInput: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1F2937",
    backgroundColor: "#FFFFFF",
  },
  orderItems: {
    flex: 1,
    maxHeight: 200,
    marginBottom: 20,
  },
  emptyCart: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyCartText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 10,
  },
  emptyCartSubtext: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 5,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  orderItemControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  orderItemButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  orderItemButtonAdd: {
    backgroundColor: "#FCD34D",
    borderColor: "#FCD34D",
  },
  orderItemQuantity: {
    fontSize: 12,
    fontWeight: "600",
    minWidth: 25,
    textAlign: "center",
  },
  orderItemImage: {
    width: 30,
    height: 30,
    backgroundColor: "#F9FAFB",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItemImageText: {
    fontSize: 16,
  },
  orderItemDetails: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1F2937",
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F97316",
  },
  paymentSummary: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 15,
    marginBottom: 20,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  paymentValue: {
    fontSize: 14,
    color: "#1F2937",
  },
  paymentTotal: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    marginTop: 5,
  },
  paymentTotalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  paymentTotalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1F2937",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 5,
  },
  clearButton: {
    backgroundColor: "#DC2626",
    borderWidth: 1,
    borderColor: "#DC2626",
  },
  clearButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  confirmButton: {
    backgroundColor: "#FCD34D",
  },
  confirmButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "600",
  },
})
