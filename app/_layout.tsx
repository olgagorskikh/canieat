import { Stack } from 'expo-router';
import { SubscriptionProvider } from '../contexts/SubscriptionContext';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <SubscriptionProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </SubscriptionProvider>
    </ErrorBoundary>
  );
}
