import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"

const { width, height } = Dimensions.get("window")

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FCD34D", "#F59E0B", "#D97706"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>MB</Text>
            </View>
            <View style={styles.brandSection}>
              <Text style={styles.tagline}>Best Ang Sarap</Text>
              <Text style={styles.brandName}>MINUTE BURGER</Text>
              <Text style={styles.subtitle}>Point of Sale System</Text>
            </View>
          </View>

          {/* Welcome Message */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome to Minute Burger POS</Text>
            <Text style={styles.welcomeSubtitle}>Fast, reliable, and easy-to-use point of sale system</Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/login")}>
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/login")}>
              <Text style={styles.secondaryButtonText}>Staff Login</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>© 2024 Minute Burger. All rights reserved.</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 60,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FCD34D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#92400E",
  },
  brandSection: {
    alignItems: "flex-start",
  },
  tagline: {
    fontSize: 16,
    color: "#92400E",
    marginBottom: 5,
  },
  brandName: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#92400E",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: "#A16207",
    fontWeight: "600",
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: 60,
  },
  welcomeTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
    marginBottom: 15,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "#4B5563",
    textAlign: "center",
    maxWidth: 600,
  },
  buttonSection: {
    flexDirection: "row",
    gap: 20,
    marginBottom: 40,
  },
  primaryButton: {
    backgroundColor: "#1F2937",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "#1F2937",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
  },
  secondaryButtonText: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    position: "absolute",
    bottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
  },
})
