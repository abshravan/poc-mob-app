import { create } from "zustand";
import { mockDb } from "@/services/mock-data";

type MockUser = {
  id: string;
  email: string;
  user_metadata: { username: string };
};

type AuthState = {
  session: { user: MockUser } | null;
  user: MockUser | null;
  loading: boolean;
  initialized: boolean;

  initialize: () => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const mockUser: MockUser = {
  id: mockDb.userId,
  email: mockDb.email,
  user_metadata: { username: mockDb.username },
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    // Auto-login with mock user for testing
    set({
      session: { user: mockUser },
      user: mockUser,
      initialized: true,
    });
  },

  signUp: async (_email: string, _password: string, username: string) => {
    set({ loading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    const user: MockUser = {
      id: mockDb.userId,
      email: _email,
      user_metadata: { username },
    };
    set({
      session: { user },
      user,
      loading: false,
    });
  },

  signIn: async (_email: string, _password: string) => {
    set({ loading: true });
    // Simulate network delay
    await new Promise((r) => setTimeout(r, 500));
    set({
      session: { user: mockUser },
      user: mockUser,
      loading: false,
    });
  },

  signOut: async () => {
    set({ session: null, user: null });
  },
}));
