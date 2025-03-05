import Layout from '../components/Layout';

export default function Rankings() {
    const rankings = [
        { rank: 1, username: 'Player1', points: 1200, wins: 12, losses: 2 },
        { rank: 2, username: 'Player2', points: 1150, wins: 11, losses: 3 },
        // Add more players
    ];

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Player Rankings</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg overflow-hidden">
                        <thead className="bg-gray-800 text-white">
                        <tr>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">Username</th>
                            <th className="px-6 py-3">Points</th>
                            <th className="px-6 py-3">W/L Ratio</th>
                        </tr>
                        </thead>
                        <tbody>
                        {rankings.map((player) => (
                            <tr key={player.rank} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{player.rank}</td>
                                <td className="px-6 py-4">{player.username}</td>
                                <td className="px-6 py-4">{player.points}</td>
                                <td className="px-6 py-4">{player.wins}/{player.losses}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}