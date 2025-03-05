// client/src/components/Profile/Profile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { Button, Form, Card } from 'react-bootstrap';


export default function Profile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState({
        displayName: '',
        bio: '',
        avatar: ''
    });
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (currentUser) {
                const docRef = doc(auth, 'users', currentUser.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
                setLoading(false);
            }
        };

        fetchProfile();
    }, [currentUser]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userRef = doc(db, 'users', currentUser.uid);
            await updateDoc(userRef, profile);
            setEditMode(false);
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    if (loading) return <div>Loading profile...</div>;

    return (
        <div className="profile-container">
            <Card className="profile-card">
                <Card.Body>
                    <Card.Title className="text-center mb-4">
                        {editMode ? 'Edit Profile' : 'Your Profile'}
                    </Card.Title>

                    {editMode ? (
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label>Display Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={profile.displayName}
                                    onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                                    required
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Bio</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={profile.bio}
                                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                                />
                            </Form.Group>

                            <div className="d-grid gap-2">
                                <Button variant="primary" type="submit">
                                    Save Changes
                                </Button>
                                <Button variant="secondary" onClick={() => setEditMode(false)}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    ) : (
                        <>
                            <div className="profile-info">
                                <h4>{profile.displayName || 'Anonymous Pirate'}</h4>
                                <p className="text-muted">{currentUser.email}</p>
                                {profile.bio && <p className="bio">{profile.bio}</p>}
                            </div>
                            <Button
                                variant="outline-primary"
                                onClick={() => setEditMode(true)}
                                className="mt-3"
                            >
                                Edit Profile
                            </Button>
                        </>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
}