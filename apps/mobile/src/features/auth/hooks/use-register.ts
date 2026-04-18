import { useMutation } from '@tanstack/react-query';
import { router } from 'expo-router';
import { authApi } from '../api/auth-api';
import { useAuthActions } from '@/shared/store';
import { toast } from 'sonner-native';

export function useRegister() {
  const { setUser, setToken } = useAuthActions();

  return useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      setUser(data.user);
      setToken(data.token);
      toast.success('Registration successful');
      router.replace('/(home)');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Registration failed');
    },
  });
}
