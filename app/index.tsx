import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from "react-native"
import { router } from "expo-router"

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../images/bg-welcome.png")}
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* Center logo in the middle */}
          <Image
            source={require("../images/minburg-welcome.png")}
            style={styles.centerLogo}
            resizeMode="contain"
          />

          {/* Action Buttons under the logo */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cashierButton} onPress={() => router.push({ pathname: "/login", params: { role: "cashier" } })}>
              <Text style={styles.cashierText}>CASHIER</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adminButton} onPress={() => router.push({ pathname: "/login", params: { role: "admin" } })}>
              <Text style={styles.adminText}>ADMIN</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  centerLogo: {
    width: "90%",
    height: 700,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 32,
  },
  cashierButton: {
    backgroundColor: "#FF8A00", 
    paddingHorizontal: 40,
    paddingVertical: 14,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  cashierText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
  adminButton: {
    backgroundColor: "transparent",
    borderWidth: 3,
    borderColor: "#5A3A00",
    paddingHorizontal: 46,
    paddingVertical: 12,
    borderRadius: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 5,
  },
  adminText: {
    color: "#5A3A00",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
  },
})
