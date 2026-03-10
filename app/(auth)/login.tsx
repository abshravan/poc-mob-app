import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link } from "expo-router";
import { useAuthStore } from "@/store/auth-store";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signIn, loading } = useAuthStore();

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await signIn(email.trim(), password);
    } catch (error: any) {
      Alert.alert("Login Failed", error.message || "An error occurred");
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerClassName="flex-1 justify-center px-6"
        className="bg-surface-dark"
      >
        {/* Header */}
        <View className="items-center mb-12">
          <Text className="text-primary text-4xl font-bold mb-2">
            SOLO LEVEL UP
          </Text>
          <Text className="text-gray-400 text-base">
            Rise through the ranks
          </Text>
        </View>

        {/* Form */}
        <View className="mb-8">
          <Text className="text-gray-400 text-sm mb-2 font-medium">EMAIL</Text>
          <TextInput
            className="bg-surface-light text-white rounded-xl px-4 py-3 mb-4 border border-gray-800"
            placeholder="hunter@example.com"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Text className="text-gray-400 text-sm mb-2 font-medium">
            PASSWORD
          </Text>
          <TextInput
            className="bg-surface-light text-white rounded-xl px-4 py-3 mb-6 border border-gray-800"
            placeholder="Enter your password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            className="bg-primary rounded-xl py-4 items-center"
            style={{ opacity: loading ? 0.6 : 1 }}
          >
            <Text className="text-white font-bold text-base">
              {loading ? "ENTERING DUNGEON..." : "ENTER DUNGEON"}
            </Text>
          </Pressable>
        </View>

        {/* Sign Up Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-400">New hunter? </Text>
          <Link href="/(auth)/signup" asChild>
            <Pressable>
              <Text className="text-accent font-bold">Create Account</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
