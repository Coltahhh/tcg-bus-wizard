// client/src/components/Navigation.jsx
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';
import UserProfile from '../Profile/UserProfile';

export default function Navigation() {
    const [user] = useAuthState(auth);

    return (
        <nav>
            {/* Existing nav items */}
            {user ? (
                <UserProfile />
            ) : (
                <LoginButton />
            )}
        </nav>
    );
}