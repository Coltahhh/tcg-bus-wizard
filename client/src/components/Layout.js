import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';

export default function Layout({ children }) {
    const [user, loading] = useAuthState(auth);

    return (
        <div className="min-h-screen flex flex-col">
            {/* Navigation */}
            <nav className="bg-gray-800 text-white p-4">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-xl font-bold">TCG Bus Wizard</Link>
                    <div className="space-x-4">
                        <Link href="/tournaments" className="hover:text-gray-300">Tournaments</Link>
                        <Link href="/rankings" className="hover:text-gray-300">Rankings</Link>
                        {user ? (
                            <Link href="/profile" className="hover:text-gray-300">Profile</Link>
                        ) : (
                            <Link href="/login" className="hover:text-gray-300">Login</Link>
                        )}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow container mx-auto p-4">
                {children}
            </main>

            {/* Footer */}
            <footer className="bg-gray-800 text-white p-4 mt-auto">
                <div className="container mx-auto text-center">
                    <p>© 2024 TCG Bus Wizard. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}