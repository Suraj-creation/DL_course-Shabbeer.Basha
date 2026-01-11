import React, { useState, useEffect } from 'react';
import { courseAPI, lectureAPI, assignmentAPI, taAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    lectures: 0,
    assignments: 0,
    tas: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [coursesRes] = await Promise.all([
        courseAPI.getAll()
      ]);
      
      setStats({
        courses: coursesRes.data.count || 0,
        lectures: 0, // Load from first course
        assignments: 0,
        tas: 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">📊 Dashboard</h1>
      <p className="dashboard-subtitle">Welcome to your course management system</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📚</div>
          <div className="stat-content">
            <h3>{stats.courses}</h3>
            <p>Courses</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎓</div>
          <div className="stat-content">
            <h3>{stats.lectures}</h3>
            <p>Lectures</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-content">
            <h3>{stats.assignments}</h3>
            <p>Assignments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.tas}</h3>
            <p>Teaching Assistants</p>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-grid">
          <button className="action-btn" onClick={() => window.location.href = '/admin/courses'}>
            ➕ Create New Course
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/lectures'}>
            📖 Add Lecture
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/assignments'}>
            📝 Create Assignment
          </button>
          <button className="action-btn" onClick={() => window.location.href = '/admin/teaching-assistants'}>
            👤 Add Teaching Assistant
          </button>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Getting Started</h2>
        <ul>
          <li>✅ Create your first course in the Courses section</li>
          <li>✅ Add lectures with slides and video links</li>
          <li>✅ Create assignments with due dates</li>
          <li>✅ Add teaching assistants and their contact information</li>
          <li>✅ Organize resources for students</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
