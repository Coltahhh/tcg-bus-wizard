import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-danger">
            <div className="container">
                <Link className="navbar-brand" to="/">🏴‍☠️ TCGBusWizard</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/tournaments">Tournaments</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/ranking">Ranking</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/prizing">Prizing</Link></li>
                    </ul>
                    {user ? (
                        <button className="btn btn-outline-light" onClick={logout}>Logout</button>
                    ) : (
                        <Link className="btn btn-outline-light" to="/login">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;