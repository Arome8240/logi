import { Stack } from 'expo-router';
import { QueryProvider } from '@/lib/react-query';
import { Toaster } from 'sonner-native';

export default function RootLayout() {
  return (
    <QueryProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(home)" />
      </Stack>
      <Toaster />
    </QueryProvider>
  );
}
