import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState, useEffect } from "react"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import type { CompletedOrder } from "../../types"
import { supabase } from "../../utils/supabaseClient"

export default function OrderHistory() {
  const [orders, setOrders] = useState<CompletedOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch orders with their order_product items
        const { data: orderRows, error } = await supabase
          .from("orders")
          .select("order_id, customer_name, total_amount, order_date, status, notes")
          .order("order_date", { ascending: false })

        if (error) {
          console.error("Error fetching orders:", error)
          setError("Failed to load orders")
          return
        }

        if (!orderRows || orderRows.length === 0) {
          setOrders([])
          return
        }

        // Build complete order objects with items
        const builtOrders: CompletedOrder[] = []

        for (const row of orderRows) {
          // Fetch order items for this order
          const { data: itemRows, error: itemsError } = await supabase
            .from("order_product")
            .select("product_id, quantity, unit_price")
            .eq("order_id", row.order_id)

          if (itemsError) {
            console.error("Error fetching order items for order", row.order_id, itemsError)
            continue
          }

          // Get product details for each item
          const items = []
          for (const itemRow of itemRows || []) {
            const { data: productData, error: productError } = await supabase
              .from("product")
              .select("name, category:category(name)")
              .eq("product_id", itemRow.product_id)
              .maybeSingle()

            if (productError || !productData) {
              console.warn("Product not found for ID:", itemRow.product_id)
              continue
            }

            items.push({
              id: String(itemRow.product_id),
              name: productData.name,
              category: (productData.category as any)?.name || "Uncategorized",
              price: itemRow.unit_price,
              image: "",
              quantity: itemRow.quantity,
            })
          }

          // Determine order type from notes field
          const orderType = (row.notes === "Take Out" ? "Take Out" : "Dine In") as "Dine In" | "Take Out"

          builtOrders.push({
            id: String(row.order_id),
            customerName: row.customer_name || "Walk-in Customer",
            items,
            total: row.total_amount,
            orderType,
            timestamp: new Date(row.order_date),
            status: (row.status as "Completed" | "Pending" | "Cancelled") || "Completed",
          })
        }

        setOrders(builtOrders)
      } catch (err) {
        console.error("Unexpected error fetching orders:", err)
        setError("An unexpected error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>
        <Header showSearch={false} />

        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <Ionicons name="time" size={24} color="#F97316" />
            <Text style={styles.pageTitle}>Order History</Text>
          </View>
          <Text style={styles.pageSubtitle}>View all completed and pending orders</Text>
        </View>

        <ScrollView style={styles.ordersContainer} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <ActivityIndicator size="large" color="#F97316" />
              <Text style={{ marginTop: 16, fontSize: 16, color: "#6B7280" }}>Loading orders...</Text>
            </View>
          ) : error ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={{ marginTop: 16, fontSize: 16, color: "#EF4444", textAlign: "center" }}>
                {error}
              </Text>
            </View>
          ) : orders.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 40 }}>
              <Ionicons name="receipt-outline" size={48} color="#9CA3AF" />
              <Text style={{ marginTop: 16, fontSize: 16, color: "#6B7280" }}>No orders found</Text>
              <Text style={{ marginTop: 8, fontSize: 14, color: "#9CA3AF", textAlign: "center" }}>
                Confirmed orders will appear here
              </Text>
            </View>
          ) : (
            orders.map((order) => (
              <View key={order.id} style={styles.orderCard}>
                <View style={styles.orderCardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>Order #{order.id}</Text>
                    <Text style={styles.customerName}>{order.customerName}</Text>
                  </View>
                  <View style={styles.orderCardRight}>
                    <Text style={styles.orderTotal}>₱{order.total.toFixed(2)}</Text>
                    <Text style={styles.orderType}>{order.orderType}</Text>
                  </View>
                </View>

                <Text style={styles.orderTimestamp}>{order.timestamp.toLocaleString()}</Text>

                <View style={styles.orderItems}>
                  {order.items.map((item) => (
                    <View key={item.id} style={styles.orderItemRow}>
                      <Text style={styles.orderItemText}>
                        {item.quantity}x {item.name}
                      </Text>
                      <Text style={styles.orderItemPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.orderFooter}>
                  <View
                    style={[
                      styles.statusBadge,
                      order.status === "Completed" ? styles.statusCompleted : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        order.status === "Completed" ? styles.statusTextCompleted : styles.statusTextPending,
                      ]}
                    >
                      {order.status}
                    </Text>
                  </View>

                  <TouchableOpacity style={styles.viewButton}>
                    <Text style={styles.viewButtonText}>View Details</Text>
                    <Ionicons name="chevron-forward" size={16} color="#F97316" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
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
    paddingTop: 0,
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
  ordersContainer: {
    flex: 1,
    padding: 20,
  },
  orderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  orderNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F97316",
    marginBottom: 4,
  },
  customerName: {
    fontSize: 16,
    color: "#1F2937",
    fontWeight: "600",
  },
  orderCardRight: {
    alignItems: "flex-end",
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  orderType: {
    fontSize: 14,
    color: "#6B7280",
  },
  orderTimestamp: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 16,
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderItemText: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusCompleted: {
    backgroundColor: "#D1FAE5",
  },
  statusPending: {
    backgroundColor: "#FEF3C7",
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statusTextCompleted: {
    color: "#065F46",
  },
  statusTextPending: {
    color: "#92400E",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#F97316",
  },
})
