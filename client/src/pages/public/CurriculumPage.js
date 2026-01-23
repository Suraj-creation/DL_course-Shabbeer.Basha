import React, { useState, useEffect } from 'react';
import { courseAPI, lectureAPI } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CourseDropdown from '../../components/CourseDropdown';
import { FaPlay, FaFileAlt, FaBook, FaExternalLinkAlt } from 'react-icons/fa';
import './PublicPages.css';

const CurriculumPage = () => {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadLectures();
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

  const loadLectures = async () => {
    try {
      const response = await lectureAPI.getByCourse(selectedCourse);
      setLectures(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  return (
    <div className="public-page">
      <Header userRole="student" />
      
      <main className="main-container">
        <div className="page-title-section">
          <h1>📖 Course Curriculum</h1>
          <p>Browse through all lectures, videos, and learning materials</p>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading curriculum...</span>
          </div>
        ) : (
          <>
            <CourseDropdown 
              courses={courses}
              selectedCourse={selectedCourse}
              onSelect={setSelectedCourse}
              icon={FaBook}
              label="Select Course:"
              accentColor="#3b82f6"
            />

            <section className="lectures-section">
              {lectures.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon">📚</div>
                  <h3>No Lectures Available</h3>
                  <p>Lectures will appear here once published.</p>
                </div>
              ) : (
                <div className="lectures-list">
                  {lectures.map(lecture => (
                    <div key={lecture._id} className="content-card">
                      <div className="content-card-header">
                        <h3>Lecture {lecture.lectureNumber}: {lecture.title}</h3>
                        {lecture.isPublished && <span className="badge badge-success">Published</span>}
                      </div>
                      
                      {lecture.date && (
                        <p style={{ color: '#7f8c8d', marginBottom: '12px' }}>
                          📅 {new Date(lecture.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      )}
                      
                      {lecture.description && <p>{lecture.description}</p>}
                      
                      {lecture.topicsCovered && lecture.topicsCovered.length > 0 && (
                        <div className="links-section">
                          <h4>📌 Topics Covered</h4>
                          <ul className="content-list">
                            {lecture.topicsCovered.map((topic, i) => <li key={i}>{topic}</li>)}
                          </ul>
                        </div>
                      )}
                      
                      {lecture.videos && lecture.videos.length > 0 && (
                        <div className="links-section">
                          <h4><FaPlay /> Video Lectures</h4>
                          <ul>
                            {lecture.videos.map((video, i) => (
                              <li key={i}>
                                <a href={video.url} target="_blank" rel="noopener noreferrer">
                                  {video.title} {video.duration && `(${video.duration})`} <FaExternalLinkAlt size={10} />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {lecture.slides && lecture.slides.length > 0 && (
                        <div className="links-section">
                          <h4><FaFileAlt /> Slides & Materials</h4>
                          <ul>
                            {lecture.slides.map((slide, i) => (
                              <li key={i}>
                                <a href={slide.url} target="_blank" rel="noopener noreferrer">
                                  {slide.title} <FaExternalLinkAlt size={10} />
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {lecture.readingMaterials && lecture.readingMaterials.length > 0 && (
                        <div className="links-section">
                          <h4><FaBook /> Reading Materials</h4>
                          <ul>
                            {lecture.readingMaterials.map((reading, i) => (
                              <li key={i}>
                                {reading.title}{reading.author && ` - ${reading.author}`}
                                {reading.url && (
                                  <a href={reading.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px' }}>
                                    <FaExternalLinkAlt size={10} />
                                  </a>
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
      
      <Footer />
    </div>
  );
};

export default CurriculumPage;
