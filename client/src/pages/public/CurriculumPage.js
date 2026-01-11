import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { courseAPI, lectureAPI } from '../../services/api';
import './PublicPages.css';

const CurriculumPage = () => {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) loadLectures(); }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
      setLoading(false);
    } catch (error) { console.error('Error:', error); setLoading(false); }
  };

  const loadLectures = async () => {
    try {
      const response = await lectureAPI.getByCourse(selectedCourse);
      setLectures(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  return (
    <div className="public-page">
      <header className="site-header">
        <h1>Course Curriculum</h1>
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
            <section className="lectures-section">
              <h2>Lectures</h2>
              {lectures.length === 0 ? (<p className="empty-message">No lectures available yet.</p>) : (
                <div className="lectures-list">
                  {lectures.map(lecture => (
                    <div key={lecture._id} className="course-card" style={{marginBottom: '20px'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <h3>Lecture {lecture.lectureNumber}: {lecture.title}</h3>
                        {lecture.isPublished && <span className="badge badge-success">Published</span>}
                      </div>
                      {lecture.date && (<p> {new Date(lecture.date).toLocaleDateString()}</p>)}
                      {lecture.description && (<p>{lecture.description}</p>)}
                      {lecture.topicsCovered && lecture.topicsCovered.length > 0 && (
                        <div><strong>Topics:</strong><ul>{lecture.topicsCovered.map((topic, i) => (<li key={i}>{topic}</li>))}</ul></div>
                      )}
                      {lecture.videos && lecture.videos.length > 0 && (
                        <div><strong> Videos:</strong><ul>{lecture.videos.map((video, i) => (
                          <li key={i}><a href={video.url} target="_blank" rel="noopener noreferrer">{video.title} {video.duration && `(${video.duration})`}</a></li>
                        ))}</ul></div>
                      )}
                      {lecture.slides && lecture.slides.length > 0 && (
                        <div><strong> Slides:</strong><ul>{lecture.slides.map((slide, i) => (
                          <li key={i}><a href={slide.url} target="_blank" rel="noopener noreferrer">{slide.title}</a></li>
                        ))}</ul></div>
                      )}
                      {lecture.readingMaterials && lecture.readingMaterials.length > 0 && (
                        <div><strong> Readings:</strong><ul>{lecture.readingMaterials.map((reading, i) => (
                          <li key={i}>{reading.title}{reading.author && ` - ${reading.author}`}
                            {reading.url && (<> (<a href={reading.url} target="_blank" rel="noopener noreferrer">Link</a>)</>)}
                          </li>
                        ))}</ul></div>
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

export default CurriculumPage;
