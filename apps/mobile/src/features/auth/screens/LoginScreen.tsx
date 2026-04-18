import { View, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useLogin } from '../hooks';

export function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();

  const handleLogin = () => {
    if (!email || !password) {
      return;
    }
    login.mutate({ email, password });
  };

  return (
    <View className="flex-1 p-5 bg-white justify-center">
      {/* Add your UI components here */}
      {/* This is a minimal example showing the hook usage */}
    </View>
  );
}
