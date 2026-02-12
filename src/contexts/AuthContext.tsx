import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getCurrentUser, signIn, signOut, signUp, confirmSignUp, fetchAuthSession } from 'aws-amplify/auth';

interface User {
  username: string;
  email?: string;
  userId: string;
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
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      setUser({
        username: currentUser.username,
        userId: currentUser.userId,
        email: session.tokens?.idToken?.payload.email as string,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (username: string, password: string) => {
    await signIn({ username, password });
    await checkUser();
  };

  const handleSignUp = async (username: string, email: string, password: string) => {
    await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email,
        },
      },
    });
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    await confirmSignUp({ username, confirmationCode: code });
  };

  const handleSignOut = async () => {
    await signOut();
    setUser(null);
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
