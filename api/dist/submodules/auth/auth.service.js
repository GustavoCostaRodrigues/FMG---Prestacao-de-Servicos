var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
import { BadRequestException, Injectable, Logger, UnauthorizedException, } from '@nestjs/common';
import { SupabaseService } from '../../modules/supabase/supabase.service.js';
let AuthService = AuthService_1 = class AuthService {
    supabaseService;
    logger = new Logger(AuthService_1.name);
    constructor(supabaseService) {
        this.supabaseService = supabaseService;
    }
    async register(registerDto) {
        const { email, password, name, phone } = registerDto;
        const client = this.supabaseService.getClient();
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
            throw new BadRequestException(authError?.message || 'Erro ao criar conta no Supabase Auth.');
        }
        const userUuid = authData.user.id;
        let publicUserProfile = null;
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
                this.logger.warn(`Primary insert into public.users returned notice: ${dbError.message}`);
            }
            else {
                publicUserProfile = insertedProfile;
            }
        }
        catch (err) {
            this.logger.warn(`Failed explicit insert into public.users: ${err?.message || err}`);
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
    async login(loginDto) {
        const { email, password } = loginDto;
        const client = this.supabaseService.getClient();
        const { data: authData, error: authError } = await client.auth.signInWithPassword({
            email,
            password,
        });
        if (authError || !authData.session) {
            this.logger.warn(`Failed login for ${email}: ${authError?.message}`);
            throw new UnauthorizedException('Credenciais inválidas. Verifique seu e-mail e senha.');
        }
        const session = authData.session;
        const user = authData.user;
        const userUuid = user.id;
        const userDbClient = this.supabaseService.getAuthenticatedClient(session.access_token);
        let profileData = null;
        try {
            const { data: userRow } = await userDbClient
                .from('users')
                .select('*')
                .eq('user_uuid', userUuid)
                .maybeSingle();
            if (userRow) {
                profileData = userRow;
            }
        }
        catch (err) {
            this.logger.warn(`Could not query public.users for user_uuid ${userUuid}: ${err?.message || err}`);
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
};
AuthService = AuthService_1 = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [SupabaseService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map