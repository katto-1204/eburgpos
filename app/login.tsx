"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

export default function LoginScreen() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState<"admin" | "cashier">("cashier")

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert("Error", "Please enter both username and password")
      return
    }

    // Simple authentication logic
    if (selectedRole === "admin" && username === "admin" && password === "admin123") {
      router.replace("/admin")
    } else if (selectedRole === "cashier" && username === "cashier" && password === "cashier123") {
      router.replace("/cashier")
    } else {
      Alert.alert("Error", "Invalid credentials")
    }
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#FCD34D", "#F59E0B", "#D97706"]} style={styles.gradient}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#92400E" />
            </TouchableOpacity>
            <View style={styles.logoSection}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoText}>MB</Text>
              </View>
              <Text style={styles.brandName}>MINUTE BURGER</Text>
            </View>
          </View>

          {/* Login Form */}
          <View style={styles.loginForm}>
            <Text style={styles.loginTitle}>Staff Login</Text>

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.roleLabel}>Select Role:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[styles.roleButton, selectedRole === "cashier" && styles.roleButtonActive]}
                  onPress={() => setSelectedRole("cashier")}
                >
                  <Ionicons name="person" size={20} color={selectedRole === "cashier" ? "#FFFFFF" : "#92400E"} />
                  <Text style={[styles.roleButtonText, selectedRole === "cashier" && styles.roleButtonTextActive]}>
                    Cashier
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.roleButton, selectedRole === "admin" && styles.roleButtonActive]}
                  onPress={() => setSelectedRole("admin")}
                >
                  <Ionicons
                    name="shield-checkmark"
                    size={20}
                    color={selectedRole === "admin" ? "#FFFFFF" : "#92400E"}
                  />
                  <Text style={[styles.roleButtonText, selectedRole === "admin" && styles.roleButtonTextActive]}>
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Input Fields */}
            <View style={styles.inputSection}>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>

            {/* Demo Credentials */}
            <View style={styles.demoSection}>
              <Text style={styles.demoTitle}>Demo Credentials:</Text>
              <Text style={styles.demoText}>Cashier: cashier / cashier123</Text>
              <Text style={styles.demoText}>Admin: admin / admin123</Text>
            </View>
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
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
    marginRight: 20,
  },
  logoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FCD34D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#92400E",
  },
  brandName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#92400E",
  },
  loginForm: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    maxWidth: 500,
    alignSelf: "center",
    width: "100%",
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 40,
  },
  roleSection: {
    width: "100%",
    marginBottom: 30,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 10,
  },
  roleButtons: {
    flexDirection: "row",
    gap: 15,
  },
  roleButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  roleButtonActive: {
    backgroundColor: "#1F2937",
    borderColor: "#1F2937",
  },
  roleButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#92400E",
  },
  roleButtonTextActive: {
    color: "#FFFFFF",
  },
  inputSection: {
    width: "100%",
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: "#1F2937",
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#1F2937",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  demoSection: {
    alignItems: "center",
  },
  demoTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
    marginBottom: 5,
  },
  demoText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 2,
  },
})
