import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, taAPI } from '../../services/api';
import './PublicPages.css';

const TeachingTeamPage = () => {
  const [courses, setCourses] = useState([]);
  const [tas, setTas] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadTAs(); }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const loadTAs = async () => {
    try {
      const response = await taAPI.getByCourse(selectedCourse);
      setTas(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>Teaching Team</h1>
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

            {/* Display Course Instructor */}
            {courses.find(c => c._id === selectedCourse) && (
              <section style={{marginBottom: '30px'}}>
                <h2>Course Instructor</h2>
                <div className="course-card">
                  <h3>{courses.find(c => c._id === selectedCourse).instructor?.name || 'N/A'}</h3>
                  <p><strong>Email:</strong> {courses.find(c => c._id === selectedCourse).instructor?.email}</p>
                  {courses.find(c => c._id === selectedCourse).instructor?.office && (
                    <p><strong>Office:</strong> {courses.find(c => c._id === selectedCourse).instructor?.office}</p>
                  )}
                  {courses.find(c => c._id === selectedCourse).instructor?.officeHours && (
                    <p><strong>Office Hours:</strong> {courses.find(c => c._id === selectedCourse).instructor?.officeHours}</p>
                  )}
                </div>
              </section>
            )}

            <section className="tas-section">
              <h2>Teaching Assistants</h2>
              {tas.length === 0 ? (<p className="empty-message">No teaching assistants listed yet.</p>) : (
                <div className="courses-grid">
                  {tas.map(ta => (
                    <div key={ta._id} className="course-card">
                      {ta.photoUrl && (<img src={ta.photoUrl} alt={`${ta.firstName} ${ta.lastName}`} style={{width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', marginBottom: '10px'}} />)}
                      <h3>{ta.firstName} {ta.lastName}</h3>
                      <p><strong>Email:</strong> <a href={`mailto:${ta.email}`}>{ta.email}</a></p>
                      {ta.lab && (<p><strong>Lab:</strong> {ta.lab}</p>)}
                      {ta.officeHours && (<p><strong>Office Hours:</strong> {ta.officeHours}</p>)}
                      {ta.availableDays && ta.availableDays.length > 0 && (
                        <p><strong>Available Days:</strong> {ta.availableDays.join(', ')}</p>
                      )}
                      {ta.responsibilities && ta.responsibilities.length > 0 && (
                        <div><strong>Responsibilities:</strong><ul>{ta.responsibilities.map((resp, i) => (<li key={i}>{resp}</li>))}</ul></div>
                      )}
                      {ta.contactPreference && (<p><strong>Preferred Contact:</strong> {ta.contactPreference}</p>)}
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

export default TeachingTeamPage;
