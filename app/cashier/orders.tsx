import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"
import type { CompletedOrder } from "../../types"

export default function OrderHistory() {
  // Sample order history data
  const orderHistory: CompletedOrder[] = [
    {
      id: "2127",
      customerName: "John Doe",
      items: [
        { id: "1", name: "Minute Burger", category: "Sulit Sandwiches", price: 89.0, image: "", quantity: 2 },
        { id: "9", name: "Calamantea", category: "Beverages", price: 24.0, image: "", quantity: 1 },
      ],
      total: 202.0,
      orderType: "Take Out",
      timestamp: new Date(Date.now() - 3600000),
      status: "Completed",
    },
    {
      id: "2126",
      customerName: "Jane Smith",
      items: [
        { id: "3", name: "Bacon Cheese Burger", category: "Big Time Burgers", price: 96.0, image: "", quantity: 1 },
      ],
      total: 102.0,
      orderType: "Dine In",
      timestamp: new Date(Date.now() - 7200000),
      status: "Completed",
    },
    {
      id: "2125",
      customerName: "Mike Johnson",
      items: [
        { id: "5", name: "Steak Burger", category: "Big Time Burgers", price: 136.0, image: "", quantity: 1 },
        { id: "10", name: "Iced Choco", category: "Beverages", price: 23.0, image: "", quantity: 2 },
      ],
      total: 182.0,
      orderType: "Dine In",
      timestamp: new Date(Date.now() - 10800000),
      status: "Completed",
    },
  ]

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
          {orderHistory.map((order) => (
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
          ))}
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
