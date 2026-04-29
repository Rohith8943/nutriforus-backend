import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Bookmark, 
  Search,
  Clock,
  Flame,
  Star,
  ChefHat,
  ArrowRight,
  Compass
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './Recipes.css';

const SavedRecipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchSaved = async () => {
      try {
        setLoading(true);
        const res = await api.get('/recipes/saved');
        setRecipes(res.data);
      } catch (err) {
        console.error("Fetch saved recipes error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSaved();
  }, []);

  const filtered = recipes.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="saved-recipes-view loading">
        <div className="hp-orb" />
        <p>Syncing Saved Library...</p>
      </div>
    );
  }

  return (
    <div className="saved-recipes-view animate-fade-in">
      <header className="saved-header-fixed">
        <div className="header-top">
          <button className="back-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <h1>Saved Recipes</h1>
          <div className="bookmark-icon-wrap"><Bookmark size={20} fill="#22c55e" color="#22c55e" /></div>
        </div>
        
        <div className="saved-search glass-panel">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search your collection..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="saved-scroll-content">
        {filtered.length === 0 ? (
          <div className="empty-saved-state">
            <Bookmark size={48} className="empty-icon" />
            <h3>No recipes saved yet</h3>
            <p>Explore the library and bookmark recipes to see them here.</p>
            <button className="explore-btn-premium" onClick={() => navigate('/explore')}>
              <Compass size={18} />
              <span>Explore Library</span>
            </button>
          </div>
        ) : (
          <div className="recipes-grid-layout">
            {filtered.map((recipe, i) => (
              <div 
                key={recipe._id} 
                className="library-card-noimg glass-panel animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
                onClick={() => navigate(`/recipe/${recipe._id}`)}
              >
                <div className="lib-card-top">
                  <div className="lib-icon-circle">
                    <ChefHat size={18} />
                  </div>
                  <div className="lib-badge-clean">{recipe.category || 'Healthy'}</div>
                </div>
                <div className="lib-card-info-clean">
                  <h4>{recipe.title}</h4>
                  <div className="lib-meta-clean">
                    <span className="meta-pill"><Clock size={10} /> 25m</span>
                    <span className="meta-pill"><Flame size={10} /> {recipe.calories || 450} kcal</span>
                    <span className="meta-pill" style={{ marginLeft: 'auto', background: 'transparent' }}>
                      <Star size={10} fill="#f59e0b" color="#f59e0b" /> 4.8
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="nav-spacer-xl" />
      </div>
    </div>
  );
};

export default SavedRecipes;
