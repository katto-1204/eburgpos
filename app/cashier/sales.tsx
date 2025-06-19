import { View, Text, StyleSheet, ScrollView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"

export default function SalesReport() {
  // Sample sales data
  const salesData = {
    totalSales: 25430.5,
    totalOrders: 142,
    todayOrders: 28,
    averageOrderValue: 179.23,
    topSellingItems: [
      { name: "Minute Burger", quantity: 45, revenue: 4005.0 },
      { name: "Black Pepper Burger", quantity: 32, revenue: 2848.0 },
      { name: "Bacon Cheese Burger", quantity: 28, revenue: 2688.0 },
      { name: "Steak Burger", quantity: 15, revenue: 2040.0 },
      { name: "Calamantea", quantity: 67, revenue: 1608.0 },
    ],
    recentSales: [
      { orderId: "2127", time: "2:45 PM", amount: 202.0 },
      { orderId: "2126", time: "2:30 PM", amount: 102.0 },
      { orderId: "2125", time: "2:15 PM", amount: 182.0 },
      { orderId: "2124", time: "1:58 PM", amount: 156.0 },
      { orderId: "2123", time: "1:42 PM", amount: 89.0 },
    ],
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>
        <Header showSearch={false} />

        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <Ionicons name="stats-chart" size={24} color="#F97316" />
            <Text style={styles.pageTitle}>Sales Report</Text>
          </View>
          <Text style={styles.pageSubtitle}>Track your business performance and analytics</Text>
        </View>

        <ScrollView style={styles.reportContainer} showsVerticalScrollIndicator={false}>
          {/* Key Metrics */}
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, styles.salesCard]}>
              <Text style={styles.metricValue}>₱{salesData.totalSales.toLocaleString()}</Text>
              <Text style={styles.metricLabel}>Total Sales</Text>
              <View style={styles.metricIcon}>
                <Ionicons name="trending-up" size={20} color="#059669" />
              </View>
            </View>

            <View style={[styles.metricCard, styles.ordersCard]}>
              <Text style={styles.metricValue}>{salesData.totalOrders}</Text>
              <Text style={styles.metricLabel}>Total Orders</Text>
              <View style={styles.metricIcon}>
                <Ionicons name="receipt" size={20} color="#2563EB" />
              </View>
            </View>

            <View style={[styles.metricCard, styles.todayCard]}>
              <Text style={styles.metricValue}>{salesData.todayOrders}</Text>
              <Text style={styles.metricLabel}>Today's Orders</Text>
              <View style={styles.metricIcon}>
                <Ionicons name="today" size={20} color="#F97316" />
              </View>
            </View>

            <View style={[styles.metricCard, styles.avgCard]}>
              <Text style={styles.metricValue}>₱{salesData.averageOrderValue.toFixed(2)}</Text>
              <Text style={styles.metricLabel}>Avg Order Value</Text>
              <View style={styles.metricIcon}>
                <Ionicons name="calculator" size={20} color="#7C3AED" />
              </View>
            </View>
          </View>

          {/* Top Selling Items */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Top Selling Items</Text>
            <View style={styles.topItemsContainer}>
              {salesData.topSellingItems.map((item, index) => (
                <View key={index} style={styles.topItemRow}>
                  <View style={styles.topItemRank}>
                    <Text style={styles.rankNumber}>{index + 1}</Text>
                  </View>
                  <View style={styles.topItemDetails}>
                    <Text style={styles.topItemName}>{item.name}</Text>
                    <Text style={styles.topItemQuantity}>{item.quantity} sold</Text>
                  </View>
                  <Text style={styles.topItemRevenue}>₱{item.revenue.toFixed(2)}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Recent Sales */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Sales</Text>
            <View style={styles.recentSalesContainer}>
              {salesData.recentSales.map((sale, index) => (
                <View key={index} style={styles.recentSaleRow}>
                  <View style={styles.recentSaleLeft}>
                    <Text style={styles.recentSaleOrder}>Order #{sale.orderId}</Text>
                    <Text style={styles.recentSaleTime}>{sale.time}</Text>
                  </View>
                  <Text style={styles.recentSaleAmount}>₱{sale.amount.toFixed(2)}</Text>
                </View>
              ))}
            </View>
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
  reportContainer: {
    flex: 1,
    padding: 20,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 30,
  },
  metricCard: {
    flex: 1,
    minWidth: 200,
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
  salesCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#059669",
  },
  ordersCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },
  todayCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#F97316",
  },
  avgCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#7C3AED",
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  metricIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
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
  topItemsContainer: {
    gap: 12,
  },
  topItemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  topItemRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  rankNumber: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  topItemDetails: {
    flex: 1,
  },
  topItemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  topItemQuantity: {
    fontSize: 14,
    color: "#6B7280",
  },
  topItemRevenue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
  },
  recentSalesContainer: {
    gap: 12,
  },
  recentSaleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  recentSaleLeft: {
    flex: 1,
  },
  recentSaleOrder: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  recentSaleTime: {
    fontSize: 14,
    color: "#6B7280",
  },
  recentSaleAmount: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#059669",
  },
})
