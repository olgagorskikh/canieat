import { Stack } from 'expo-router';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';

export default function RootLayout() {
  return (
    <SubscriptionProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </SubscriptionProvider>
  );
}
