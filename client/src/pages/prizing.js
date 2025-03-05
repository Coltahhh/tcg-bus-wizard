import Layout from '../components/Layout';

export default function Prizing() {
    const prizeDistribution = [
        { position: 1, prize: '$500' },
        { position: 2, prize: '$300' },
        { position: 3, prize: '$200' },
        { position: '4-8', prize: '$50' },
    ];

    return (
        <Layout>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Prize Distribution</h1>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Position</th>
                            <th className="px-6 py-3 text-left">Prize</th>
                            <th className="px-6 py-3 text-left">Additional Rewards</th>
                        </tr>
                        </thead>
                        <tbody>
                        {prizeDistribution.map((prize, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4">{prize.position}</td>
                                <td className="px-6 py-4 font-medium">{prize.prize}</td>
                                <td className="px-6 py-4">Premium Tournament Entry</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </Layout>
    );
}