import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, resourceAPI } from '../../services/api';
import './PublicPages.css';

const ResourcesPage = () => {
  const [courses, setCourses] = useState([]);
  const [resources, setResources] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Books', 'Online Courses', 'Research Papers', 'Tools & Frameworks', 'Communities', 'Datasets', 'Documentation', 'Other'];

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadResources(); }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const loadResources = async () => {
    try {
      const response = await resourceAPI.getByCourse(selectedCourse);
      setResources(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const filteredResources = selectedCategory === 'All' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>Resources</h1>
        <nav className="main-nav">
          <Link to="/">Home</Link>
          <Link to="/curriculum">Curriculum</Link>
          <Link to="/assignments">Assignments</Link>
          <Link to="/tutorials">Tutorials</Link>
          <Link to="/exams">Exams</Link>
          <Link to="/prerequisites">Prerequisites</Link>
          <Link to="/teaching-team">Teaching Team</Link>
          <Link to="/resources">Resources</Link>
          <Link to="/admin/login" className="admin-link">Admin</Link>
        </nav>
      </header>
      <main className="main-container">
        {loading ? (<p>Loading...</p>) : (
          <>
            <div style={{display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap'}}>
              <div className="course-selector">
                <label style={{marginRight: '10px'}}>Select Course: </label>
                <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={{padding: '8px', fontSize: '16px'}}>
                  {courses.map(course => (<option key={course._id} value={course._id}>{course.courseCode} - {course.courseTitle}</option>))}
                </select>
              </div>
              <div>
                <label style={{marginRight: '10px'}}>Filter by Category: </label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{padding: '8px', fontSize: '16px'}}>
                  {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
                </select>
              </div>
            </div>
            <section className="resources-section">
              <h2>Course Resources</h2>
              {filteredResources.length === 0 ? (<p className="empty-message">No resources available in this category.</p>) : (
                <div className="courses-grid">
                  {filteredResources.map(resource => (
                    <div key={resource._id} className="course-card">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>{resource.icon && `${resource.icon} `}{resource.title}</h3>
                        {resource.isPremium && <span className="badge badge-warning">Premium</span>}
                      </div>
                      <p style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>{resource.category}</p>
                      <p>{resource.description}</p>
                      {(resource.author || resource.publisher || resource.year) && (
                        <p style={{fontSize: '14px', color: '#666', marginTop: '10px'}}>
                          {resource.author && `Author: ${resource.author}`}
                          {resource.publisher && ` | Publisher: ${resource.publisher}`}
                          {resource.year && ` | Year: ${resource.year}`}
                        </p>
                      )}
                      {resource.tags && resource.tags.length > 0 && (
                        <div style={{marginTop: '10px'}}>
                          {resource.tags.map((tag, i) => (
                            <span key={i} style={{display: 'inline-block', background: '#e3f2fd', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginRight: '5px', marginBottom: '5px'}}>{tag}</span>
                          ))}
                        </div>
                      )}
                      <div style={{marginTop: '15px'}}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{display: 'inline-block', padding: '10px 20px', background: '#667eea', color: 'white', textDecoration: 'none', borderRadius: '4px'}}>
                          View Resource 
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      <footer className="site-footer"><p>&copy; 2026 Educational Platform. All rights reserved.</p></footer>
    </div>
  );
};

export default ResourcesPage;
