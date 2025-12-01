"use client"

import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { router, usePathname } from "expo-router"

// SVG-like icon components
const MenuIcon = () => (
  <View style={styles.svgIcon}>
    <View style={styles.menuGrid}>
      <View style={styles.menuGridItem} />
      <View style={styles.menuGridItem} />
      <View style={styles.menuGridItem} />
      <View style={styles.menuGridItem} />
    </View>
  </View>
)

const OrderHistoryIcon = () => (
  <View style={styles.svgIcon}>
    <View style={styles.clockOuter}>
      <View style={styles.clockCenter} />
      <View style={styles.clockHandContainer}>
        <View style={styles.clockHandHour} />
        <View style={styles.clockHandMinute} />
      </View>
    </View>
  </View>
)

const InventoryIcon = () => (
  <View style={styles.svgIcon}>
    <View style={styles.cubeContainer}>
      <View style={styles.cubeFace} />
      <View style={styles.cubeFaceRight} />
      <View style={styles.cubeFaceTop} />
    </View>
  </View>
)

const ProfileIcon = () => (
  <View style={styles.svgIcon}>
    <View style={styles.profileContainer}>
      <View style={styles.profileHead} />
      <View style={styles.profileBody} />
    </View>
  </View>
)

const LogoutIcon = () => (
  <View style={styles.svgIcon}>
    <View style={styles.logoutContainer}>
      <View style={styles.logoutLine} />
      <View style={styles.logoutArrow} />
    </View>
  </View>
)

export default function Sidebar() {
  const pathname = usePathname()

  const sidebarItems = [
    {
      id: "menu",
      route: "/cashier",
      label: "Menu",
      icon: MenuIcon,
    },
    {
      id: "orders",
      route: "/cashier/orders",
      label: "Order\nHistory",
      icon: OrderHistoryIcon,
    },
    {
      id: "inventory",
      route: "/cashier/inventory",
      label: "Inventory",
      icon: InventoryIcon,
    },
    {
      id: "profile",
      route: "/cashier/profile",
      label: "Profile",
      icon: ProfileIcon,
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
        {sidebarItems.map((item) => {
          const IconComponent = item.icon
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.sidebarButton, isActive(item.route) && styles.sidebarButtonActive]}
              onPress={() => router.push(item.route as any)}
            >
              <View style={styles.sidebarIcon}>
                <IconComponent />
              </View>
              <Text style={styles.sidebarButtonText}>{item.label}</Text>
            </TouchableOpacity>
          )
        })}
      </View>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => router.replace("/")}
      >
        <View style={styles.sidebarIcon}>
          <LogoutIcon />
        </View>
        <Text style={styles.sidebarButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  sidebar: {
    width: 80,
    backgroundColor: "#FCD34D",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "space-between",
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
    justifyContent: "flex-start",
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
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarButtonText: {
    color: "#000000",
    fontSize: 10,
    textAlign: "center",
    fontWeight: "600",
  },
  logoutButton: {
    alignItems: "center",
    gap: 8,
    opacity: 0.7,
    marginTop: "auto",
    paddingTop: 20,
  },
  // SVG Icon Styles
  svgIcon: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  // Menu Grid Icon
  menuGrid: {
    width: 20,
    height: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 3,
  },
  menuGridItem: {
    width: 8,
    height: 8,
    backgroundColor: "#000000",
    borderRadius: 1,
  },
  // Clock Icon (Order History)
  clockOuter: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: "#000000",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  clockCenter: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#000000",
    position: "absolute",
  },
  clockHandContainer: {
    position: "absolute",
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  clockHandHour: {
    position: "absolute",
    width: 1.5,
    height: 5,
    backgroundColor: "#000000",
    top: 4,
    left: 8.25,
    transform: [{ rotate: "-30deg" }],
  },
  clockHandMinute: {
    position: "absolute",
    width: 1,
    height: 6,
    backgroundColor: "#000000",
    top: 3,
    left: 8.5,
    transform: [{ rotate: "45deg" }],
  },
  // Cube Icon (Inventory)
  cubeContainer: {
    width: 18,
    height: 18,
    position: "relative",
  },
  cubeFace: {
    position: "absolute",
    width: 12,
    height: 12,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    top: 3,
    left: 3,
  },
  cubeFaceRight: {
    position: "absolute",
    width: 10,
    height: 12,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    top: 5,
    left: 7,
    transform: [{ skewY: -15 }],
  },
  cubeFaceTop: {
    position: "absolute",
    width: 12,
    height: 10,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    top: 1,
    left: 4,
    transform: [{ skewX: -15 }],
  },
  // Profile Icon
  profileContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    marginBottom: 1,
  },
  profileBody: {
    width: 14,
    height: 8,
    borderWidth: 2,
    borderColor: "#000000",
    backgroundColor: "transparent",
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
  },
  // Logout Icon
  logoutContainer: {
    width: 18,
    height: 18,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  logoutLine: {
    width: 8,
    height: 2,
    backgroundColor: "#000000",
    position: "absolute",
    left: 0,
  },
  logoutArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderLeftColor: "#000000",
    borderTopWidth: 3,
    borderTopColor: "transparent",
    borderBottomWidth: 3,
    borderBottomColor: "transparent",
    position: "absolute",
    right: 0,
  },
})
