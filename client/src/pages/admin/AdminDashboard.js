import React, { useState, useEffect } from 'react';
import { courseAPI, lectureAPI, assignmentAPI, tutorialAPI, examAPI, resourceAPI } from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    courses: 0,
    lectures: 0,
    assignments: 0,
    tutorials: 0,
    exams: 0,
    resources: 0
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const coursesRes = await courseAPI.getAll();
      const courses = coursesRes.data.data || [];
      
      let totalLectures = 0;
      let totalAssignments = 0;
      let totalTutorials = 0;
      let totalExams = 0;
      let totalResources = 0;
      let allLectures = [];
      
      // Load stats for all courses
      for (const course of courses) {
        try {
          const [lecturesRes, assignmentsRes, tutorialsRes, examsRes, resourcesRes] = await Promise.all([
            lectureAPI.getByCourse(course._id),
            assignmentAPI.getByCourse(course._id),
            tutorialAPI.getByCourse(course._id),
            examAPI.getByCourse(course._id),
            resourceAPI.getByCourse(course._id)
          ]);
          
          totalLectures += lecturesRes.data.count || lecturesRes.data.data?.length || 0;
          totalAssignments += assignmentsRes.data.count || assignmentsRes.data.data?.length || 0;
          totalTutorials += tutorialsRes.data.count || tutorialsRes.data.data?.length || 0;
          totalExams += examsRes.data.count || examsRes.data.data?.length || 0;
          totalResources += resourcesRes.data.count || resourcesRes.data.data?.length || 0;
          
          if (lecturesRes.data.data) {
            allLectures = [...allLectures, ...lecturesRes.data.data];
          }
        } catch (err) {
          console.error('Error loading stats for course:', course._id, err);
        }
      }
      
      setStats({
        courses: courses.length,
        lectures: totalLectures,
        assignments: totalAssignments,
        tutorials: totalTutorials,
        exams: totalExams,
        resources: totalResources
      });
      
      // Set recent lectures
      setRecentItems(allLectures.slice(0, 5));
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
          <div className="stat-icon">📖</div>
          <div className="stat-content">
            <h3>{stats.tutorials}</h3>
            <p>Tutorials</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.exams}</h3>
            <p>Exams</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>{stats.resources}</h3>
            <p>Resources</p>
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
          <button className="action-btn" onClick={() => window.location.href = '/admin/tutorials'}>
            📚 Add Tutorial
          </button>
        </div>
      </div>

      {recentItems.length > 0 && (
        <div className="recent-activity">
          <h2>Recent Lectures</h2>
          <ul>
            {recentItems.map((item, index) => (
              <li key={item._id || index}>
                <strong>Lecture {item.lectureNumber}:</strong> {item.title}
                <span className={`status-badge ${item.isPublished ? 'published' : 'draft'}`}>
                  {item.isPublished ? '✅ Published' : '📝 Draft'}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
