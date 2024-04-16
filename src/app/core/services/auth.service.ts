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

  getUrl(): string {
    let url =
      process?.env?.['NEXT_PUBLIC_VERCEL_URL'] ?? window.location.origin;
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Make sure to include a trailing `/`.
    url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
    return url;
  }

  signIn() {
    return this.supabase.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: this.getUrl() + '/login',
      },
    });
  }

  signOut() {
    return this.supabase.client.auth.signOut();
  }
}
