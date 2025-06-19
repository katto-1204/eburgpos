import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import Toast from "react-native-toast-message"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="admin" />
        <Stack.Screen name="cashier" />
      </Stack>
      <Toast />
    </>
  )
}
