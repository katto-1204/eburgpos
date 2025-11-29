import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function AdminDashboard() {
  const adminFeatures = [
    {
      title: "User Management",
      description: "Manage staff accounts and permissions",
      icon: "people",
      color: "#3B82F6",
    },
    {
      title: "Sales Analytics",
      description: "View detailed sales reports and analytics",
      icon: "analytics",
      color: "#10B981",
    },
    {
      title: "Menu Management",
      description: "Add, edit, or remove menu items",
      icon: "restaurant",
      color: "#F59E0B",
    },
    {
      title: "Inventory Control",
      description: "Monitor and manage inventory levels",
      icon: "cube",
      color: "#8B5CF6",
    },

  ]

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FCD34D", "#F59E0B"]} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MB</Text>
            </View>
            <View>
              <Text style={styles.brandName}>MINUTE BURGER</Text>
              <Text style={styles.adminLabel}>Admin Dashboard</Text>
            </View>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
            <Ionicons name="log-out-outline" size={20} color="#92400E" />
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome, Administrator</Text>
          <Text style={styles.welcomeSubtitle}>Manage your restaurant operations from this central dashboard</Text>
        </View>

        <View style={styles.featuresGrid}>
          {adminFeatures.map((feature, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.featureCard, { borderLeftColor: feature.color }]}
              onPress={() => {
                // Navigate to specific admin feature
                if (feature.title === "User Management") {
                  router.push("/admin/users")
                } else if (feature.title === "Sales Analytics") {
                  router.push("/admin/sales")
                } else if (feature.title === "Menu Management") {
                  router.push("/admin/menu")
                } else if (feature.title === "Inventory Control") {
                  router.push("/admin/inventory")
                } else {
                  console.log(`Navigate to ${feature.title}`)
                }
              }}
            >
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Ionicons name={feature.icon as any} size={24} color="#FFFFFF" />
              </View>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Quick Stats</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>₱25,430</Text>
              <Text style={styles.statLabel}>Today's Sales</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>142</Text>
              <Text style={styles.statLabel}>Orders Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Active Staff</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>95%</Text>
              <Text style={styles.statLabel}>System Uptime</Text>
            </View>
          </View>
        </View>

        {/* Quick Access to POS */}
        <View style={styles.posSection}>
          <TouchableOpacity style={styles.posButton} onPress={() => router.push("/cashier")}>
            <Ionicons name="storefront" size={24} color="#FFFFFF" />
            <Text style={styles.posButtonText}>Access POS System</Text>
          </TouchableOpacity>
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
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FCD34D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#92400E",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
  },
  adminLabel: {
    fontSize: 14,
    color: "#A16207",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  logoutText: {
    marginLeft: 5,
    color: "#92400E",
    fontWeight: "600",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  welcomeSection: {
    paddingVertical: 30,
    alignItems: "center",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
  },
  featuresGrid: {
    marginBottom: 30,
  },
  featureCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 20,
    marginBottom: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 5,
  },
  featureDescription: {
    fontSize: 14,
    color: "#6B7280",
  },
  statsSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 15,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
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
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#6B7280",
  },
  posSection: {
    alignItems: "center",
    paddingBottom: 30,
  },
  posButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1F2937",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  posButtonText: {
    marginLeft: 10,
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
