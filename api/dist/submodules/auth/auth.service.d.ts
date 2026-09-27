import { SupabaseService } from '../../modules/supabase/supabase.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';
export declare class AuthService {
    private readonly supabaseService;
    private readonly logger;
    constructor(supabaseService: SupabaseService);
    register(registerDto: RegisterDto): Promise<{
        message: string;
        user: {
            user_uuid: string;
            id: any;
            email: string | undefined;
            name: string;
            phone: string | null;
        };
        session: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
        } | null;
    }>;
    login(loginDto: LoginDto): Promise<{
        message: string;
        session: {
            access_token: string;
            refresh_token: string;
            expires_in: number;
            token_type: "bearer";
        };
        user: {
            id: any;
            user_uuid: string;
            email: string | undefined;
            name: any;
            phone: any;
            created_at: any;
            updated_at: any;
        };
    }>;
}
