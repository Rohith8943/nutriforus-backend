import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  ChefHat, 
  Clock, 
  Flame, 
  Star, 
  Filter, 
  Coffee, 
  Pizza, 
  Soup, 
  Apple,
  ChevronLeft,
  ArrowRight,
  Bookmark,
  Utensils
} from 'lucide-react';
import api from '../api/axios';
import './Recipes.css';

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recipes');
        setRecipes(res.data);
      } catch (err) {
        console.error("Fetch recipes error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const categories = [
    { name: 'All', icon: <ChefHat size={18} /> },
    { name: 'Breakfast', icon: <Coffee size={18} /> },
    { name: 'Lunch', icon: <Pizza size={18} /> },
    { name: 'Dinner', icon: <Soup size={18} /> },
    { name: 'Snacks', icon: <Apple size={18} /> },
  ];

  const filtered = recipes.filter(r => {
    const matchesSearch = r.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === "All" || r.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  if (loading && recipes.length === 0) {
    return (
      <div className="hp-loading-view">
        <div className="hp-orb" />
        <p>Exploring Recipes...</p>
      </div>
    );
  }

  return (
    <div className="explore-page animate-fade-in">
      <header className="modern-header">
        <div className="header-top-row-simple">
          <button className="back-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="header-content">
            <h1 className="header-title">Explore <span>Recipes</span></h1>
          </div>
        </div>
        
        <div className="search-container">
          <div className="search-wrapper glass-panel">
            <Search size={20} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for recipes..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="saved-library-btn glass-panel" onClick={() => navigate('/saved-recipes')}>
            <Bookmark size={20} />
          </button>
        </div>
      </header>

      {/* Featured Section */}
      {activeCategory === "All" && search === "" && recipes.length > 0 && (
        <section className="featured-recipes-section">
          <div className="section-title-row">
            <h3>Recommended For You</h3>
            <span className="view-all">See All</span>
          </div>
          <div className="featured-scroll">
            {recipes.slice(0, 3).map((recipe, idx) => (
              <div 
                key={`featured-${recipe._id}`} 
                className="featured-card-noimg glass-panel"
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                <div className={`featured-bg-shape bg-color-${idx % 3}`}></div>
                <div className="featured-icon-box">
                  <ChefHat size={32} />
                </div>
                <div className="featured-card-content">
                  <div className="featured-badge">Featured</div>
                  <h4>{recipe.title}</h4>
                  <div className="featured-meta">
                    <span><Clock size={12} /> {recipe.time || '25 min'}</span>
                    <span><Flame size={12} /> {recipe.calories || '450'} kcal</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="category-bubble-scroll">
        {categories.map(cat => (
          <button 
            key={cat.name} 
            className={`category-bubble ${activeCategory === cat.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.name)}
          >
            <div className="bubble-icon">{cat.icon}</div>
            <span>{cat.name}</span>
          </button>
        ))}
      </div>

      <section className="recipes-grid">
        <div className="recipes-grid-layout">
          {filtered.length === 0 ? (
            <div className="empty-simple">
              <Search size={20} />
              <p>No recipes found</p>
            </div>
          ) : (
            filtered.map((recipe, idx) => (
              <div 
                key={recipe._id} 
                className="library-card-noimg glass-panel animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                <div className="lib-card-top">
                  <div className="lib-icon-circle">
                    <Utensils size={18} />
                  </div>
                  <div className="lib-badge-clean">{recipe.category || 'Healthy'}</div>
                </div>
                <div className="lib-card-info-clean">
                  <h4>{recipe.title}</h4>
                  <div className="lib-meta-clean">
                    <span className="meta-pill"><Clock size={10} /> {recipe.time || '25m'}</span>
                    <span className="meta-pill"><Flame size={10} /> {recipe.calories || '450'}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
      <div className="nav-spacer-xl" />
    </div>
  );
};

export default Recipes;
