import Layout from '../components/Layout';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/firebaseConfig';
import { collection, orderBy, query } from 'firebase/firestore';

export default function Rankings() {
    const [snapshot, loading] = useCollection(
        query(collection(db, 'users'), orderBy('points', 'desc'))
    );

    return (
        <Layout>
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold mb-6">Player Rankings</h1>

                {loading ? (
                    <div className="text-center">Loading rankings...</div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left">Rank</th>
                                <th className="px-6 py-3 text-left">Player</th>
                                <th className="px-6 py-3 text-left">Points</th>
                                <th className="px-6 py-3 text-left">W/L Ratio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {snapshot?.docs.map((doc, index) => {
                                const data = doc.data();
                                return (
                                    <tr key={doc.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">#{index + 1}</td>
                                        <td className="px-6 py-4 font-medium">{data.username}</td>
                                        <td className="px-6 py-4">{data.points || 0}</td>
                                        <td className="px-6 py-4">
                                            {data.wins || 0}/{data.losses || 0}
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </Layout>
    );
}