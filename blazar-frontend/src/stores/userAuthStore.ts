import { defineStore } from 'pinia';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface UserMetadata {
  avatar_blob: string;
  avatar_url: string;
  fullname: string;
}

interface UserState {
  user: {
    id: string;
    email: string;
    user_metadata: UserMetadata;
  };
  recoverPassword: boolean;
}

export const userAuthStore = defineStore('auth', {
  state: (): UserState => ({
    user: {
      id: '',
      email: '',
      user_metadata: {
        avatar_blob: '',
        avatar_url: '',
        fullname: '',
      },
    },
    recoverPassword: false,
  }),

  getters: {
    getPasswordModeActive: (state): boolean => state.recoverPassword,
    getUser: (state): UserState['user'] => state.user,
  },

  actions: {
    setUser(userData: Partial<SupabaseUser> & { user_metadata?: Partial<UserMetadata> }) {
      this.user = {
        id: userData?.id || '',
        email: userData?.email || '',
        user_metadata: {
          avatar_blob: userData?.user_metadata?.avatar_blob || '',
          avatar_url: userData?.user_metadata?.avatar_url || '',
          fullname: userData?.user_metadata?.fullname || '',
        },
      };
    },

    clearUser() {
      this.user = {
        id: '',
        email: '',
        user_metadata: {
          avatar_blob: '',
          avatar_url: '',
          fullname: '',
        },
      };
    },

    setRecoveryPasswordMode(mode: boolean) {
      this.recoverPassword = mode;
    },
  },

  persist: true,
});
