import { View, Text, TouchableOpacity, StyleSheet, Modal, ScrollView, Alert, ActivityIndicator } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import * as Print from "expo-print"
import * as Sharing from "expo-sharing"
import type { OrderItem } from "../../types"

interface ReceiptModalProps {
  visible: boolean
  onClose: () => void
  orderNumber: number
  orderItems: OrderItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: string
  transactionId?: string
  customerName: string
  orderDate: Date
}

export default function ReceiptModal({
  visible,
  onClose,
  orderNumber,
  orderItems,
  subtotal,
  tax,
  discount,
  total,
  paymentMethod,
  transactionId,
  customerName,
  orderDate,
}: ReceiptModalProps) {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true)

      // Create itemized HTML for PDF
      const itemsHTML = orderItems
        .map(
          (item) =>
            `<tr>
              <td style="text-align: left; padding: 8px 4px;">${item.name}</td>
              <td style="text-align: center; padding: 8px 4px;">x${item.quantity}</td>
              <td style="text-align: right; padding: 8px 4px;">₱${(item.price * item.quantity).toFixed(2)}</td>
            </tr>`
        )
        .join("")

      // Create HTML for PDF
      const htmlContent = `
        <html>
          <head>
            <meta charset="utf-8" />
            <style>
              body {
                font-family: Arial, sans-serif;
                width: 80mm;
                margin: 0;
                padding: 10mm;
              }
              .receipt {
                text-align: center;
              }
              .header {
                margin-bottom: 10px;
              }
              .store-name {
                font-size: 16px;
                font-weight: bold;
                margin-bottom: 4px;
              }
              .store-tagline {
                font-size: 10px;
                color: #666;
              }
              .divider {
                border-top: 1px dashed #000;
                margin: 10px 0;
              }
              .info-row {
                font-size: 10px;
                text-align: left;
                margin-bottom: 4px;
              }
              .label {
                font-weight: bold;
              }
              table {
                width: 100%;
                font-size: 10px;
                margin: 10px 0;
              }
              td {
                padding: 4px;
              }
              .totals {
                text-align: right;
                font-size: 10px;
                margin-top: 10px;
              }
              .total-row {
                margin-bottom: 4px;
              }
              .total-final {
                font-size: 14px;
                font-weight: bold;
                margin-top: 8px;
              }
              .footer {
                text-align: center;
                font-size: 10px;
                color: #666;
                margin-top: 10px;
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="store-name">MINUTE BURGER</div>
                <div class="store-tagline">Best Ang Sarap</div>
              </div>
              <div class="divider"></div>
              <div style="text-align: left; font-size: 10px;">
                <div class="info-row"><span class="label">Order #:</span> ${orderNumber}</div>
                <div class="info-row"><span class="label">Date:</span> ${orderDate.toLocaleString()}</div>
                <div class="info-row"><span class="label">Customer:</span> ${customerName}</div>
                <div class="info-row"><span class="label">Payment:</span> ${paymentMethod}</div>
                ${transactionId ? `<div class="info-row"><span class="label">Transaction:</span> ${transactionId}</div>` : ""}
              </div>
              <div class="divider"></div>
              <table>
                <tr style="border-bottom: 1px solid #000; font-weight: bold;">
                  <td style="text-align: left; padding: 8px 4px;">Item</td>
                  <td style="text-align: center; padding: 8px 4px;">Qty</td>
                  <td style="text-align: right; padding: 8px 4px;">Amount</td>
                </tr>
                ${itemsHTML}
              </table>
              <div class="divider"></div>
              <div class="totals">
                <div class="total-row">Subtotal: ₱${subtotal.toFixed(2)}</div>
                <div class="total-row">Tax: ₱${tax.toFixed(2)}</div>
                ${discount > 0 ? `<div class="total-row">Discount: -₱${discount.toFixed(2)}</div>` : ""}
                <div class="total-row total-final">TOTAL: ₱${total.toFixed(2)}</div>
              </div>
              <div class="divider"></div>
              <div class="footer">
                <div>Thank you for your order!</div>
                <div>Please come again</div>
              </div>
            </div>
          </body>
        </html>
      `

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
      })

      // Share the PDF
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          UTType: "com.adobe.pdf",
          mimeType: "application/pdf",
        })
      } else {
        Alert.alert("Success", `Receipt saved to: ${uri}`)
      }

      setIsGeneratingPDF(false)
    } catch (error) {
      console.error("Error generating receipt:", error)
      Alert.alert("Error", "Failed to generate PDF receipt")
      setIsGeneratingPDF(false)
    }
  }

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.title}>Receipt</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.receipt}>
              {/* Receipt Header */}
              <View style={styles.receiptHeader}>
                <Text style={styles.storeName}>MINUTE BURGER</Text>
                <Text style={styles.storeTagline}>Best Ang Sarap</Text>
              </View>

              <View style={styles.divider} />

              {/* Receipt Info */}
              <View style={styles.receiptInfo}>
                <Text style={styles.receiptInfoText}>Order #{orderNumber}</Text>
                <Text style={styles.receiptInfoText}>Date: {orderDate.toLocaleString()}</Text>
                <Text style={styles.receiptInfoText}>Customer: {customerName}</Text>
                <Text style={styles.receiptInfoText}>Payment: {paymentMethod}</Text>
                {transactionId && <Text style={styles.receiptInfoText}>Transaction ID: {transactionId}</Text>}
              </View>

              <View style={styles.divider} />

              {/* Items */}
              <View style={styles.itemsSection}>
                {orderItems.map((item) => (
                  <View key={item.id} style={styles.itemRow}>
                    <View style={styles.itemLeft}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemQty}>x{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemPrice}>₱{(item.price * item.quantity).toFixed(2)}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.divider} />

              {/* Totals */}
              <View style={styles.totalsSection}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Subtotal</Text>
                  <Text style={styles.totalValue}>₱{subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Tax</Text>
                  <Text style={styles.totalValue}>₱{tax.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Discount</Text>
                    <Text style={styles.totalValue}>-₱{discount.toFixed(2)}</Text>
                  </View>
                )}
                <View style={[styles.totalRow, styles.totalRowFinal]}>
                  <Text style={styles.totalLabelFinal}>TOTAL</Text>
                  <Text style={styles.totalValueFinal}>₱{total.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Thank you for your order!</Text>
                <Text style={styles.footerText}>Please come again</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.downloadButton} onPress={handleDownload} disabled={isGeneratingPDF}>
              {isGeneratingPDF ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="download-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.downloadButtonText}>Download Receipt</Text>
                </>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
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
    maxWidth: 400,
    maxHeight: "90%",
    padding: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  receipt: {
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  receiptHeader: {
    alignItems: "center",
    marginBottom: 15,
  },
  storeName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 5,
  },
  storeTagline: {
    fontSize: 14,
    color: "#6B7280",
  },
  divider: {
    borderTopWidth: 1,
    borderTopColor: "#000000",
    borderStyle: "dashed",
    marginVertical: 15,
  },
  receiptInfo: {
    marginBottom: 15,
  },
  receiptInfoText: {
    fontSize: 12,
    color: "#374151",
    marginBottom: 4,
  },
  itemsSection: {
    marginBottom: 15,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  itemLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  itemName: {
    fontSize: 14,
    color: "#1F2937",
    flex: 1,
  },
  itemQty: {
    fontSize: 12,
    color: "#6B7280",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    minWidth: 80,
    textAlign: "right",
  },
  totalsSection: {
    marginBottom: 15,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: "#374151",
  },
  totalValue: {
    fontSize: 14,
    color: "#374151",
  },
  totalRowFinal: {
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
    marginTop: 5,
  },
  totalLabelFinal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  totalValueFinal: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1F2937",
  },
  footer: {
    alignItems: "center",
    marginTop: 15,
  },
  footerText: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  actions: {
    marginTop: 20,
    gap: 12,
  },
  downloadButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  downloadButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  closeButtonBottom: {
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#374151",
    fontSize: 16,
    fontWeight: "600",
  },
})

