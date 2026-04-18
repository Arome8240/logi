import { useQuery } from '@tanstack/react-query';
import { authApi } from '../api/auth-api';
import { queryKeys } from '@/lib/react-query';
import { useIsAuthenticated } from '@/shared/store';

export function useCurrentUser() {
  const isAuthenticated = useIsAuthenticated();

  return useQuery({
    queryKey: queryKeys.auth.user,
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
