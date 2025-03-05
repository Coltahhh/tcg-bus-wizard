import Layout from '../components/Layout';
import { useCollection } from 'react-firebase-hooks/firestore';
import { db } from '../firebase/firebaseConfig';
import { collection, query, orderBy } from 'firebase/firestore';
import Link from 'next/link';

export default function Tournaments() {
    const [snapshot, loading] = useCollection(
        query(collection(db, 'tournaments'), orderBy('date', 'desc'))
    );

    return (
        <Layout>
            <div className="container mx-auto py-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Tournaments</h1>
                    <Link href="/tournaments/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        Create New
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center">Loading tournaments...</div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {snapshot?.docs.map((doc) => {
                            const tournament = doc.data();
                            return (
                                <div key={doc.id} className="bg-white p-4 rounded-lg shadow">
                                    <h3 className="text-xl font-semibold mb-2">{tournament.name}</h3>
                                    <div className="flex items-center mb-2">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                        tournament.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                            tournament.status === 'ongoing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                    }`}>
                      {tournament.status}
                    </span>
                                    </div>
                                    <p className="text-gray-600 mb-2">
                                        {new Date(tournament.date?.toDate()).toLocaleDateString()}
                                    </p>
                                    <Link href={`/tournaments/${doc.id}`} className="text-blue-600 hover:underline">
                                        View Details →
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}