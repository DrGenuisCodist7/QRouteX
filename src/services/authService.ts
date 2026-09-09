import { AuthSession, UserProfile } from '@/types';

const STORAGE_KEY = 'qroutex_auth_session';

const DEFAULT_ADMIN_USER: UserProfile = {
  id: 'usr_admin_01',
  name: 'Admin User',
  email: 'admin@qroutex.ai',
  role: 'Fleet Operations Administrator',
  title: 'Principal Logistics Systems Lead',
  avatar: 'A',
  region: 'Hyderabad Control Center (HQ)',
  twoFactorEnabled: true,
  activeSince: 'March 2025',
  lastLogin: 'Today, 08:15 IST',
  apiTokensCount: 3,
};

export const authService = {
  login: async (usernameOrEmail: string, password: string): Promise<{ success: boolean; session?: AuthSession; error?: string }> => {
    // Artificial slight latency for realistic feel
    await new Promise((resolve) => setTimeout(resolve, 350));

    const cleanUser = usernameOrEmail.trim().toLowerCase();
    const cleanPass = password.trim();

    if (
      (cleanUser === 'admin@qroutex.ai' || cleanUser === 'admin') &&
      cleanPass === 'qroutex'
    ) {
      const session: AuthSession = {
        user: DEFAULT_ADMIN_USER,
        token: `qrx_jwt_${Date.now()}_secure_session`,
        expiresAt: Date.now() + 24 * 60 * 60 * 1000,
      };

      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
        sessionStorage.setItem('qroutexLoggedIn', '1');
      }

      return { success: true, session };
    }

    return {
      success: false,
      error: 'Invalid credentials. Please use admin@qroutex.ai and password "qroutex".',
    };
  },

  getSession: (): AuthSession | null => {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return null;
      const session = JSON.parse(stored) as AuthSession;
      if (session.expiresAt && Date.now() > session.expiresAt) {
        authService.logout();
        return null;
      }
      return session;
    } catch {
      return null;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem('qroutexLoggedIn');
    }
  },

  updateProfile: (updated: Partial<UserProfile>): UserProfile => {
    const current = authService.getSession();
    const user = current?.user ? { ...current.user, ...updated } : { ...DEFAULT_ADMIN_USER, ...updated };
    if (current && typeof window !== 'undefined') {
      const newSession: AuthSession = {
        ...current,
        user,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSession));
    }
    return user;
  },
};
