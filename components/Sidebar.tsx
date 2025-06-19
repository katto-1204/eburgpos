"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router, usePathname } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

export default function Sidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    {
      id: "menu",
      route: "/cashier",
      icon: "grid",
      label: "Menu",
      isGrid: true,
    },
    {
      id: "orders",
      route: "/cashier/orders",
      icon: "time",
      label: "Order\nHistory",
    },
    {
      id: "sales",
      route: "/cashier/sales",
      icon: "stats-chart",
      label: "Sales\nReport",
    },
    {
      id: "inventory",
      route: "/cashier/inventory",
      icon: "cube",
      label: "Inventory",
    },
    {
      id: "profile",
      route: "/cashier/profile",
      icon: "person",
      label: "Profile",
    },
  ]

  const isActive = (route: string) => {
    if (route === "/cashier") {
      return pathname === "/cashier"
    }
    return pathname === route
  }

  return (
    <View style={styles.sidebar}>
      <Text style={styles.sidebarTitle}>BURG</Text>

      <View style={styles.sidebarButtons}>
        {sidebarItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.sidebarButton, isActive(item.route) && styles.sidebarButtonActive]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={styles.sidebarIcon}>
              {item.isGrid ? (
                <View style={styles.menuGrid}>
                  <View style={styles.menuGridItem} />
                  <View style={styles.menuGridItem} />
                  <View style={styles.menuGridItem} />
                  <View style={styles.menuGridItem} />
                </View>
              ) : (
                <Ionicons name={item.icon as any} size={16} color="#FFFFFF" />
              )}
            </View>
            <Text style={styles.sidebarButtonText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    backgroundColor: "#FCD34D",
    paddingVertical: 20,
    alignItems: "center",
  },
  sidebarTitle: {
    color: "#000000",
    fontWeight: "bold",
    fontSize: 14,
    transform: [{ rotate: "-90deg" }],
    marginBottom: 40,
  },
  sidebarButtons: {
    flex: 1,
    gap: 30,
  },
  sidebarButton: {
    alignItems: "center",
    gap: 8,
    opacity: 0.7,
  },
  sidebarButtonActive: {
    opacity: 1,
  },
  sidebarIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#000000",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  menuGrid: {
    width: 24,
    height: 24,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 2,
  },
  menuGridItem: {
    width: 10,
    height: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
  },
  sidebarButtonText: {
    color: "#000000",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
})
