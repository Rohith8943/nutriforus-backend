import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ChefHat, BookOpen, Calendar, MessageSquare } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  return (
    <nav className="bottom-nav">
      <div className="nav-container glass-panel">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/explore" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <ChefHat size={22} />
          <span>Recipes</span>
        </NavLink>
        <NavLink to="/blogs" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <BookOpen size={22} />
          <span>Blogs</span>
        </NavLink>
        <NavLink to="/meal-planner" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Calendar size={22} />
          <span>Planner</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <MessageSquare size={22} />
          <span>Chat</span>
        </NavLink>
      </div>
    </nav>
  );
};

export default BottomNav;
