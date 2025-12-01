import React, { useState, useRef } from "react"
import { View, Text, Animated, StyleSheet } from "react-native"

interface FlippingCardProps {
  cardNumber?: string
  cardName?: string
  expiry?: string
  cvv?: string
  onCvvFocus?: () => void
  onCvvBlur?: () => void
  cardColor?: string
  showCvvOnBack?: boolean
}

export default function FlippingCard({
  cardNumber = "",
  cardName = "",
  expiry = "",
  cvv = "",
  onCvvFocus,
  onCvvBlur,
  cardColor = "#1054CF",
  showCvvOnBack = true,
}: FlippingCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const flipAnimation = useRef(new Animated.Value(0)).current

  const flipCard = (showBack: boolean) => {
    if (showBack === isFlipped) return
    setIsFlipped(showBack)
    Animated.spring(flipAnimation, {
      toValue: showBack ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start()
  }

  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  })

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  })

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  }

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  }

  const formatCardNumber = (number: string) => {
    const digits = number.replace(/\s/g, "")
    const groups = digits.match(/.{1,4}/g) || []
    return groups.join(" ")
  }

  const displayCardNumber = () => {
    const formatted = formatCardNumber(cardNumber)
    const remaining = 16 - cardNumber.replace(/\s/g, "").length
    return formatted + "•".repeat(Math.max(0, remaining))
  }

  const handleCvvFocus = () => {
    flipCard(true)
    onCvvFocus?.()
  }

  const handleCvvBlur = () => {
    flipCard(false)
    onCvvBlur?.()
  }

  return (
    <View style={styles.cardContainer}>
      {/* Front of Card */}
      <Animated.View style={[styles.cardPreview, { backgroundColor: cardColor }, frontAnimatedStyle]}>
        <View style={styles.cardTopRow}>
          <View style={styles.chip} />
          <View style={styles.cardLogo} />
        </View>
        <Text style={styles.cardNumber}>{displayCardNumber() || "•••• •••• •••• ••••"}</Text>
        <View style={styles.cardBottom}>
          <View>
            <Text style={styles.cardLabel}>CARD HOLDER</Text>
            <Text style={styles.cardValue}>{cardName || "FULL NAME"}</Text>
          </View>
          <View>
            <Text style={styles.cardLabel}>EXPIRES</Text>
            <Text style={styles.cardValue}>{expiry || "MM/YY"}</Text>
          </View>
        </View>
      </Animated.View>

      {/* Back of Card */}
      <Animated.View
        style={[styles.cardPreview, styles.cardBack, { backgroundColor: cardColor }, backAnimatedStyle]}
      >
        <View style={styles.magneticStrip} />
        {showCvvOnBack && (
          <View style={styles.cvvBackRow}>
            <View style={styles.cvvLabelBox}>
              <Text style={styles.cvvLabelBack}>CVV</Text>
              <View style={styles.cvvBoxBack}>
                <Text style={styles.cvvText}>{cvv || "•••"}</Text>
              </View>
            </View>
          </View>
        )}
      </Animated.View>
    </View>
  )
}

// Hook to use with TextInput
export function useFlippingCard() {
  const [isFlipped, setIsFlipped] = useState(false)
  const flipAnimation = useRef(new Animated.Value(0)).current

  const flipCard = (showBack: boolean) => {
    if (showBack === isFlipped) return
    setIsFlipped(showBack)
    Animated.spring(flipAnimation, {
      toValue: showBack ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start()
  }

  return {
    flipCard,
    isFlipped,
    flipAnimation,
  }
}

const styles = StyleSheet.create({
  cardContainer: {
    height: 200,
    marginBottom: 24,
  },
  cardPreview: {
    borderRadius: 16,
    padding: 24,
    height: 200,
    justifyContent: "space-between",
  },
  cardTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chip: {
    width: 40,
    height: 24,
    backgroundColor: "#FFD700",
    borderRadius: 4,
  },
  cardLogo: {
    width: 80,
    height: 40,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 4,
  },
  cardNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    letterSpacing: 2,
    marginBottom: 20,
    fontWeight: "500",
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardLabel: {
    color: "#FFFFFF",
    fontSize: 10,
    opacity: 0.8,
    marginBottom: 4,
  },
  cardValue: {
    color: "#FFFFFF",
    fontSize: 14,
    letterSpacing: 1,
    fontWeight: "500",
  },
  cardBack: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backfaceVisibility: "hidden",
  },
  magneticStrip: {
    height: 36,
    backgroundColor: "#2a2a2a",
    borderRadius: 6,
    marginTop: 12,
    marginBottom: 24,
    width: "100%",
  },
  cvvBackRow: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cvvLabelBox: {
    alignItems: "center",
  },
  cvvLabelBack: {
    color: "#FFFFFF",
    fontSize: 12,
    marginBottom: 4,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  cvvBoxBack: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 6,
    paddingHorizontal: 18,
    borderRadius: 6,
    minWidth: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  cvvText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4A4A4A",
  },
})

