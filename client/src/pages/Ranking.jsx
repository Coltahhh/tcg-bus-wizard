import { useState, useEffect } from 'react';
import axios from 'axios';

const Ranking = () => {
    const [rankings, setRankings] = useState([]);

    useEffect(() => {
        const fetchRankings = async () => {
            try {
                const response = await axios.get('/api/rankings');
                setRankings(response.data);
            } catch (error) {
                console.error('Error fetching rankings:', error);
            }
        };
        fetchRankings();
    }, []);

    return (
        <table className="table table-dark table-striped">
            <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Points</th>
                <th>Wins</th>
            </tr>
            </thead>
            <tbody>
            {rankings.map((player, index) => (
                <tr key={player._id}>
                    <td>{index + 1}</td>
                    <td>{player.username}</td>
                    <td>{player.points}</td>
                    <td>{player.wins}</td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Ranking;