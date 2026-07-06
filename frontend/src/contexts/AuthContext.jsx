import { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth';
import { auth } from '../lib/firebase';

const AuthContext = createContext(null);

// ============================================
// HARDCODED ADMIN ACCOUNT (for testing only)
// ============================================
const ADMIN_ACCOUNT = {
  uid: 'admin-hardcoded-001',
  email: 'admin@lea.com',
  displayName: 'Admin',
  isAdmin: true,
};
const ADMIN_PASSWORD = 'admin123';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage for persisted admin session
  useEffect(() => {
    const savedAdmin = localStorage.getItem('lea-admin-session');
    if (savedAdmin) {
      setUser(JSON.parse(savedAdmin));
      setLoading(false);
      // Still listen for Firebase auth changes
      const unsubscribe = onAuthStateChanged(auth, () => {});
      return unsubscribe;
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    // Check hardcoded admin first
    if (email === ADMIN_ACCOUNT.email && password === ADMIN_PASSWORD) {
      setUser(ADMIN_ACCOUNT);
      localStorage.setItem('lea-admin-session', JSON.stringify(ADMIN_ACCOUNT));
      return { user: ADMIN_ACCOUNT };
    }
    // Otherwise try Firebase
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password, displayName) => {
    // Block registering with admin email
    if (email === ADMIN_ACCOUNT.email) {
      throw { code: 'auth/email-already-in-use' };
    }
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    setUser({ ...cred.user, displayName });
    return cred;
  };

  const logout = async () => {
    // Clear admin session if active
    localStorage.removeItem('lea-admin-session');
    setUser(null);
    try {
      await signOut(auth);
    } catch {
      // Ignore if no Firebase session
    }
  };

  const updateUserProfile = async (data) => {
    // Handle admin profile update locally
    if (user?.isAdmin) {
      const updated = { ...user, ...data };
      setUser(updated);
      localStorage.setItem('lea-admin-session', JSON.stringify(updated));
      return;
    }
    if (!auth.currentUser) throw new Error('Not authenticated');
    await updateProfile(auth.currentUser, data);
    setUser({ ...auth.currentUser, ...data });
  };

  const changePassword = async (currentPassword, newPassword) => {
    // Admin password change is a no-op (hardcoded)
    if (user?.isAdmin) {
      if (currentPassword !== ADMIN_PASSWORD) {
        throw { code: 'auth/wrong-password' };
      }
      return; // Can't actually change hardcoded password
    }
    if (!auth.currentUser) throw new Error('Not authenticated');
    const credential = EmailAuthProvider.credential(
      auth.currentUser.email,
      currentPassword
    );
    await reauthenticateWithCredential(auth.currentUser, credential);
    await updatePassword(auth.currentUser, newPassword);
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUserProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
