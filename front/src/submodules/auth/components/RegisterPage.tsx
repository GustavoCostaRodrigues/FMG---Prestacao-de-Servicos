import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import logoCircular from '../../../assets/logo-circular.png';

interface RegisterPageProps {
  themeMode?: ThemeMode;
  onNavigateToLogin?: () => void;
  onRegisterSuccess?: (email: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({
  themeMode = 'light',
  onNavigateToLogin,
  onRegisterSuccess,
}) => {
  const currentTheme = colors[themeMode];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Phone mask: (xx) x xxxx-xxxx
   */
  const formatPhone = (value: string): string => {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (!digits) return '';
    if (digits.length <= 2) return `(${digits}`;
    if (digits.length <= 3) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 3)} ${digits.slice(3, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (onRegisterSuccess) {
        onRegisterSuccess(email);
      }
    }, 1200);
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-[#2d7044] selection:text-white antialiased transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.textPrimary,
      }}
    >
      {/* Top Status Bar */}
      <header className="pt-safe w-full">
        <div className="flex items-center justify-between px-7 h-12" style={{ color: currentTheme.textSecondary }}>
          <span className="text-[13px] font-medium tracking-tight">09:41</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-[11px] tracking-wide font-semibold">5G</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 w-full max-w-sm mx-auto my-auto py-4">
        <div className="flex flex-col w-full items-center">
          {/* Brand Circular Logo & Title */}
          <div className="w-full flex flex-col items-center mb-6 text-center">
            <div className="mb-3 flex items-center justify-center">
              <div className="h-24 w-24 rounded-full overflow-hidden flex items-center justify-center shadow-md border border-emerald-900/10 bg-white p-1">
                <img
                  src={logoCircular}
                  alt="Fazenda Morro Grande Agronegócios"
                  className="h-full w-full object-contain rounded-full"
                />
              </div>
            </div>
            <h1
              className="text-[21px] font-semibold tracking-tight leading-tight m-0 p-0"
              style={{ color: currentTheme.textPrimary }}
            >
              Fazenda Morro Grande
            </h1>
            <p className="text-[13px] mt-0.5 font-normal" style={{ color: currentTheme.textSecondary }}>
              Criar nova conta
            </p>
          </div>

          <form className="w-full flex flex-col gap-3.5" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: currentTheme.textSecondary }}
                htmlFor="reg-name"
              >
                Nome Completo
              </label>
              <input
                id="reg-name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome completo"
                className="w-full h-11 px-3.5 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: currentTheme.textSecondary }}
                htmlFor="reg-email"
              >
                E-mail Corporativo
              </label>
              <input
                id="reg-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@morrogrande.com.br"
                className="w-full h-11 px-3.5 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: currentTheme.textSecondary }}
                htmlFor="reg-phone"
              >
                Telefone / Celular
              </label>
              <input
                id="reg-phone"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={handlePhoneChange}
                maxLength={16}
                placeholder="(00) 0 0000-0000"
                className="w-full h-11 px-3.5 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
                style={{
                  backgroundColor: currentTheme.surface,
                  borderColor: currentTheme.border,
                  color: currentTheme.textPrimary,
                  borderWidth: '1px',
                  borderStyle: 'solid',
                }}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: currentTheme.textSecondary }}
                htmlFor="reg-password"
              >
                Senha
              </label>
              <div className="relative w-full">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 pr-12 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.textPrimary,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors bg-transparent border-none cursor-pointer"
                  style={{ color: currentTheme.textSecondary }}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 transition-transform active:scale-90" />
                  ) : (
                    <Eye className="w-5 h-5 transition-transform active:scale-90" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                className="text-[11px] uppercase tracking-wider font-semibold"
                style={{ color: currentTheme.textSecondary }}
                htmlFor="reg-confirm-password"
              >
                Confirmar Senha
              </label>
              <div className="relative w-full">
                <input
                  id="reg-confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-3.5 pr-12 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
                  style={{
                    backgroundColor: currentTheme.surface,
                    borderColor: currentTheme.border,
                    color: currentTheme.textPrimary,
                    borderWidth: '1px',
                    borderStyle: 'solid',
                  }}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? 'Ocultar confirmação de senha' : 'Exibir confirmação de senha'}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors bg-transparent border-none cursor-pointer"
                  style={{ color: currentTheme.textSecondary }}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 transition-transform active:scale-90" />
                  ) : (
                    <Eye className="w-5 h-5 transition-transform active:scale-90" />
                  )}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full h-11 rounded-lg bg-[#2d7044] hover:bg-[#255d38] active:bg-[#1e4b2d] text-white font-semibold flex items-center justify-center transition-all duration-150 active:scale-[0.99] shadow-md cursor-pointer ${
                  isLoading ? 'opacity-75 pointer-events-none' : ''
                }`}
              >
                <span>{isLoading ? 'Processando...' : 'Criar conta'}</span>
              </button>
            </div>
          </form>

          <div className="mt-5 text-center">
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="text-[13px] transition-colors inline-block py-1 bg-transparent border-none cursor-pointer p-0"
              style={{ color: currentTheme.textSecondary }}
            >
              Já possui uma conta?{' '}
              <span className="font-semibold text-[#2d7044] hover:text-[#255d38] underline underline-offset-4">
                Entrar
              </span>
            </button>
          </div>
        </div>
      </main>

      <footer className="pb-safe py-4"></footer>
    </div>
  );
};