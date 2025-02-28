// client/src/components/Navigation.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase/firebaseConfig";
import { signOut } from "firebase/auth";

export default function Navigation() {
    const { currentUser } = useAuth();

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    🏴‍☠️ TCGBusWizard
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        {/* ... existing nav items ... */}
                    </ul>
                    <div className="d-flex">
                        {currentUser ? (
                            <button onClick={handleLogout} className="btn btn-outline-warning">
                                Logout
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline-warning">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}