import { Injectable, WritableSignal, inject, signal } from '@angular/core';
import {
  AuthChangeEvent,
  AuthSession,
  Session,
  User,
} from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  supabase = inject(SupabaseService);

  $user: WritableSignal<User | null> = signal(null);

  constructor() {
    this.supabase.client.auth.getUser().then(({ data, error }) => {
      console.log(data, error);
      this.$user.set(data && data.user && !error ? data.user : null);

      this.supabase.client.auth.onAuthStateChange((event, session) => {
        this.$user.set(session?.user ?? null);
      });
    });
  }

  signIn() {
    return this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
  }

  signOut() {
    return this.supabase.client.auth.signOut();
  }
}
