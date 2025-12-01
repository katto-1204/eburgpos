import { View, Text, TouchableOpacity, StyleSheet, Modal } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"

interface PaymentMethodModalProps {
  visible: boolean
  onClose: () => void
  totalAmount: number
  onSelectMethod: (method: "Cash" | "PayPal" | "Credit Card" | "GCash") => void
}

export default function PaymentMethodModal({
  visible,
  onClose,
  totalAmount,
  onSelectMethod,
}: PaymentMethodModalProps) {
  const paymentMethods = [
    { id: "cash", name: "Cash", icon: "cash", color: "#10B981" },
    { id: "paypal", name: "PayPal", icon: "logo-paypal", color: "#003087" },
    { id: "credit", name: "Credit Card", icon: "card", color: "#3B82F6" },
    { id: "gcash", name: "GCash", icon: "wallet", color: "#0066CC" },
  ]

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Select Payment Method</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amount}>₱{totalAmount.toFixed(2)}</Text>
          </View>

          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodButton, { borderLeftColor: method.color }]}
                onPress={() => {
                  onSelectMethod(method.name as "Cash" | "PayPal" | "Credit Card" | "GCash")
                  onClose()
                }}
              >
                <View style={[styles.methodIcon, { backgroundColor: method.color }]}>
                  <Ionicons name={method.icon as any} size={24} color="#FFFFFF" />
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  amountContainer: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
  },
  methodsContainer: {
    gap: 12,
  },
  methodButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderLeftWidth: 4,
    borderRadius: 12,
    padding: 16,
    gap: 16,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  methodName: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1F2937",
  },
})

