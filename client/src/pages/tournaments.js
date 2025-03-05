import Layout from '../components/Layout';

export default function Tournaments() {
    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8">Tournaments</h1>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Tournament Card */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-2">Summer Championship</h2>
                        <p className="text-gray-600 mb-4">July 15, 2024</p>
                        <div className="flex justify-between items-center">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                Upcoming
              </span>
                            <a href="/tournaments/1" className="text-blue-500 hover:text-blue-700">
                                View Details →
                            </a>
                        </div>
                    </div>

                    {/* Add more tournament cards here */}
                </div>
            </div>
        </Layout>
    );
}