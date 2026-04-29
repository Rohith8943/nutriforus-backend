import React from 'react';
import { Search, ChefHat, BookOpen } from 'lucide-react';
import './Explore.css';

const Explore = () => {
  return (
    <div className="explore-page animate-fade-in">
      <header className="page-header">
        <h1>Explore</h1>
        <div className="search-bar glass-panel">
          <Search size={20} />
          <input type="text" placeholder="Search recipes, blogs..." />
        </div>
      </header>

      <div className="category-chips">
        <button className="chip active">All</button>
        <button className="chip">Recipes</button>
        <button className="chip">Blogs</button>
        <button className="chip">Nutrition</button>
      </div>

      <section className="featured-section">
        <div className="section-title">
          <h3>Featured Recipes</h3>
        </div>
        <div className="recipe-card glass-panel">
          <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop" alt="Recipe" />
          <div className="recipe-overlay">
            <span className="badge">New</span>
            <h4>Mediterranean Bowl</h4>
            <div className="recipe-meta">
              <span><ChefHat size={14} /> 20 min</span>
              <span><Flame size={14} /> 450 kcal</span>
            </div>
          </div>
        </div>
      </section>

      <section className="blogs-section">
        <div className="section-title">
          <h3>Health Tips</h3>
        </div>
        <div className="blog-item glass-panel">
          <div className="blog-content">
            <h4>The Power of Probiotics</h4>
            <p>Learn how gut health affects your mood...</p>
            <span className="blog-date">Apr 24, 2026</span>
          </div>
          <BookOpen size={24} className="blog-icon" />
        </div>
      </section>
    </div>
  );
};

// Mock Flame for Explore page since it's used in meta
const Flame = ({ size }) => <span style={{fontSize: size}}>🔥</span>;

export default Explore;
