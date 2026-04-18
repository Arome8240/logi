import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/auth-api';
import { useAuthActions } from '@/shared/store';
import { queryClient } from '@/lib/react-query';
import { toast } from 'sonner-native';

export function useLogout() {
  const { logout } = useAuthActions();

  return useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      logout();
      queryClient.clear();
      toast.success('Logged out successfully');
      router.replace('/(auth)/login');
    },
    onError: (error: Error) => {
      // Still logout locally even if API call fails
      logout();
      queryClient.clear();
      router.replace('/(auth)/login');
      toast.error(error.message || 'Logout failed');
    },
  });
}
