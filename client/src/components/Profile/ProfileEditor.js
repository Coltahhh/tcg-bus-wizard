// client/src/components/Profile/ProfileEditor.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getUserProfile, updateUserProfile } from "../../services/userService";

export default function ProfileEditor() {
    const { currentUser } = useAuth();
    const [profile, setProfile] = useState({
        displayName: "",
        bio: "",
        avatar: ""
    });

    useEffect(() => {
        const loadProfile = async () => {
            const userProfile = await getUserProfile(currentUser.uid);
            setProfile(userProfile || {});
        };
        loadProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await updateUserProfile(currentUser.uid, profile);
    };

    return (
        <div className="profile-form">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Display Name</label>
                    <input
                        type="text"
                        value={profile.displayName}
                        onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label>Bio</label>
                    <textarea
                        value={profile.bio}
                        onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
}