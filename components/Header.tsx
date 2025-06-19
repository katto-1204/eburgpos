import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface HeaderProps {
  searchQuery?: string
  onSearchChange?: (query: string) => void
  showSearch?: boolean
}

export default function Header({ searchQuery = "", onSearchChange, showSearch = true }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>MB</Text>
        </View>
        <View>
          <Text style={styles.tagline}>Best Ang Sarap</Text>
          <Text style={styles.brandName}>MINUTE BURGER</Text>
        </View>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search menu items..."
            value={searchQuery}
            onChangeText={onSearchChange}
          />
        </View>
      )}

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.cashierButton}>
          <Text style={styles.cashierButtonText}>CASHIER</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutButton} onPress={() => router.replace("/")}>
          <Ionicons name="log-out-outline" size={16} color="#6B7280" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#92400E",
  },
  tagline: {
    fontSize: 12,
    color: "#6B7280",
  },
  brandName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    borderWidth: 2,
    borderColor: "#D1D5DB",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
    color: "#1F2937",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  cashierButton: {
    backgroundColor: "#F97316",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cashierButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  logoutText: {
    color: "#6B7280",
    fontSize: 14,
  },
})
