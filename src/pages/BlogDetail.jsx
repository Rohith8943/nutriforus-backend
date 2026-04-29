import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  Calendar, 
  Clock, 
  Share2, 
  Info,
  BookOpen
} from 'lucide-react';
import api from '../api/axios';
import './BlogDetail.css';

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/${id}`);
        setBlog(res.data);
      } catch (err) {
        console.error("Fetch blog error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="blog-loading-view">
        <div className="loading-spinner" />
        <p>Loading article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-not-found">
        <BookOpen size={36} />
        <h3>Article not found</h3>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="blog-detail-page animate-fade-in">

      {/* Minimal Header */}
      <header className="blog-detail-header">
        <button className="back-btn-minimal" onClick={() => navigate(-1)}>
          <ChevronLeft size={20} />
        </button>
        <button className="blog-share-btn">
          <Share2 size={18} />
        </button>
      </header>

      {/* Title Section */}
      <div className="blog-title-section">
        <span className="blog-cat-badge">{blog.category || 'Clinical Nutrition'}</span>
        <h1 className="blog-title-main">{blog.title}</h1>
        <div className="blog-meta-row">
          <span className="blog-meta-item">
            <Calendar size={13} />
            {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="blog-meta-sep" />
          <span className="blog-meta-item">
            <Clock size={13} />
            {blog.readTime || '8 min read'}
          </span>
        </div>
      </div>

      {/* Article Body */}
      <article className="blog-article-body">
        {blog.intro && (
          <p className="article-intro">{blog.intro}</p>
        )}

        {blog.sections && blog.sections.map((section, i) => (
          <div key={i} className="article-section">
            {section.heading && <h2 className="article-heading">{section.heading}</h2>}
            <div className="article-text" dangerouslySetInnerHTML={{ __html: section.body }} />
          </div>
        ))}

        <div className="article-disclaimer">
          <Info size={16} className="disclaimer-icon" />
          <p>This content is for informational purposes only. Always consult your doctor for specific medical advice.</p>
        </div>
      </article>

      <div className="nav-spacer-xl" />
    </div>
  );
};

export default BlogDetail;
