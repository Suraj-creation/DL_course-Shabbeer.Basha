import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, examAPI } from '../../services/api';
import './PublicPages.css';

function ExamsPage() {
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadExams();
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

  const loadExams = async () => {
    try {
      const response = await examAPI.getByCourse(selectedCourse);
      setExams(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const getExamTypeBadge = (type) => {
    const colors = {
      'Midterm': 'badge-warning',
      'End-Semester': 'badge-danger',
      'Quiz': 'badge-success',
      'Final': 'badge-danger'
    };
    return colors[type] || 'badge-secondary';
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>📝 Examinations</h1>
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
            <section className="exams-section">
              {exams.length === 0 ? (<p className="empty-message">No exams scheduled for this course.</p>) : (
                <div className="courses-grid">
                  {exams.map(exam => (
                    <div key={exam._id} className="course-card">
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>{exam.title}</h3>
                        <span className={`badge ${getExamTypeBadge(exam.examType)}`}>{exam.examType}</span>
                      </div>
                      
                      <div style={{marginTop: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px'}}>
                        {exam.date && (
                          <div>
                            <strong>📅 Date:</strong> {new Date(exam.date).toLocaleDateString()}
                          </div>
                        )}
                        {exam.time && (
                          <div>
                            <strong>🕐 Time:</strong> {exam.time.start} - {exam.time.end}
                          </div>
                        )}
                        {exam.location && (
                          <div>
                            <strong>📍 Location:</strong> {exam.location}
                          </div>
                        )}
                        {exam.duration && (
                          <div>
                            <strong>⏱️ Duration:</strong> {exam.duration}
                          </div>
                        )}
                        {exam.totalMarks && (
                          <div>
                            <strong>💯 Total Marks:</strong> {exam.totalMarks}
                          </div>
                        )}
                        {exam.format && (
                          <div>
                            <strong>📋 Format:</strong> {exam.format}
                          </div>
                        )}
                      </div>
                      
                      {exam.syllabus && exam.syllabus.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>📚 Syllabus:</h4>
                          <ul>
                            {exam.syllabus.map((topic, i) => <li key={i}>{topic}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {exam.guidelines && exam.guidelines.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>ℹ️ Guidelines:</h4>
                          <ul>
                            {exam.guidelines.map((guideline, i) => <li key={i}>{guideline}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {exam.preparationResources && exam.preparationResources.length > 0 && (
                        <div style={{marginTop: '15px'}}>
                          <h4>📖 Preparation Resources:</h4>
                          <ul>
                            {exam.preparationResources.map((resource, i) => (
                              <li key={i}>
                                <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title}</a>
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

export default ExamsPage;
