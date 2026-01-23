import React, { useState, useEffect } from 'react';
import { FaEnvelope, FaMapMarkerAlt, FaClock, FaUserTie, FaUsers, FaGraduationCap } from 'react-icons/fa';
import { courseAPI, taAPI } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import CourseDropdown from '../../components/CourseDropdown';
import './PublicPages.css';

const TeachingTeamPage = () => {
  const [courses, setCourses] = useState([]);
  const [tas, setTas] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadTAs();
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

  const loadTAs = async () => {
    try {
      const response = await taAPI.getByCourse(selectedCourse);
      setTas(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const currentCourse = courses.find(c => c._id === selectedCourse);

  return (
    <div className="public-page">
      <Header userRole="student" />
      <main className="main-container">
        <section className="hero">
          <h1><FaUsers /> Teaching Team</h1>
          <p>Meet our dedicated instructors and teaching assistants who are here to help you succeed.</p>
        </section>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading teaching team...</p>
          </div>
        ) : (
          <>
            <CourseDropdown 
              courses={courses}
              selectedCourse={selectedCourse}
              onSelect={setSelectedCourse}
              icon={FaGraduationCap}
              label="Select Course:"
              accentColor="#10b981"
            />

            {/* Display Course Instructor */}
            {currentCourse && currentCourse.instructor && (
              <section className="instructor-section">
                <h2><FaUserTie /> Course Instructor</h2>
                <div className="content-card instructor-card">
                  <div className="instructor-info">
                    <div className="instructor-avatar">
                      {currentCourse.instructor.name?.charAt(0) || 'I'}
                    </div>
                    <div className="instructor-details">
                      <h3>{currentCourse.instructor.name || 'N/A'}</h3>
                      <div className="info-grid">
                        {currentCourse.instructor.email && (
                          <div className="info-item">
                            <FaEnvelope />
                            <a href={`mailto:${currentCourse.instructor.email}`}>
                              {currentCourse.instructor.email}
                            </a>
                          </div>
                        )}
                        {currentCourse.instructor.office && (
                          <div className="info-item">
                            <FaMapMarkerAlt />
                            <span>{currentCourse.instructor.office}</span>
                          </div>
                        )}
                        {currentCourse.instructor.officeHours && (
                          <div className="info-item">
                            <FaClock />
                            <span>{currentCourse.instructor.officeHours}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="tas-section">
              <h2><FaUsers /> Teaching Assistants</h2>
              {tas.length === 0 ? (
                <div className="empty-state">
                  <FaUsers size={48} />
                  <h3>No Teaching Assistants Listed</h3>
                  <p>Teaching assistants for this course will be announced soon.</p>
                </div>
              ) : (
                <div className="ta-grid">
                  {tas.map(ta => (
                    <div key={ta._id} className="content-card ta-card">
                      {ta.photoUrl ? (
                        <img 
                          src={ta.photoUrl} 
                          alt={`${ta.firstName} ${ta.lastName}`} 
                          className="ta-photo"
                        />
                      ) : (
                        <div className="ta-avatar">
                          {ta.firstName?.charAt(0)}{ta.lastName?.charAt(0)}
                        </div>
                      )}
                      <h3>{ta.firstName} {ta.lastName}</h3>
                      
                      <div className="ta-info">
                        <p className="ta-email">
                          <FaEnvelope />
                          <a href={`mailto:${ta.email}`}>{ta.email}</a>
                        </p>
                        {ta.lab && (
                          <p><FaMapMarkerAlt /> <strong>Lab:</strong> {ta.lab}</p>
                        )}
                        {ta.officeHours && (
                          <p><FaClock /> <strong>Office Hours:</strong> {ta.officeHours}</p>
                        )}
                        {ta.availableDays && ta.availableDays.length > 0 && (
                          <p><strong>Available:</strong> {ta.availableDays.join(', ')}</p>
                        )}
                      </div>
                      
                      {ta.responsibilities && ta.responsibilities.length > 0 && (
                        <div className="ta-responsibilities">
                          <h4>Responsibilities:</h4>
                          <ul>
                            {ta.responsibilities.map((resp, i) => (
                              <li key={i}>{resp}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {ta.contactPreference && (
                        <p className="contact-preference">
                          <span className="badge badge-info">{ta.contactPreference}</span>
                        </p>
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

export default TeachingTeamPage;
