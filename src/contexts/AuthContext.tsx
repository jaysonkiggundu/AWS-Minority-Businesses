import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';
import { logger } from '@/lib/logger';

interface User {
  username: string;
  email?: string;
  userId: string;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, email: string, password: string) => Promise<void>;
  confirmSignUp: (username: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      logger.debug('Checking user authentication status');
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      const attrs = await fetchUserAttributes();
      
      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
        email: attrs.email,
        emailVerified: attrs.email_verified === 'true',
      });
      
      logger.info('User authenticated', { username: currentUser.username });
    } catch (error) {
      logger.debug('No authenticated user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    try {
      logger.logUserAction('Sign In Attempt', { username });
      await signIn({ username, password });
      await checkUser();
      logger.logUserAction('Sign In Success', { username });
    } catch (error) {
      logger.error('Sign in failed', error as Error, { username });
      throw error;
    }
  };

  const handleSignUp = async (username: string, email: string, password: string) => {
    try {
      logger.logUserAction('Sign Up Attempt', { username, email });
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });
      logger.logUserAction('Sign Up Success', { username, email });
    } catch (error) {
      logger.error('Sign up failed', error as Error, { username, email });
      throw error;
    }
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      logger.logUserAction('Confirm Sign Up Attempt', { username });
      await confirmSignUp({ username, confirmationCode: code });
      logger.logUserAction('Confirm Sign Up Success', { username });
    } catch (error) {
      logger.error('Confirm sign up failed', error as Error, { username });
      throw error;
    }
  };

  const handleSignOut = async () => {
    try {
      const username = user?.username;
      logger.logUserAction('Sign Out', { username });
      await signOut();
      setUser(null);
    } catch (error) {
      logger.error('Sign out failed', error as Error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn: handleSignIn,
        signUp: handleSignUp,
        confirmSignUp: handleConfirmSignUp,
        signOut: handleSignOut,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
