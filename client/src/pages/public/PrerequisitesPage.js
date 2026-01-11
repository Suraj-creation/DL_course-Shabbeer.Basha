import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, prerequisiteAPI } from '../../services/api';
import './PublicPages.css';

function PrerequisitesPage() {
  const [courses, setCourses] = useState([]);
  const [prerequisites, setPrerequisites] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadPrerequisites();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const loadPrerequisites = async () => {
    try {
      const response = await prerequisiteAPI.getByCourse(selectedCourse);
      setPrerequisites(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const getLevelBadge = (level) => {
    const colors = {
      'Beginner': 'badge-success',
      'Intermediate': 'badge-warning',
      'Advanced': 'badge-danger'
    };
    return colors[level] || 'badge-secondary';
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>📋 Prerequisites</h1>
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
            <div className="course-selector" style={{marginBottom: '20px'}}>
              <label style={{marginRight: '10px'}}>Select Course: </label>
              <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} style={{padding: '8px', fontSize: '16px'}}>
                {courses.map(course => (<option key={course._id} value={course._id}>{course.courseCode} - {course.courseTitle}</option>))}
              </select>
            </div>
            <section className="prerequisites-section">
              {prerequisites.length === 0 ? (<p className="empty-message">No prerequisites defined for this course.</p>) : (
                <div className="courses-grid">
                  {prerequisites.map(prereq => (
                    <div key={prereq._id} className="course-card">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>{prereq.title}</h3>
                        {prereq.level && <span className={`badge ${getLevelBadge(prereq.level)}`}>{prereq.level}</span>}
                      </div>
                      
                      {prereq.courseCode && (
                        <p style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>
                          <strong>Course Code:</strong> {prereq.courseCode}
                        </p>
                      )}
                      
                      {prereq.description && (
                        <p style={{marginTop: '10px'}}>{prereq.description}</p>
                      )}
                      
                      {prereq.estimatedDuration && (
                        <p style={{marginTop: '10px'}}>
                          <strong>⏱️ Estimated Duration:</strong> {prereq.estimatedDuration}
                        </p>
                      )}
                      
                      {prereq.resources && prereq.resources.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>📚 Learning Resources:</h4>
                          <ul>
                            {prereq.resources.map((resource, i) => (
                              <li key={i}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                  {resource.title}
                                </a>
                                {resource.type && (
                                  <span style={{marginLeft: '8px', fontSize: '12px', color: '#666'}}>
                                    ({resource.type})
                                  </span>
                                )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
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
}

export default PrerequisitesPage;
