import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import Sidebar from "../../components/Sidebar"
import Header from "../../components/Header"

export default function CashierProfile() {
  const cashierData = {
    name: "Maria Santos",
    position: "Senior Cashier",
    employeeId: "EMP-001",
    shift: "Morning (8:00 AM - 4:00 PM)",
    todaySales: 25430.5,
    ordersProcessed: 142,
    joinDate: "January 15, 2023",
    performance: {
      accuracy: 98.5,
      speed: 92.3,
      customerRating: 4.8,
    },
    achievements: [
      { title: "Top Performer", description: "Highest sales this month", icon: "trophy" },
      { title: "Customer Favorite", description: "5-star rating streak", icon: "star" },
      { title: "Speed Demon", description: "Fastest order processing", icon: "flash" },
    ],
  }

  return (
    <View style={styles.container}>
      <Sidebar />
      <View style={styles.content}>
        <Header showSearch={false} />

        <View style={styles.pageHeader}>
          <View style={styles.headerContent}>
            <Ionicons name="person" size={24} color="#F97316" />
            <Text style={styles.pageTitle}>Cashier Profile</Text>
          </View>
          <Text style={styles.pageSubtitle}>Your account information and performance</Text>
        </View>

        <ScrollView style={styles.profileContainer} showsVerticalScrollIndicator={false}>
          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarSection}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={40} color="#F97316" />
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{cashierData.name}</Text>
                <Text style={styles.profilePosition}>{cashierData.position}</Text>
                <Text style={styles.profileId}>ID: {cashierData.employeeId}</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.editButton}>
              <Ionicons name="create-outline" size={20} color="#F97316" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>

          {/* Work Information */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Work Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoCard}>
                <Ionicons name="time" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Current Shift</Text>
                <Text style={styles.infoValue}>{cashierData.shift}</Text>
              </View>

              <View style={styles.infoCard}>
                <Ionicons name="calendar" size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Join Date</Text>
                <Text style={styles.infoValue}>{cashierData.joinDate}</Text>
              </View>
            </View>
          </View>

          {/* Today's Performance */}
          <View style={styles.performanceSection}>
            <Text style={styles.sectionTitle}>Today's Performance</Text>
            <View style={styles.performanceGrid}>
              <View style={styles.performanceCard}>
                <Text style={styles.performanceValue}>₱{cashierData.todaySales.toLocaleString()}</Text>
                <Text style={styles.performanceLabel}>Sales Generated</Text>
                <Ionicons name="trending-up" size={20} color="#10B981" style={styles.performanceIcon} />
              </View>

              <View style={styles.performanceCard}>
                <Text style={styles.performanceValue}>{cashierData.ordersProcessed}</Text>
                <Text style={styles.performanceLabel}>Orders Processed</Text>
                <Ionicons name="receipt" size={20} color="#2563EB" style={styles.performanceIcon} />
              </View>
            </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.metricsSection}>
            <Text style={styles.sectionTitle}>Performance Metrics</Text>
            <View style={styles.metricsGrid}>
              <View style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.metricLabel}>Accuracy</Text>
                </View>
                <Text style={styles.metricValue}>{cashierData.performance.accuracy}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${cashierData.performance.accuracy}%`, backgroundColor: "#10B981" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Ionicons name="flash" size={20} color="#F59E0B" />
                  <Text style={styles.metricLabel}>Speed</Text>
                </View>
                <Text style={styles.metricValue}>{cashierData.performance.speed}%</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${cashierData.performance.speed}%`, backgroundColor: "#F59E0B" },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.metricItem}>
                <View style={styles.metricHeader}>
                  <Ionicons name="star" size={20} color="#7C3AED" />
                  <Text style={styles.metricLabel}>Customer Rating</Text>
                </View>
                <Text style={styles.metricValue}>{cashierData.performance.customerRating}/5</Text>
                <View style={styles.progressBar}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${(cashierData.performance.customerRating / 5) * 100}%`, backgroundColor: "#7C3AED" },
                    ]}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Achievements */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Achievements</Text>
            <View style={styles.achievementsGrid}>
              {cashierData.achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Ionicons name={achievement.icon as any} size={24} color="#F97316" />
                  </View>
                  <Text style={styles.achievementTitle}>{achievement.title}</Text>
                  <Text style={styles.achievementDescription}>{achievement.description}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="settings-outline" size={20} color="#6B7280" />
              <Text style={styles.actionButtonText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="help-circle-outline" size={20} color="#6B7280" />
              <Text style={styles.actionButtonText}>Help & Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={() => router.replace("/")}>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
              <Text style={[styles.actionButtonText, styles.logoutButtonText]}>Sign Out</Text>
            </TouchableOpacity>
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
    paddingTop: 70,
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
  profileContainer: {
    flex: 1,
    padding: 20,
  },
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 4,
  },
  profilePosition: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: "#9CA3AF",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#F97316",
  },
  editButtonText: {
    color: "#F97316",
    fontWeight: "600",
  },
  infoSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 16,
  },
  infoGrid: {
    flexDirection: "row",
    gap: 16,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  performanceSection: {
    marginBottom: 20,
  },
  performanceGrid: {
    flexDirection: "row",
    gap: 16,
  },
  performanceCard: {
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
  performanceValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  performanceLabel: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  performanceIcon: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  metricsSection: {
    marginBottom: 20,
  },
  metricsGrid: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    gap: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricItem: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "#E5E7EB",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  achievementsSection: {
    marginBottom: 20,
  },
  achievementsGrid: {
    flexDirection: "row",
    gap: 16,
  },
  achievementCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FEF3C7",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 4,
  },
  achievementDescription: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
  },
  actionsSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  actionButtonText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "600",
  },
  logoutButton: {
    borderBottomWidth: 0,
  },
  logoutButtonText: {
    color: "#EF4444",
  },
})
