import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Clock, 
  Flame, 
  Star, 
  Bookmark,
  Share2,
  ChefHat,
  Utensils,
  Leaf,
  Info,
  CheckCircle2,
  Target,
  Zap,
  Activity
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import './Recipes.css';

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/recipes/${id}`);
        setRecipe(res.data);
        
        // Check if saved
        const savedRes = await api.get('/recipes/saved');
        setIsSaved(savedRes.data.some(r => r._id === id));
      } catch (err) {
        console.error("Fetch recipe error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  const toggleSave = async () => {
    try {
      const res = await api.post(`/recipes/${id}/toggle-save`);
      setIsSaved(res.data.isSaved);
    } catch (err) {
      console.error("Save toggle error:", err);
    }
  };

  if (loading) {
    return (
      <div className="recipe-detail-loading">
        <div className="loading-spinner" />
        <p>Analyzing Nutritional Profile...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="recipe-not-found">
        <h3>Recipe not found</h3>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="recipe-detail-premium animate-fade-in">
      <div className="recipe-header-minimal">
        <div className="hero-top-nav-minimal">
          <button className="nav-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="nav-group-right-minimal">
            <button className="nav-btn-minimal"><Share2 size={18} /></button>
            <button 
              className={`nav-btn-minimal ${isSaved ? 'saved' : ''}`} 
              onClick={toggleSave}
            >
              <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
            </button>
          </div>
        </div>

        <div className="recipe-title-section">
          <span className="clinical-badge-minimal">{recipe.category || 'Metabolic Plan'}</span>
          <h1 className="recipe-title-display">{recipe.title}</h1>
          <p className="recipe-summary-txt">{recipe.description || 'A precision-engineered clinical meal optimized for metabolic efficiency and nutritional density.'}</p>
          
          <div className="recipe-specs-strip-minimal">
            <div className="spec-item-minimal">
              <Clock size={16} />
              <span>{recipe.time || '25 min'}</span>
            </div>
            <div className="spec-divider-minimal" />
            <div className="spec-item-minimal">
              <Flame size={16} />
              <span>{recipe.calories || '450'} kcal</span>
            </div>
            <div className="spec-divider-minimal" />
            <div className="spec-item-minimal">
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <span>4.9</span>
            </div>
          </div>
        </div>
      </div>

      <div className="recipe-scroll-content-minimal">
        <div className="nutrition-macro-grid-minimal">
          <div className="macro-chip-minimal p-min">
            <span className="m-val">{recipe.protein || '32'}g</span>
            <span className="m-lbl">Protein</span>
          </div>
          <div className="macro-chip-minimal c-min">
            <span className="m-val">{recipe.carbs || '45'}g</span>
            <span className="m-lbl">Carbs</span>
          </div>
          <div className="macro-chip-minimal f-min">
            <span className="m-val">{recipe.fats || '14'}g</span>
            <span className="m-lbl">Fats</span>
          </div>
        </div>

        <section className="detail-section">
          <div className="section-title-wrap">
            <div className="title-icon green"><Utensils size={18} /></div>
            <h3>Required Ingredients</h3>
            <span className="item-count">{recipe.ingredients?.length || 0} items</span>
          </div>
          <div className="ingredients-grid-modern">
            {recipe.ingredients?.map((ing, i) => (
              <div key={i} className="ingredient-card-premium glass-panel">
                <CheckCircle2 size={16} className="check-icon" />
                <span className="ing-name">{ing}</span>
              </div>
            )) || <p>Ingredients data unavailable.</p>}
          </div>
        </section>

        <section className="detail-section">
          <div className="section-title-wrap">
            <div className="title-icon purple"><Zap size={18} /></div>
            <h3>Preparation Method</h3>
          </div>
          <div className="method-steps-timeline">
            {recipe.instructions?.map((step, i) => (
              <div key={i} className="method-step-card glass-panel">
                <div className="step-count-badge">{i + 1}</div>
                <div className="step-content">
                  <p>{step}</p>
                </div>
              </div>
            )) || <p>Instructions data unavailable.</p>}
          </div>
        </section>

        <div className="clinical-disclaimer-card glass-panel">
          <div className="disc-icon"><Activity size={18} /></div>
          <div className="disc-body">
            <h4>Nutritional Integrity</h4>
            <p>This recipe is calibrated for clinical precision. Ingredient substitutes may alter the metabolic load of this meal.</p>
          </div>
        </div>

        <div className="nav-spacer-xl" />
      </div>
    </div>
  );
};

export default RecipeDetail;
