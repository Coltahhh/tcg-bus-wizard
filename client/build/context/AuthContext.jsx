import { auth } from '@firebase/firebaseConfig'; // Adjusted path
import { useAuthState } from 'react-firebase-hooks/auth';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, loading] = useAuthState(auth);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}