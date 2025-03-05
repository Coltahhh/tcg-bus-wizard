import Layout from './components/Layout';
import Link from 'next/link';

export default function Home() {
    return (
        <Layout>
            <div className="min-h-screen">
                {/* Hero Section */}
                <section className="bg-blue-600 text-white py-20">
                    <div className="container mx-auto text-center">
                        <h1 className="text-5xl font-bold mb-4">TCG Tournament Manager</h1>
                        <p className="text-xl mb-8">Organize, Compete, Dominate</p>
                        <div className="space-x-4">
                            <Link href="/tournaments" className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50">
                                View Tournaments
                            </Link>
                            <Link href="/rankings" className="border-2 border-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600">
                                See Rankings
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-16">
                    <div className="container mx-auto grid md:grid-cols-3 gap-8">
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Live Brackets</h3>
                            <p>Real-time tournament tracking with interactive brackets</p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Player Rankings</h3>
                            <p>Dynamic leaderboards with ELO-style scoring</p>
                        </div>
                        <div className="p-6 border rounded-lg">
                            <h3 className="text-xl font-bold mb-4">Prize Tracking</h3>
                            <p>Transparent prize distribution and history</p>
                        </div>
                    </div>
                </section>
            </div>
        </Layout>
    );
}