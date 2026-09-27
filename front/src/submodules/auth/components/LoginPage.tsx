import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { colors, type ThemeMode } from '../../../styles/theme';
import logoCircular from '../../../assets/logo-circular.png';

interface LoginPageProps {
  themeMode?: ThemeMode;
  onNavigateToRegister?: () => void;
  onLoginSuccess?: (email: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  themeMode = 'light',
  onNavigateToRegister,
  onLoginSuccess,
}) => {
  const currentTheme = colors[themeMode];
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onLoginSuccess) {
      onLoginSuccess(email);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between selection:bg-[#2d7044] selection:text-white antialiased transition-colors duration-200"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.textPrimary,
      }}
    >
      {/* Status / Top Bar */}
      <header className="pt-safe w-full">
        <div className="flex items-center justify-between px-7 h-12" style={{ color: currentTheme.textSecondary }}>
          <span className="text-[13px] font-medium tracking-tight">09:41</span>
          <div className="flex items-center gap-1.5 opacity-80">
            <span className="text-[11px] tracking-wide font-semibold">5G</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 w-full max-w-sm mx-auto my-auto -mt-4">
        {/* Brand Circular Logo & Title */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="h-28 w-28 rounded-full overflow-hidden flex items-center justify-center shadow-md border border-emerald-900/10 bg-white p-1">
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
          <p className="text-[13px] mt-1 font-normal" style={{ color: currentTheme.textSecondary }}>
            Agronegócios
          </p>
        </div>

        {/* Form */}
        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label
              className="text-[11px] uppercase tracking-wider font-semibold"
              style={{ color: currentTheme.textSecondary }}
              htmlFor="login-email"
            >
              E-mail
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu.email@morrogrande.com.br"
              className="w-full h-12 px-4 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
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
              htmlFor="login-password"
            >
              Senha
            </label>
            <div className="relative w-full">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 pr-12 rounded-lg text-[14px] outline-none transition-all shadow-sm focus:ring-2 focus:ring-[#2d7044]"
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

          {/* Action Button */}
          <button
            type="submit"
            className="mt-2 w-full h-12 bg-[#2d7044] hover:bg-[#255d38] active:bg-[#1e4b2d] text-white text-[14px] font-semibold rounded-lg transition-all duration-150 active:scale-[0.99] flex items-center justify-center cursor-pointer shadow-md"
          >
            Entrar
          </button>

          {/* Forgot Password Link */}
          <div className="text-center mt-2">
            <a
              href="#forgot"
              onClick={(e) => e.preventDefault()}
              className="text-[13px] transition-colors inline-block py-1 hover:underline"
              style={{ color: currentTheme.textSecondary }}
            >
              Esqueci minha senha
            </a>
          </div>

          <div className="text-center mt-2">
            <p className="text-[13px]" style={{ color: currentTheme.textSecondary }}>
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={onNavigateToRegister}
                className="text-[#2d7044] hover:text-[#255d38] font-semibold hover:underline transition-colors ml-0.5 bg-transparent border-none cursor-pointer p-0"
              >
                Cadastre-se
              </button>
            </p>
          </div>
        </form>
      </main>

      <footer className="pb-safe py-6"></footer>
    </div>
  );
};