import Layout from '../components/Layout';

export default function Home() {
    return (
        <Layout>
            <div className="text-center py-20">
                <h1 className="text-4xl font-bold mb-4">Welcome to TCG Bus Wizard</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Your ultimate destination for TCG tournament management and rankings
                </p>
                <div className="space-x-4">
                    <a href="/tournaments" className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600">
                        View Tournaments
                    </a>
                    <a href="/rankings" className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600">
                        Check Rankings
                    </a>
                </div>
            </div>
        </Layout>
    );
}