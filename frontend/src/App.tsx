import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Tasks from './pages/Tasks';

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/tasks"
                        element={
                            <PrivateRoute>
                                <Tasks />
                            </PrivateRoute>
                        }
                    />
                    <Route path="/" element={<Navigate to="/tasks" />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
};

export default App;
