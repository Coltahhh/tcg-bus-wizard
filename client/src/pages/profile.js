import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { auth } from './firebase/firebaseConfig';
import { signOut } from 'firebase/auth';

export default function Profile() {
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Player Profile</h1>

                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Username</label>
                        <p className="mt-1">{user?.username || 'No username set'}</p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Email</label>
                        <p className="mt-1">{user?.email}</p>
                        <span className={`text-sm ${user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
              ({user?.emailVerified ? 'Verified' : 'Not Verified'})
            </span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 font-medium">Stats</label>
                        <div className="grid grid-cols-2 gap-4 mt-2">
                            <div className="p-3 bg-gray-50 rounded">
                                <div className="text-sm text-gray-600">Wins</div>
                                <div className="text-xl font-bold">{user?.wins || 0}</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded">
                                <div className="text-sm text-gray-600">Losses</div>
                                <div className="text-xl font-bold">{user?.losses || 0}</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </Layout>
    );
}