import {
  BadRequestException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../modules/supabase/supabase.service.js';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  /**
   * POST /auth/register
   * 1. Creates user in auth.users via Supabase Auth API.
   * 2. Explicitly inserts corresponding profile record in public.users.
   */
  async register(registerDto: RegisterDto) {
    const { email, password, name, phone } = registerDto;
    const client = this.supabaseService.getClient();

    // 1. Create user in auth.users
    const { data: authData, error: authError } = await client.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          phone,
          full_name: name,
        },
      },
    });

    if (authError || !authData.user) {
      this.logger.error(`Error creating user in auth.users: ${authError?.message}`);
      throw new BadRequestException(
        authError?.message || 'Erro ao criar conta no Supabase Auth.',
      );
    }

    const userUuid = authData.user.id;
    let publicUserProfile = null;

    // 2. Explicitly insert profile into public.users (Zero DB Triggers per Golden Rules)
    try {
      const dbClient = authData.session
        ? this.supabaseService.getAuthenticatedClient(authData.session.access_token)
        : client;

      const { data: insertedProfile, error: dbError } = await dbClient
        .from('users')
        .insert({
          user_uuid: userUuid,
          name,
          email,
          phone: phone || null,
          created_at: new Date().toISOString(),
        })
        .select()
        .maybeSingle();

      if (dbError) {
        this.logger.warn(
          `Primary insert into public.users returned notice: ${dbError.message}`,
        );
      } else {
        publicUserProfile = insertedProfile;
      }
    } catch (err: any) {
      this.logger.warn(
        `Failed explicit insert into public.users: ${err?.message || err}`,
      );
    }

    return {
      message: 'Usuário registrado com sucesso.',
      user: {
        user_uuid: userUuid,
        id: publicUserProfile?.id || null,
        email: authData.user.email,
        name,
        phone: phone || null,
      },
      session: authData.session
        ? {
            access_token: authData.session.access_token,
            refresh_token: authData.session.refresh_token,
            expires_in: authData.session.expires_in,
          }
        : null,
    };
  }

  /**
   * POST /auth/login
   * Validates credentials and queries user profile from public.users by user_uuid.
   */
  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const client = this.supabaseService.getClient();

    // 1. Authenticate with auth.users via Supabase Auth
    const { data: authData, error: authError } =
      await client.auth.signInWithPassword({
        email,
        password,
      });

    if (authError || !authData.session) {
      this.logger.warn(`Failed login for ${email}: ${authError?.message}`);
      throw new UnauthorizedException(
        'Credenciais inválidas. Verifique seu e-mail e senha.',
      );
    }

    const session = authData.session;
    const user = authData.user;
    const userUuid = user.id;

    // 2. Query public.users profile by user_uuid using authenticated user client (RLS)
    const userDbClient =
      this.supabaseService.getAuthenticatedClient(session.access_token);

    let profileData: any = null;

    try {
      const { data: userRow } = await userDbClient
        .from('users')
        .select('*')
        .eq('user_uuid', userUuid)
        .maybeSingle();

      if (userRow) {
        profileData = userRow;
      }
    } catch (err: any) {
      this.logger.warn(
        `Could not query public.users for user_uuid ${userUuid}: ${err?.message || err}`,
      );
    }

    return {
      message: 'Login realizado com sucesso.',
      session: {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_in: session.expires_in,
        token_type: session.token_type,
      },
      user: {
        id: profileData?.id || null,
        user_uuid: userUuid,
        email: user.email,
        name: profileData?.name || user.user_metadata?.name || '',
        phone: profileData?.phone || user.user_metadata?.phone || null,
        created_at: profileData?.created_at || user.created_at,
        updated_at: profileData?.updated_at || null,
      },
    };
  }
}
