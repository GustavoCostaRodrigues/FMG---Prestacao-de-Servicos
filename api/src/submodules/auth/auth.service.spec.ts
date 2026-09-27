import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service.js';
import { SupabaseService } from '../../modules/supabase/supabase.service.js';

describe('AuthService (Submodules)', () => {
  let service: AuthService;

  const mockPublicClient = {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
    },
    from: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    maybeSingle: vi.fn().mockResolvedValue({
      data: {
        id: 1,
        user_uuid: 'test-user-id',
        name: 'João Silva',
        email: 'test@morrogrande.com.br',
        phone: '(11) 99999-9999',
        created_at: '2026-09-20T20:00:00.000Z',
        updated_at: null,
      },
      error: null,
    }),
  };

  const mockSupabaseService = {
    getClient: vi.fn(() => mockPublicClient),
    getAuthenticatedClient: vi.fn(() => mockPublicClient),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: SupabaseService, useValue: mockSupabaseService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should create row in auth.users and explicitly insert row in public.users', async () => {
      mockPublicClient.auth.signUp.mockResolvedValueOnce({
        data: {
          user: {
            id: 'test-user-id',
            email: 'test@morrogrande.com.br',
          },
          session: null,
        },
        error: null,
      });

      const result = await service.register({
        name: 'João Silva',
        email: 'test@morrogrande.com.br',
        password: 'password123',
        phone: '(11) 99999-9999',
      });

      expect(result.message).toBe('Usuário registrado com sucesso.');
      expect(result.user.user_uuid).toBe('test-user-id');
      expect(result.user.email).toBe('test@morrogrande.com.br');
      expect(mockPublicClient.from).toHaveBeenCalledWith('users');
      expect(mockPublicClient.insert).toHaveBeenCalledWith({
        user_uuid: 'test-user-id',
        name: 'João Silva',
        email: 'test@morrogrande.com.br',
        phone: '(11) 99999-9999',
        created_at: expect.any(String),
      });
    });
  });

  describe('login', () => {
    it('should authenticate user and return user profile from public.users', async () => {
      mockPublicClient.auth.signInWithPassword.mockResolvedValueOnce({
        data: {
          session: {
            access_token: 'fake-access-token',
            refresh_token: 'fake-refresh-token',
            expires_in: 3600,
            token_type: 'bearer',
          },
          user: {
            id: 'test-user-id',
            email: 'test@morrogrande.com.br',
          },
        },
        error: null,
      });

      const result = await service.login({
        email: 'test@morrogrande.com.br',
        password: 'password123',
      });

      expect(result.session.access_token).toBe('fake-access-token');
      expect(result.user.user_uuid).toBe('test-user-id');
      expect(result.user.id).toBe(1);
      expect(result.user.name).toBe('João Silva');
    });
  });
});
