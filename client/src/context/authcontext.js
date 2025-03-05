import { createContext, useContext } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase/firebaseConfig';

// Create context
const AuthContext = createContext();

// Export provider
export const AuthProvider = ({ children }) => {
    const [user, loading, error] = useAuthState(auth);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

// Export custom hook
export const useAuth = () => {
    return useContext(AuthContext);
};

// Export context directly (if needed)
export default AuthContext;