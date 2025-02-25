import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Tournaments from './pages/Tournaments'
import Ranking from './pages/Ranking'
import Prizing from './pages/Prizing'
import VerifyEmail from './pages/VerifyEmail'
import VerificationRequired from './pages/VerificationRequired'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/tournaments" element={<Tournaments />} />
                    <Route path="/ranking" element={<Ranking />} />
                    <Route path="/prizing" element={<Prizing />} />
                    <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    <Route path="/verify-required" element={<VerificationRequired />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            {/* Add Profile Page Later */}
                        </ProtectedRoute>
                    } />
                </Routes>
            </div>
        </Router>
    )
}

export default App