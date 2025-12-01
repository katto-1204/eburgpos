import { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, StyleSheet, Modal, Image } from "react-native"
import { router } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { supabase } from "../../utils/supabaseClient"

interface GCashPaymentProps {
  visible: boolean
  onClose: () => void
  totalAmount: number
  orderId?: number
  onPaymentComplete: (transactionId: string) => void
}

export default function GCashPayment({
  visible,
  onClose,
  totalAmount,
  orderId,
  onPaymentComplete,
}: GCashPaymentProps) {
  const [showQRModal, setShowQRModal] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [transactionId, setTransactionId] = useState("")

  useEffect(() => {
    if (visible) {
      setShowQRModal(true)
    }
  }, [visible])

  const handleConfirmPayment = async () => {
    // Generate transaction ID
    const txId = `GC-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
    setTransactionId(txId)

    try {
      // Record payment to database
      if (orderId) {
        const { error } = await supabase.from("payment").insert({
          order_id: orderId,
          payment_date: new Date().toISOString(),
          amount_paid: totalAmount,
          payment_method: "GCash",
          payment_status: "Completed",
          transaction_id: txId,
        })

        if (error) {
          console.error("Error recording payment:", error)
        }
      }

      setShowQRModal(false)
      setShowSuccess(true)

      // Auto-close after 2 seconds
      setTimeout(() => {
        setShowSuccess(false)
        onPaymentComplete(txId)
        onClose()
      }, 2000)
    } catch (error) {
      console.error("Payment error:", error)
    }
  }

  return (
    <>
      {/* QR Code Modal */}
      <Modal visible={visible && showQRModal} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.qrModal}>
            <View style={styles.qrHeader}>
              <View style={styles.gcashLogoContainer}>
                <Text style={styles.gcashLogo}>GCash</Text>
              </View>
              <TouchableOpacity onPress={() => setShowQRModal(false)} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.qrContent}>
              <Text style={styles.scanText}>SCAN TO PAY HERE</Text>

              {/* QR Code Placeholder */}
              <View style={styles.qrCodeContainer}>
                <View style={styles.qrCode}>
                  <Text style={styles.qrPlaceholder}>QR CODE</Text>
                  <Text style={styles.qrAmount}>₱{totalAmount.toFixed(2)}</Text>
                </View>
              </View>

              <Text style={styles.merchantText}>Dragonpay</Text>
              <Text style={styles.amountText}>PHP {totalAmount.toFixed(2)}</Text>

              <TouchableOpacity style={styles.payButton} onPress={handleConfirmPayment}>
                <Text style={styles.payButtonText}>PAY PHP {totalAmount.toFixed(2)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Payment Confirmation Screen */}
      <Modal visible={visible && !showQRModal && !showSuccess} transparent animationType="slide" onRequestClose={onClose}>
        <View style={styles.overlay}>
          <View style={styles.confirmModal}>
            <View style={styles.confirmHeader}>
              <View style={styles.gcashLogoContainer}>
                <View style={styles.gcashIcon}>
                  <Text style={styles.gcashIconText}>G</Text>
                </View>
                <Text style={styles.gcashLogoText}>GCash</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <View style={styles.confirmContent}>
              <Text style={styles.merchantLabel}>Dragonpay</Text>

              <View style={styles.paymentDetails}>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>PAY WITH</Text>
                  <View style={styles.detailRight}>
                    <Text style={styles.detailLabel}>Available Balance</Text>
                    <Text style={styles.balanceAmount}>PHP 388.84</Text>
                  </View>
                </View>

                <View style={styles.methodSelector}>
                  <Text style={styles.methodText}>GCash</Text>
                  <View style={styles.radioSelected} />
                </View>
              </View>

              <View style={styles.amountSection}>
                <Text style={styles.amountLabel}>YOU ARE ABOUT TO PAY</Text>
                <Text style={styles.confirmAmount}>PHP {totalAmount.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.confirmPayButton} onPress={handleConfirmPayment}>
                <Text style={styles.confirmPayButtonText}>PAY PHP {totalAmount.toFixed(2)}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.successModal}>
            <View style={styles.successIcon}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successText}>Transaction ID: {transactionId}</Text>
            <Text style={styles.successSubtext}>Recording to database...</Text>
          </View>
        </View>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  // QR Modal Styles
  qrModal: {
    backgroundColor: "#0066CC",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    overflow: "hidden",
  },
  qrHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  gcashLogoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  gcashLogo: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 4,
  },
  qrContent: {
    padding: 24,
    alignItems: "center",
  },
  scanText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 20,
  },
  qrCodeContainer: {
    marginBottom: 20,
  },
  qrCode: {
    width: 200,
    height: 200,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  qrPlaceholder: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0066CC",
    marginBottom: 8,
  },
  qrAmount: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0066CC",
  },
  merchantText: {
    color: "#FFFFFF",
    fontSize: 14,
    marginBottom: 8,
  },
  amountText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  payButton: {
    backgroundColor: "#0052A3",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    alignItems: "center",
  },
  payButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  // Confirmation Modal Styles
  confirmModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    width: "90%",
    maxWidth: 500,
    padding: 24,
  },
  confirmHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  gcashIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#0066CC",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  gcashIconText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  gcashLogoText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0066CC",
  },
  confirmContent: {
    gap: 24,
  },
  merchantLabel: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  paymentDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  detailRight: {
    alignItems: "flex-end",
  },
  balanceAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 4,
  },
  methodSelector: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  methodText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
  },
  radioSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0066CC",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  amountSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  amountLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 8,
  },
  confirmAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1F2937",
  },
  confirmPayButton: {
    backgroundColor: "#0066CC",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  confirmPayButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Success Modal Styles
  successModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 32,
    alignItems: "center",
    width: "90%",
    maxWidth: 400,
  },
  successIcon: {
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  successText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 4,
  },
  successSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
  },
})

