import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/main.css';
import Header from './components/header';
import Nav from './components/nav';
import Footer from './components/footer';
import 'bootstrap/dist/css/bootstrap.min.css';

import HomePage from './pages/homePage';
import LoginPage from './pages/loginPage';
import RegisterPage from './pages/registerPage';
import DashboardPage from './pages/dashboardPage';
import ListingsPage from './pages/listingsPage';
import PaymentsPage from './pages/paymentsPage';
import ReviewsPage from './pages/reviewsPage';
import CommunityPage from './pages/communityPage';
import AdminDashboardPage from './pages/adminDashboardPage';
import NotFoundPage from './pages/notFoundPage';
import EquipmentDetailsPage from './pages/equipmentDetailsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="app">
        <Header user={user} onLogout={logout} />
        <Nav user={user} />

        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage user={user} />} />
            <Route path="/listings" element={<ListingsPage />} />
            <Route path="/payments" element={<PaymentsPage />} />
            <Route path="/reviews" element={<ReviewsPage />} />
            <Route path="/community" element={<CommunityPage user={user} />} />
            <Route path="/admin" element={<AdminDashboardPage user={user} />} />
            <Route path="/equipment/:id" element={<EquipmentDetailsPage />} />
            <Route path="/reviews/:id" element={<ReviewsPage user={user} />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
