import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI } from '../../services/api';
import './PublicPages.css';

const HomePage = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const res = await courseAPI.getAll();
      setCourses(res.data.data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <div className="container">
          <h1>📚 Educational Platform</h1>
          <nav className="main-nav">
            <Link to="/">Home</Link>
            <Link to="/curriculum">Curriculum</Link>
            <Link to="/assignments">Assignments</Link>
            <Link to="/tutorials">Tutorials</Link>
            <Link to="/exams">Exams</Link>
            <Link to="/prerequisites">Prerequisites</Link>
            <Link to="/teaching-team">Teaching Team</Link>
            <Link to="/resources">Resources</Link>
            <a href="/admin/login" className="admin-link">Admin Login</a>
          </nav>
        </div>
      </header>

      <main className="container">
        <section className="hero">
          <h2>Welcome to Our Course Platform</h2>
          <p>A comprehensive educational platform for managing and accessing course materials.</p>
        </section>

        <section className="courses-section">
          <h2>Available Courses</h2>
          <div className="course-grid">
            {courses.length === 0 ? (
              <p>No courses available yet.</p>
            ) : (
              courses.map(course => (
                <div key={course._id} className="course-card">
                  <h3>{course.courseCode}</h3>
                  <h4>{course.courseTitle}</h4>
                  <p>{course.description?.substring(0, 100)}...</p>
                  <div className="course-meta">
                    <span>👤 {course.instructor?.name}</span>
                    <span>📅 {course.semester}</span>
                  </div>
                  <Link to="/curriculum" className="btn">View Curriculum</Link>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="container">
          <p>© 2026 Educational Platform. Built with ❤️ for educators and students.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
