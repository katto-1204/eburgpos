import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { supabase } from "../../utils/supabaseClient"

const { width, height } = Dimensions.get("window")

interface SalesData {
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingItems: Array<{
    product_id: number
    name: string
    total_quantity: number
    total_revenue: number
  }>
  salesByDate: Array<{
    date: string
    revenue: number
    orders: number
  }>
}

export default function SalesAnalytics() {
  const [salesData, setSalesData] = useState<SalesData>({
    totalRevenue: 0,
    totalOrders: 0,
    averageOrderValue: 0,
    topSellingItems: [],
    salesByDate: [],
  })
  const [loading, setLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState<"today" | "week" | "month" | "year">("month")

  useEffect(() => {
    fetchSalesData()
  }, [timeFilter])

  const fetchSalesData = async () => {
    setLoading(true)
    try {
      const now = new Date()
      let startDate: Date

      switch (timeFilter) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
      }

      // Fetch total revenue and orders
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("total_amount, order_date")
        .gte("order_date", startDate.toISOString())
        .eq("status", "Completed")

      if (orderError) throw orderError

      const totalRevenue = orderData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0
      const totalOrders = orderData?.length || 0
      const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

      // Fetch top selling items
      const { data: topItemsData, error: topItemsError } = await supabase
        .from("order_product")
        .select(`
          product_id,
          quantity,
          unit_price,
          orders!inner(order_date, status)
        `)
        .gte("orders.order_date", startDate.toISOString())
        .eq("orders.status", "Completed")

      if (topItemsError) throw topItemsError

      // Group by product and calculate totals
      const productMap = new Map()
      topItemsData?.forEach(item => {
        const key = item.product_id
        if (!productMap.has(key)) {
          productMap.set(key, {
            product_id: key,
            total_quantity: 0,
            total_revenue: 0,
          })
        }
        const product = productMap.get(key)
        product.total_quantity += item.quantity || 0
        product.total_revenue += (item.quantity || 0) * (item.unit_price || 0)
      })

      // Get product names
      const productIds = Array.from(productMap.keys())
      const { data: productNames, error: productNamesError } = await supabase
        .from("product")
        .select("product_id, name")
        .in("product_id", productIds)

      if (productNamesError) throw productNamesError

      const productNameMap = new Map(productNames?.map(p => [p.product_id, p.name]) || [])

      const topSellingItems = Array.from(productMap.values())
        .map(item => ({
          ...item,
          name: productNameMap.get(item.product_id) || `Product #${item.product_id}`,
        }))
        .sort((a, b) => b.total_quantity - a.total_quantity)
        .slice(0, 5)

      // Fetch sales by date
      const { data: salesByDateData, error: salesByDateError } = await supabase
        .from("orders")
        .select("total_amount, order_date")
        .gte("order_date", startDate.toISOString())
        .eq("status", "Completed")
        .order("order_date")

      if (salesByDateError) throw salesByDateError

      // Group by date
      const dateMap = new Map()
      salesByDateData?.forEach(order => {
        const date = new Date(order.order_date).toDateString()
        if (!dateMap.has(date)) {
          dateMap.set(date, { revenue: 0, orders: 0 })
        }
        const day = dateMap.get(date)
        day.revenue += order.total_amount || 0
        day.orders += 1
      })

      const salesByDate = Array.from(dateMap.entries()).map(([date, data]) => ({
        date,
        revenue: data.revenue,
        orders: data.orders,
      }))

      setSalesData({
        totalRevenue,
        totalOrders,
        averageOrderValue,
        topSellingItems,
        salesByDate,
      })
    } catch (error) {
      console.error("Error fetching sales data:", error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return `₱${amount.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const timeFilterOptions = [
    { label: "Today", value: "today" as const },
    { label: "This Week", value: "week" as const },
    { label: "This Month", value: "month" as const },
    { label: "This Year", value: "year" as const },
  ]

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#92400E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sales Analytics</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Time Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterTitle}>Time Period:</Text>
          <View style={styles.filterButtons}>
            {timeFilterOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[styles.filterButton, timeFilter === option.value && styles.filterButtonActive]}
                onPress={() => setTimeFilter(option.value)}
              >
                <Text style={[styles.filterButtonText, timeFilter === option.value && styles.filterButtonTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Key Metrics */}
        <View style={styles.metricsSection}>
          <Text style={styles.sectionTitle}>Key Metrics</Text>
          <View style={styles.metricsGrid}>
            <View style={[styles.metricCard, { backgroundColor: "#10B981" }]}>
              <Ionicons name="cash" size={24} color="#FFFFFF" />
              <Text style={styles.metricValue}>{formatCurrency(salesData.totalRevenue)}</Text>
              <Text style={styles.metricLabel}>Total Revenue</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: "#3B82F6" }]}>
              <Ionicons name="receipt" size={24} color="#FFFFFF" />
              <Text style={styles.metricValue}>{salesData.totalOrders}</Text>
              <Text style={styles.metricLabel}>Total Orders</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: "#F59E0B" }]}>
              <Ionicons name="trending-up" size={24} color="#FFFFFF" />
              <Text style={styles.metricValue}>{formatCurrency(salesData.averageOrderValue)}</Text>
              <Text style={styles.metricLabel}>Average Order Value</Text>
            </View>

            <View style={[styles.metricCard, { backgroundColor: "#8B5CF6" }]}>
              <Ionicons name="bar-chart" size={24} color="#FFFFFF" />
              <Text style={styles.metricValue}>
                {salesData.salesByDate.length > 0
                  ? Math.round((salesData.totalRevenue / salesData.salesByDate.length) * 100) / 100
                  : 0}
              </Text>
              <Text style={styles.metricLabel}>Daily Average</Text>
            </View>
          </View>
        </View>

        {/* Top Selling Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Selling Items</Text>
          <View style={styles.topItemsList}>
            {salesData.topSellingItems.map((item, index) => (
              <View key={item.product_id} style={styles.topItemCard}>
                <View style={styles.itemRank}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemStats}>
                    {item.total_quantity} sold • {formatCurrency(item.total_revenue)}
                  </Text>
                </View>
                <View style={styles.itemProgress}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${(item.total_quantity / (salesData.topSellingItems[0]?.total_quantity || 1)) * 100}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
            {salesData.topSellingItems.length === 0 && !loading && (
              <Text style={styles.emptyText}>No sales data available for this period</Text>
            )}
          </View>
        </View>

        {/* Sales Trend */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sales Trend</Text>
          <View style={styles.trendChart}>
            {salesData.salesByDate.map((day, index) => (
              <View key={index} style={styles.trendBar}>
                <View
                  style={[
                    styles.trendBarFill,
                    {
                      height: Math.max(
                        20,
                        (day.revenue / (Math.max(...salesData.salesByDate.map(d => d.revenue)) || 1)) * 120
                      ),
                    },
                  ]}
                />
                <Text style={styles.trendBarLabel}>
                  {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Text>
                <Text style={styles.trendBarValue}>{formatCurrency(day.revenue)}</Text>
              </View>
            ))}
            {salesData.salesByDate.length === 0 && !loading && (
              <Text style={styles.emptyText}>No sales data available for this period</Text>
            )}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryGrid}>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>{salesData.totalOrders}</Text>
              <Text style={styles.summaryLabel}>Orders</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {salesData.salesByDate.length > 0 ? Math.round(salesData.totalOrders / salesData.salesByDate.length) : 0}
              </Text>
              <Text style={styles.summaryLabel}>Orders/Day</Text>
            </View>
            <View style={styles.summaryCard}>
              <Text style={styles.summaryValue}>
                {salesData.salesByDate.length > 0
                  ? Math.max(...salesData.salesByDate.map(d => d.orders))
                  : 0}
              </Text>
              <Text style={styles.summaryLabel}>Peak Orders/Day</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  backButton: {
    marginRight: 16,
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#1F2937",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 10,
  },
  filterButtons: {
    flexDirection: "row",
    gap: 10,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#E5E7EB",
  },
  filterButtonActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  filterButtonText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  filterButtonTextActive: {
    color: "#FFFFFF",
  },
  metricsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  metricsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  metricCard: {
    flex: 1,
    minWidth: width > 600 ? 200 : 150,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 12,
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: "#FFFFFF",
    opacity: 0.95,
    textAlign: "center",
    fontWeight: "600",
  },
  section: {
    marginBottom: 30,
  },
  topItemsList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topItemCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  itemRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  rankText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#6B7280",
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 2,
  },
  itemStats: {
    fontSize: 14,
    color: "#6B7280",
  },
  itemProgress: {
    width: 80,
    height: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 4,
    marginLeft: 15,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#10B981",
    borderRadius: 4,
  },
  trendChart: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#F3F4F6",
  },
  trendBar: {
    alignItems: "center",
    flex: 1,
    marginHorizontal: 2,
  },
  trendBarFill: {
    width: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 4,
    minHeight: 20,
  },
  trendBarLabel: {
    fontSize: 10,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  trendBarValue: {
    fontSize: 10,
    color: "#1F2937",
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },
  summaryGrid: {
    flexDirection: "row",
    gap: 15,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 16,
    padding: 20,
  },
})
