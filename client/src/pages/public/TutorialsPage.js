import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, tutorialAPI } from '../../services/api';
import './PublicPages.css';

function TutorialsPage() {
  const [courses, setCourses] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadTutorials();
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

  const loadTutorials = async () => {
    try {
      const response = await tutorialAPI.getByCourse(selectedCourse);
      setTutorials(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>📚 Tutorials</h1>
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
            <section className="tutorials-section">
              {tutorials.length === 0 ? (<p className="empty-message">No tutorials available for this course.</p>) : (
                <div className="courses-grid">
                  {tutorials.map(tutorial => (
                    <div key={tutorial._id} className="course-card">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>Tutorial {tutorial.tutorialNumber}: {tutorial.title}</h3>
                        {tutorial.isPublished && <span className="badge badge-success">Published</span>}
                      </div>
                      {tutorial.date && <p style={{fontSize: '14px', color: '#666'}}><strong>Date:</strong> {new Date(tutorial.date).toLocaleDateString()}</p>}
                      {tutorial.instructor && <p><strong>Instructor:</strong> {tutorial.instructor}</p>}
                      
                      {tutorial.topicsCovered && tutorial.topicsCovered.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>Topics Covered:</h4>
                          <ul>{tutorial.topicsCovered.map((topic, i) => <li key={i}>{topic}</li>)}</ul>
                        </div>
                      )}
                      
                      {tutorial.whyItMatters && (
                        <div style={{marginTop: '15px', padding: '10px', background: '#f0f7ff', borderRadius: '4px'}}>
                          <h4>💡 Why It Matters:</h4>
                          <p>{tutorial.whyItMatters}</p>
                        </div>
                      )}
                      
                      {tutorial.videos && tutorial.videos.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>🎥 Videos ({tutorial.videos.length}):</h4>
                          <ul>
                            {tutorial.videos.map((video, i) => (
                              <li key={i}>
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                  {video.title} {video.duration && `(${video.duration})`} - {video.platform}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {tutorial.slides && tutorial.slides.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>📄 Slides ({tutorial.slides.length}):</h4>
                          <ul>
                            {tutorial.slides.map((slide, i) => (
                              <li key={i}>
                                <a href={slide.url} target="_blank" rel="noopener noreferrer">{slide.title}</a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {tutorial.practiceProblems && tutorial.practiceProblems.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>✏️ Practice Problems ({tutorial.practiceProblems.length}):</h4>
                          {tutorial.practiceProblems.map((problem, i) => (
                            <div key={i} style={{marginBottom: '10px', padding: '10px', background: '#f9f9f9', borderRadius: '4px'}}>
                              <strong>{problem.title}</strong> 
                              <span className={`badge ${problem.difficulty === 'Easy' ? 'badge-success' : problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-danger'}`} style={{marginLeft: '10px'}}>
                                {problem.difficulty}
                              </span>
                              <p style={{marginTop: '5px'}}>{problem.description}</p>
                            </div>
                          ))}
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

export default TutorialsPage;
