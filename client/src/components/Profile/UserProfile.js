// client/src/components/Profile/UserProfile.js
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/firebaseConfig';

export default function UserProfile() {
    const [user] = useAuthState(auth);

    return (
        <div className="profile-card">
            <h2>{user?.displayName || 'Anonymous Pirate'}</h2>
            <p>Email: {user?.email}</p>
            <p>Member since: {user?.metadata.creationTime}</p>
        </div>
    );
}