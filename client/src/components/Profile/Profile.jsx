import { useAuth } from '../../context/AuthContext';

export default function Profile() {
    const { currentUser } = useAuth();

    return (
        <div className="container mt-4">
            <h2>Profile</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{currentUser.email}</h5>
                    <p className="card-text">
                        Member since: {currentUser.metadata.creationTime}
                    </p>
                </div>
            </div>
        </div>
    );
}