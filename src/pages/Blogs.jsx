import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  ChevronLeft,
  Search,
  ArrowRight,
  Tag
} from 'lucide-react';
import api from '../api/axios';
import './Blogs.css';

const Blogs = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/blogs');
      setBlogs(res.data);
    } catch (err) {
      console.error("Fetch blogs error:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = blogs.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categoryColors = ['#22c55e', '#3b82f6', '#f59e0b', '#a855f7', '#ef4444'];

  return (
    <div className="blogs-page animate-fade-in">
      <header className="blogs-header">
        <div className="blogs-header-top">
          <button className="back-btn-minimal" onClick={() => navigate(-1)}>
            <ChevronLeft size={20} />
          </button>
          <div className="blogs-header-text">
            <h1>Nutrition <span>Insights</span></h1>
          </div>
        </div>

        <div className="blogs-search glass-panel">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search articles..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      <div className="blogs-content">
        {loading ? (
          <div className="blogs-loading">
            <div className="loading-spinner" />
            <p>Loading articles...</p>
          </div>
        ) : filtered.length > 0 ? (
          <div className="blogs-list">
            {filtered.map((blog, idx) => (
              <div 
                key={blog._id} 
                className="blog-card glass-panel animate-slide-up"
                style={{ animationDelay: `${idx * 0.05}s` }}
                onClick={() => navigate(`/blog/${blog._id}`)}
              >
                <div className="blog-card-left">
                  <div 
                    className="blog-icon-box"
                    style={{ background: `${categoryColors[idx % 5]}15`, borderColor: `${categoryColors[idx % 5]}30`, color: categoryColors[idx % 5] }}
                  >
                    <BookOpen size={20} />
                  </div>
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-top-row">
                    <span className="blog-cat-tag">{blog.category || 'Article'}</span>
                    <span className="blog-date">
                      <Calendar size={10} />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="blog-card-title">{blog.title}</h3>
                  <p className="blog-card-excerpt">
                    {blog.intro ? blog.intro.substring(0, 90) + '...' : 'Clinical insights for better nutrition.'}
                  </p>
                  <div className="blog-read-row">
                    <span className="read-more-txt">Read more</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-simple">
            <BookOpen size={20} />
            <p>No articles found</p>
          </div>
        )}
      </div>
      <div className="nav-spacer-xl" />
    </div>
  );
};

export default Blogs;
