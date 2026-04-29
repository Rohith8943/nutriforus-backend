import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Appointments from './pages/Appointments';
import MealPlanner from './pages/MealPlanner';
import HealthProfile from './pages/HealthProfile';
import UserChat from './pages/UserChat';
import BookAppointment from './pages/BookAppointment';
import RecipeDetail from './pages/RecipeDetail';
import SavedRecipes from './pages/SavedRecipes';
import Blogs from './pages/Blogs';
import Plans from './pages/Plans';
import Settings from './pages/Settings';
import BlogDetail from './pages/BlogDetail';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Notifications from './pages/Notifications';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Home />} />
          <Route path="explore" element={<Recipes />} />
          <Route path="recipe/:id" element={<RecipeDetail />} />
          <Route path="saved-recipes" element={<SavedRecipes />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="blog/:id" element={<BlogDetail />} />
          <Route path="progress" element={<Progress />} />
          <Route path="profile" element={<Profile />} />
          <Route path="plans" element={<Plans />} />
          <Route path="settings" element={<Settings />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="book-appointment" element={<BookAppointment />} />
          <Route path="meal-planner" element={<MealPlanner />} />
          <Route path="health-profile" element={<HealthProfile />} />
          <Route path="chat" element={<UserChat />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="terms" element={<Terms />} />
          <Route path="notifications" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
