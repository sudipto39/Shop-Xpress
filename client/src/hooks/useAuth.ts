import { useMutation, useQuery } from '@tanstack/react-query';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export function useLogin() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await authApi.login(credentials);
      // Handle { data: { user, token } } or { user, token } format
      return data.data || data;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Welcome back!', {
        description: `Logged in as ${data.user.name}`,
      });
      navigate('/', { replace: true });
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || 'Please check your credentials and try again.';
      toast.error('Login failed', { description: message });
    },
  });
}

export function useRegister() {
  const { login } = useAuthStore();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: { name: string; email: string; password: string }) => {
      const { data: response } = await authApi.register(data);
      // Handle { data: { user, token } } or { user, token } format
      return response.data || response;
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      toast.success('Account created!', {
        description: 'Welcome to ShopNest!',
      });
      navigate('/');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || 'Please try again later.';
      toast.error('Registration failed', { description: message });
    },
  });
}

export function useProfile() {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data } = await authApi.getProfile();
      return data;
    },
    enabled: isAuthenticated,
  });
}

export function useUpdateProfile() {
  const { setUser, user } = useAuthStore();

  return useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const { data: response } = await authApi.updateProfile(data);
      return response;
    },
    onSuccess: (data) => {
      if (user) {
        setUser({ ...user, ...data });
      }
      toast.success('Profile updated successfully!');
    },
    onError: (error: Error & { response?: { data?: { message?: string } } }) => {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    },
  });
}
