import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService {
  private readonly logger = new Logger(SupabaseService.name);
  private supabaseClient: SupabaseClient;
  private readonly supabaseUrl: string;
  private readonly anonKey: string;

  constructor(private readonly configService: ConfigService) {
    this.supabaseUrl = this.configService.get<string>('SUPABASE_URL') || '';
    this.anonKey = this.configService.get<string>('SUPABASE_ANON_KEY') || '';

    if (!this.supabaseUrl || !this.anonKey) {
      this.logger.warn(
        'SUPABASE_URL or SUPABASE_ANON_KEY is missing from environment variables.',
      );
    }

    // Client initialized with SUPABASE_URL and SUPABASE_ANON_KEY
    this.supabaseClient = createClient(this.supabaseUrl, this.anonKey);
  }

  getClient(): SupabaseClient {
    return this.supabaseClient;
  }

  /**
   * Creates a Supabase client scoped to the user's JWT access token
   * to query tables adhering strictly to Row Level Security (RLS).
   */
  getAuthenticatedClient(accessToken: string): SupabaseClient {
    return createClient(this.supabaseUrl, this.anonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    });
  }
}
