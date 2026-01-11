import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, assignmentAPI } from '../../services/api';
import './PublicPages.css';

const AssignmentsPage = () => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadAssignments(); }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const loadAssignments = async () => {
    try {
      const response = await assignmentAPI.getByCourse(selectedCourse);
      setAssignments(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Active': return 'badge-success';
      case 'Graded': return 'badge-success';
      case 'Past Due': return 'badge-danger';
      default: return 'badge-warning';
    }
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>Assignments</h1>
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
            <section className="assignments-section">
              <h2>Course Assignments</h2>
              {assignments.length === 0 ? (<p className="empty-message">No assignments available yet.</p>) : (
                <div className="assignments-list">
                  {assignments.map(assignment => (
                    <div key={assignment._id} className="course-card" style={{marginBottom: '20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>Assignment {assignment.assignmentNumber}: {assignment.title}</h3>
                        <span className={`badge ${getStatusClass(assignment.status)}`}>{assignment.status}</span>
                      </div>
                      <p>{assignment.description}</p>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', marginTop: '10px'}}>
                        <div><strong> Release:</strong> {new Date(assignment.releaseDate).toLocaleDateString()}</div>
                        <div><strong> Due:</strong> {new Date(assignment.dueDate).toLocaleDateString()}</div>
                        <div><strong> Points:</strong> {assignment.totalPoints}</div>
                        {assignment.submissionFormat && (<div><strong> Format:</strong> {assignment.submissionFormat}</div>)}
                      </div>
                      {assignment.learningObjectives && assignment.learningObjectives.length > 0 && (
                        <div><strong>Learning Objectives:</strong><ul>{assignment.learningObjectives.map((obj, i) => (<li key={i}>{obj}</li>))}</ul></div>
                      )}
                      {assignment.requirements && assignment.requirements.length > 0 && (
                        <div><strong>Requirements:</strong><ul>{assignment.requirements.map((req, i) => (<li key={i}>{req}</li>))}</ul></div>
                      )}
                      {assignment.rubric && assignment.rubric.length > 0 && (
                        <div style={{marginTop: '15px'}}><strong>Grading Rubric:</strong>
                          <table style={{width: '100%', marginTop: '10px', borderCollapse: 'collapse'}}>
                            <thead><tr><th style={{border: '1px solid #ddd', padding: '8px'}}>Criteria</th><th style={{border: '1px solid #ddd', padding: '8px'}}>Points</th><th style={{border: '1px solid #ddd', padding: '8px'}}>Description</th></tr></thead>
                            <tbody>{assignment.rubric.map((item, i) => (<tr key={i}><td style={{border: '1px solid #ddd', padding: '8px'}}>{item.criteria}</td><td style={{border: '1px solid #ddd', padding: '8px'}}>{item.points}</td><td style={{border: '1px solid #ddd', padding: '8px'}}>{item.description}</td></tr>))}</tbody>
                          </table>
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
};

export default AssignmentsPage;
