import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`/api/users/${userId}`);
                setProfile(response.data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userId]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Profile Header */}
                <div className="col-md-4">
                    <div className="card bg-dark text-white">
                        <img src={profile.avatar} className="card-img-top" alt="Avatar" />
                        <div className="card-body">
                            <h2 className="card-title">{profile.username}</h2>
                            <p className="card-text">{profile.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Tournament History */}
                <div className="col-md-8">
                    <h3>Tournament History</h3>
                    <div className="row">
                        {profile.joinedTournaments.map(tournament => (
                            <div className="col-md-6 mb-3" key={tournament._id}>
                                <div className="card bg-secondary text-white">
                                    <div className="card-body">
                                        <h5 className="card-title">{tournament.name}</h5>
                                        <p className="card-text">
                                            {new Date(tournament.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;