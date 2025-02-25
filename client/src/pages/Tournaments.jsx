import { useState, useEffect } from 'react';
import axios from 'axios';
import TournamentCard from '../components/TournamentCard';

const Tournaments = () => {
    const [tournaments, setTournaments] = useState([]);

    useEffect(() => {
        const fetchTournaments = async () => {
            try {
                const response = await axios.get('/api/tournaments');
                setTournaments(response.data);
            } catch (error) {
                console.error('Error fetching tournaments:', error);
            }
        };
        fetchTournaments();
    }, []);

    return (
        <div className="row">
            {tournaments.map(tournament => (
                <div className="col-md-4 mb-4" key={tournament._id}>
                    <TournamentCard tournament={tournament} />
                </div>
            ))}
        </div>
    );
};

export default Tournaments;