import { ConfigService } from '@nestjs/config';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class SupabaseService {
    private readonly configService;
    private readonly logger;
    private supabaseClient;
    private readonly supabaseUrl;
    private readonly anonKey;
    constructor(configService: ConfigService);
    getClient(): SupabaseClient;
    getAuthenticatedClient(accessToken: string): SupabaseClient;
}
