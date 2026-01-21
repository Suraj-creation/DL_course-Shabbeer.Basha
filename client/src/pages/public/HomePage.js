import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaBookOpen, FaArrowRight, FaGraduationCap, FaCalendarAlt, FaUserTie, FaLayerGroup, FaFlask, FaBrain, FaLaptopCode, FaRocket, FaExternalLinkAlt, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import './PublicPages.css';

const HomePage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  const loadCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await courseAPI.getAll();
      setCourses(res.data.data || []);
    } catch (err) {
      console.error('Error loading courses:', err);
      setError(err.response?.data?.message || 'Unable to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCourses();
  }, [loadCourses, retryCount]);

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
  };

  return (
    <div className="public-page">
      <Header />

      <main className="main-content">
        {/* Hero Section - Production Grade */}
        <section className="hero-section">
          <div className="hero-background">
            <div className="hero-gradient"></div>
            <div className="hero-pattern"></div>
            <div className="hero-glow"></div>
          </div>
          
          <div className="hero-content">
            <div className="hero-badge">
              <span className="badge-icon">🎯</span>
              <span>DATA302 • January 2026</span>
            </div>
            
            <h1 className="hero-title">
              <span className="title-accent">Deep Learning</span>
              <span className="title-sub">DATA302 - Vidyashilp University</span>
            </h1>
            
            <p className="hero-description">
              Master neural networks from fundamentals to advanced architectures. Learn CNNs, RNNs, 
              Transformers, and model optimization techniques using PyTorch and TensorFlow. 
              Build, train, and deploy production-ready deep learning systems.
            </p>
            
            <div className="hero-cta">
              <Link to="/lectures" className="btn-hero-primary">
                <FaBookOpen />
                Explore Lectures
                <FaArrowRight className="btn-arrow" />
              </Link>
              <Link to="/prerequisites" className="btn-hero-secondary">
                View Prerequisites
              </Link>
            </div>

            {/* Instructor Info */}
            <div className="instructor-highlight">
              <div className="instructor-card">
                <FaUserTie className="instructor-icon" />
                <div className="instructor-info">
                  <span className="instructor-label">Primary Instructor</span>
                  <span className="instructor-name">Dr. Shabbeer Basha</span>
                  <span className="instructor-title">Associate Professor, SET, Vidyashilp University</span>
                  <a 
                    href="https://sites.google.com/site/shabbeerbashash" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="instructor-website-link"
                  >
                    Instructor Website <FaExternalLinkAlt size={12} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Course Learning Outcomes Section */}
        <section className="clo-section">
          <div className="section-container">
            <div className="section-header">
              <div className="section-badge">Course Learning Outcomes</div>
              <h2 className="section-title">What You'll Master</h2>
              <p className="section-subtitle">
                Upon successful completion of this course, you will gain these essential skills
              </p>
            </div>
            
            <div className="clo-grid">
              <div className="clo-card">
                <div className="clo-icon"><FaBrain /></div>
                <h3>CLO-1: Fundamental Concepts</h3>
                <p>Explain the fundamental concepts and working principles of both shallow and deep neural networks, including biological inspiration and mathematical foundations.</p>
              </div>
              <div className="clo-card">
                <div className="clo-icon"><FaFlask /></div>
                <h3>CLO-2: Model Application</h3>
                <p>Apply suitable neural network models to solve given tasks by selecting appropriate architectures (feed-forward, CNN, RNN) based on data characteristics.</p>
              </div>
              <div className="clo-card">
                <div className="clo-icon"><FaLaptopCode /></div>
                <h3>CLO-3: Implementation</h3>
                <p>Implement Deep Learning based AI Systems for real-world datasets using modern frameworks like PyTorch, TensorFlow, and Keras through 15 comprehensive lab programs.</p>
              </div>
              <div className="clo-card">
                <div className="clo-icon"><FaRocket /></div>
                <h3>CLO-4: Optimization & Deployment</h3>
                <p>Optimize deep learning models for performance, memory efficiency, and deployment on edge devices using quantization, pruning, and knowledge distillation.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Course Modules Preview */}
        <section className="modules-preview-section">
          <div className="section-container">
            <div className="section-header">
              <div className="section-badge">Course Modules</div>
              <h2 className="section-title">Comprehensive Curriculum</h2>
              <p className="section-subtitle">5 in-depth modules covering foundational to advanced topics</p>
            </div>
            
            <div className="modules-grid">
              <div className="module-card">
                <span className="module-number">01</span>
                <h4>Introduction to Neural Networks</h4>
                <p>Perceptrons, Feed-Forward Networks, Back-Propagation, Optimization Algorithms (SGD, Adam, RMSProp)</p>
              </div>
              <div className="module-card">
                <span className="module-number">02</span>
                <h4>Convolutional Neural Networks</h4>
                <p>CNN Architectures, AlexNet, VGG, ResNet, MobileNet, Regularization Techniques, Feature Visualization</p>
              </div>
              <div className="module-card">
                <span className="module-number">03</span>
                <h4>Recurrent Neural Networks</h4>
                <p>RNNs, LSTM, GRU, Attention Mechanisms, Sequence-to-Sequence Models, Vanishing Gradients</p>
              </div>
              <div className="module-card">
                <span className="module-number">04</span>
                <h4>Autoencoders & GANs</h4>
                <p>Variational Autoencoders, Generative Adversarial Networks, Image Generation, Anomaly Detection</p>
              </div>
              <div className="module-card">
                <span className="module-number">05</span>
                <h4>Model Optimization</h4>
                <p>Quantization, Pruning, Knowledge Distillation, Edge Deployment, Mobile & IoT Applications</p>
              </div>
            </div>
          </div>
        </section>

        {/* Courses Section */}
        <section className="courses-section-enhanced">
          <div className="section-container">
            <div className="section-header">
              <div className="section-badge">Available Courses</div>
              <h2 className="section-title">Explore Our Curriculum</h2>
              <p className="section-subtitle">
                Dive into our carefully structured courses designed to take you from fundamentals to expertise
              </p>
            </div>
            
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <span className="loading-text">Loading courses...</span>
              </div>
            ) : error ? (
              <div className="error-state-enhanced">
                <div className="error-icon-wrapper">
                  <FaExclamationTriangle className="error-icon" />
                </div>
                <h3>Unable to Load Courses</h3>
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-btn">
                  <FaSync /> Try Again
                </button>
              </div>
            ) : courses.length === 0 ? (
              <div className="empty-state-enhanced">
                <div className="empty-icon-wrapper">
                  <FaGraduationCap className="empty-icon" />
                </div>
                <h3>No Courses Available</h3>
                <p>Check back later for new courses.</p>
              </div>
            ) : (
              <div className="course-grid-enhanced">
                {courses.map((course, index) => (
                  <article 
                    key={course._id} 
                    className="course-card-enhanced"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="card-header">
                      <span className="course-code-badge">{course.courseCode}</span>
                      {course.isActive && <span className="status-badge active">Active</span>}
                    </div>
                    
                    <h3 className="course-title">{course.courseTitle}</h3>
                    
                    <div className="card-divider"></div>
                    
                    <p className="course-description">
                      {course.description?.substring(0, 150)}
                      {course.description?.length > 150 && '...'}
                    </p>
                    
                    <div className="course-meta-grid">
                      {course.instructor?.name && (
                        <div className="meta-item">
                          <FaUserTie className="meta-icon" />
                          <span>{course.instructor.name}</span>
                        </div>
                      )}
                      <div className="meta-item">
                        <FaCalendarAlt className="meta-icon" />
                        <span>{course.semester || 'Jan-May 2026'}</span>
                      </div>
                      {course.credits && (
                        <div className="meta-item">
                          <FaLayerGroup className="meta-icon" />
                          <span>{course.credits} Credits</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="card-footer">
                      <Link to="/lectures" className="card-cta">
                        View Lectures
                        <FaArrowRight />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
