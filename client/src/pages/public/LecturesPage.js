import React, { useState, useEffect, useCallback } from 'react';
import { courseAPI, lectureAPI } from '../../services/api';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { FaPlay, FaFileAlt, FaBook, FaExternalLinkAlt, FaClock, FaCalendarAlt, FaListUl, FaTimes, FaExpand, FaCompress, FaChevronLeft, FaChevronRight, FaDownload, FaGlobe, FaExclamationTriangle, FaSync } from 'react-icons/fa';
import './PublicPages.css';

// Utility function to convert Google Slides URL to embed URL
const getEmbedUrl = (url) => {
  if (!url) return null;
  
  // Google Slides
  if (url.includes('docs.google.com/presentation')) {
    // Convert edit URL to embed URL
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://docs.google.com/presentation/d/${match[1]}/embed?start=false&loop=false&delayms=3000`;
    }
  }
  
  // Google Docs
  if (url.includes('docs.google.com/document')) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://docs.google.com/document/d/${match[1]}/preview`;
    }
  }
  
  // Google Drive files (PDFs, etc.)
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://drive.google.com/file/d/${match[1]}/preview`;
    }
  }
  
  // Direct PDF URLs
  if (url.endsWith('.pdf') || url.includes('.pdf?')) {
    return url;
  }
  
  // YouTube videos
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?]+)/);
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId[1]}?rel=0&modestbranding=1`;
    }
  }
  
  // For other URLs, return as-is (might work with iframe)
  return url;
};

// Get download URL for Google Drive files
const getDownloadUrl = (url) => {
  if (!url) return null;
  
  // Google Drive files
  if (url.includes('drive.google.com')) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/) || url.match(/id=([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`;
    }
  }
  
  // Google Slides - export as PDF
  if (url.includes('docs.google.com/presentation')) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://docs.google.com/presentation/d/${match[1]}/export/pdf`;
    }
  }
  
  // Google Docs - export as PDF
  if (url.includes('docs.google.com/document')) {
    const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      return `https://docs.google.com/document/d/${match[1]}/export?format=pdf`;
    }
  }
  
  // Direct file URLs
  if (url.endsWith('.pdf') || url.endsWith('.pptx') || url.endsWith('.docx') || url.endsWith('.zip')) {
    return url;
  }
  
  return null;
};

// Determine the type of content
const getContentType = (url) => {
  if (!url) return 'unknown';
  if (url.includes('docs.google.com/presentation') || url.includes('slides')) return 'slides';
  if (url.includes('docs.google.com/document')) return 'document';
  if (url.includes('drive.google.com') || url.endsWith('.pdf') || url.includes('.pdf?')) return 'pdf';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'video';
  // Check for common website patterns
  if (url.startsWith('http://') || url.startsWith('https://')) return 'website';
  return 'other';
};

// Check if URL can be embedded
const canEmbed = (url) => {
  if (!url) return false;
  // These can typically be embedded
  if (url.includes('docs.google.com')) return true;
  if (url.includes('drive.google.com')) return true;
  if (url.includes('youtube.com') || url.includes('youtu.be')) return true;
  if (url.endsWith('.pdf') || url.includes('.pdf?')) return true;
  // Many websites block embedding via X-Frame-Options
  return false;
};

// Content Viewer Component
const ContentViewer = ({ content, onClose, allContent, currentIndex, onNavigate }) => {
  const [isFullscreen, setIsFullscreen] = useState(true); // Start in fullscreen by default
  const [isLoading, setIsLoading] = useState(true);
  const [embedError, setEmbedError] = useState(false);
  
  const embedUrl = getEmbedUrl(content?.url);
  const downloadUrl = getDownloadUrl(content?.url);
  const contentType = getContentType(content?.url);
  const isEmbeddable = canEmbed(content?.url);
  
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowLeft' && currentIndex > 0) onNavigate(currentIndex - 1);
    if (e.key === 'ArrowRight' && currentIndex < allContent.length - 1) onNavigate(currentIndex + 1);
  }, [onClose, currentIndex, allContent.length, onNavigate]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    setEmbedError(false);
    setIsLoading(true);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [handleKeyDown, content]);

  const handleIframeError = () => {
    setEmbedError(true);
    setIsLoading(false);
  };

  return (
    <div className={`content-viewer-overlay ${isFullscreen ? 'fullscreen' : ''}`}>
      <div className="content-viewer-container">
        {/* Header */}
        <div className="viewer-header">
          <div className="viewer-title">
            <span className={`content-type-badge ${contentType}`}>
              {contentType === 'slides' && '📊 Slides'}
              {contentType === 'pdf' && '📄 PDF'}
              {contentType === 'video' && '🎬 Video'}
              {contentType === 'document' && '📝 Document'}
              {contentType === 'website' && '🌐 Website'}
              {contentType === 'other' && '📎 Content'}
            </span>
            <h3>{content?.title || 'Untitled'}</h3>
          </div>
          <div className="viewer-controls">
            {allContent.length > 1 && (
              <span className="nav-indicator">
                {currentIndex + 1} / {allContent.length}
              </span>
            )}
            {/* Download Button - only show for downloadable content */}
            {downloadUrl && (
              <a 
                href={downloadUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="viewer-btn download-btn"
                title="Download"
                download
              >
                <FaDownload />
              </a>
            )}
            <a 
              href={content?.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="viewer-btn"
              title="Open in new tab"
            >
              <FaExternalLinkAlt />
            </a>
            <button 
              className="viewer-btn"
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <FaCompress /> : <FaExpand />}
            </button>
            <button className="viewer-btn close-btn" onClick={onClose} title="Close">
              <FaTimes />
            </button>
          </div>
        </div>
        
        {/* Content Area */}
        <div className="viewer-content">
          {/* Navigation Arrows */}
          {allContent.length > 1 && currentIndex > 0 && (
            <button 
              className="nav-arrow prev"
              onClick={() => onNavigate(currentIndex - 1)}
              title="Previous"
            >
              <FaChevronLeft />
            </button>
          )}
          
          {isLoading && !embedError && (
            <div className="viewer-loading">
              <div className="loading-spinner"></div>
              <p>Loading content...</p>
            </div>
          )}
          
          {embedError || !isEmbeddable ? (
            <div className="viewer-error">
              <FaGlobe style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.6 }} />
              <p style={{ fontSize: '1.1rem', marginBottom: '8px' }}>
                {contentType === 'website' 
                  ? 'This website cannot be embedded directly due to security restrictions.'
                  : 'Unable to embed this content.'}
              </p>
              <p style={{ fontSize: '0.9rem', opacity: 0.7, marginBottom: '20px' }}>
                Click the button below to view it in a new tab.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                <a href={content?.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <FaExternalLinkAlt /> Open in New Tab
                </a>
                {downloadUrl && (
                  <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="btn-secondary" download>
                    <FaDownload /> Download
                  </a>
                )}
              </div>
            </div>
          ) : embedUrl ? (
            <iframe
              src={embedUrl}
              title={content?.title || 'Content Viewer'}
              className={`content-iframe ${contentType === 'video' ? 'video-iframe' : ''}`}
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              onLoad={() => setIsLoading(false)}
              onError={handleIframeError}
              style={{ opacity: isLoading ? 0 : 1 }}
            />
          ) : (
            <div className="viewer-error">
              <p>Unable to embed this content.</p>
              <a href={content?.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <FaExternalLinkAlt /> Open in New Tab
              </a>
            </div>
          )}
          
          {allContent.length > 1 && currentIndex < allContent.length - 1 && (
            <button 
              className="nav-arrow next"
              onClick={() => onNavigate(currentIndex + 1)}
              title="Next"
            >
              <FaChevronRight />
            </button>
          )}
        </div>
        
        {/* Footer with thumbnails */}
        {allContent.length > 1 && (
          <div className="viewer-thumbnails">
            {allContent.map((item, idx) => (
              <button
                key={idx}
                className={`thumbnail-btn ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => onNavigate(idx)}
              >
                <span className="thumb-icon">
                  {getContentType(item.url) === 'slides' && '📊'}
                  {getContentType(item.url) === 'pdf' && '📄'}
                  {getContentType(item.url) === 'video' && '🎬'}
                  {getContentType(item.url) === 'document' && '📝'}
                  {getContentType(item.url) === 'website' && '🌐'}
                  {getContentType(item.url) === 'other' && '📎'}
                </span>
                <span className="thumb-title">{item.title?.substring(0, 15) || `Item ${idx + 1}`}...</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const LecturesPage = () => {
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [loading, setLoading] = useState(true);
  const [lecturesLoading, setLecturesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lecturesError, setLecturesError] = useState(null);
  const [expandedLecture, setExpandedLecture] = useState(null);
  
  // Viewer state
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerContent, setViewerContent] = useState(null);
  const [allViewerContent, setAllViewerContent] = useState([]);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => {
    if (selectedCourse) loadLectures();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await courseAPI.getAll();
      const coursesData = response.data.data || [];
      setCourses(coursesData);
      if (coursesData.length > 0) setSelectedCourse(coursesData[0]._id);
    } catch (err) { 
      console.error('Error loading courses:', err);
      setError(err.response?.data?.message || 'Unable to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadLectures = async () => {
    try {
      setLecturesLoading(true);
      setLecturesError(null);
      const response = await lectureAPI.getByCourse(selectedCourse);
      setLectures(response.data.data || []);
    } catch (err) { 
      console.error('Error loading lectures:', err);
      setLecturesError(err.response?.data?.message || 'Unable to load lectures. Please try again.');
    } finally {
      setLecturesLoading(false);
    }
  };

  const handleRetry = () => {
    if (error) {
      loadCourses();
    } else if (lecturesError) {
      loadLectures();
    }
  };

  const toggleLecture = (lectureId) => {
    setExpandedLecture(expandedLecture === lectureId ? null : lectureId);
  };

  // Open content viewer
  const openViewer = (content, allContent, index) => {
    setViewerContent(content);
    setAllViewerContent(allContent);
    setCurrentContentIndex(index);
    setViewerOpen(true);
  };

  // Navigate within viewer
  const navigateViewer = (index) => {
    setCurrentContentIndex(index);
    setViewerContent(allViewerContent[index]);
  };

  // Close viewer
  const closeViewer = () => {
    setViewerOpen(false);
    setViewerContent(null);
    setAllViewerContent([]);
    setCurrentContentIndex(0);
  };

  return (
    <div className="public-page">
      <Header userRole="student" />
      
      <main className="main-container">
        <div className="page-header-enhanced">
          <div className="page-header-content">
            <span className="page-badge">Course Content</span>
            <h1>Lectures</h1>
            <p>Browse through all lectures, videos, slides and learning materials</p>
          </div>
          <div className="page-header-stats">
            <div className="stat-pill">
              <FaListUl />
              <span>{lectures.length} Lectures</span>
            </div>
            <div className="stat-pill">
              <FaClock />
              <span>{lectures.filter(l => l.videos?.length > 0).length} Video Sessions</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <span className="loading-text">Loading lectures...</span>
          </div>
        ) : error ? (
          <div className="error-state-enhanced">
            <div className="error-icon-wrapper">
              <FaExclamationTriangle className="error-icon" />
            </div>
            <h3>Unable to Load Content</h3>
            <p>{error}</p>
            <button onClick={handleRetry} className="retry-btn">
              <FaSync /> Try Again
            </button>
          </div>
        ) : (
          <>
            <div className="course-selector-enhanced">
              <div className="selector-label">
                <FaBook className="selector-icon" />
                <span>Select Course</span>
              </div>
              <select 
                value={selectedCourse} 
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="course-select"
              >
                {courses.map(course => (
                  <option key={course._id} value={course._id}>
                    {course.courseCode} - {course.courseTitle}
                  </option>
                ))}
              </select>
            </div>

            <section className="lectures-section">
              {lecturesLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <span className="loading-text">Loading lectures...</span>
                </div>
              ) : lecturesError ? (
                <div className="error-state-enhanced">
                  <div className="error-icon-wrapper">
                    <FaExclamationTriangle className="error-icon" />
                  </div>
                  <h3>Unable to Load Lectures</h3>
                  <p>{lecturesError}</p>
                  <button onClick={handleRetry} className="retry-btn">
                    <FaSync /> Try Again
                  </button>
                </div>
              ) : lectures.length === 0 ? (
                <div className="empty-state-enhanced">
                  <div className="empty-icon-wrapper">
                    <FaBook className="empty-icon" />
                  </div>
                  <h3>No Lectures Available</h3>
                  <p>Lectures will appear here once published by the instructor.</p>
                </div>
              ) : (
                <div className="lectures-list-enhanced">
                  {lectures.map((lecture, index) => (
                    <div 
                      key={lecture._id} 
                      className={`lecture-card-enhanced ${expandedLecture === lecture._id ? 'expanded' : ''}`}
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <div 
                        className="lecture-card-header"
                        onClick={() => toggleLecture(lecture._id)}
                      >
                        <div className="lecture-number-badge">
                          {lecture.lectureNumber}
                        </div>
                        <div className="lecture-main-info">
                          <h3>{lecture.title}</h3>
                          {lecture.date && (
                            <span className="lecture-date">
                              <FaCalendarAlt />
                              {new Date(lecture.date).toLocaleDateString('en-US', { 
                                weekday: 'short', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          )}
                        </div>
                        <div className="lecture-meta-badges">
                          {lecture.videos?.length > 0 && (
                            <span className="meta-badge video">
                              <FaPlay /> {lecture.videos.length}
                            </span>
                          )}
                          {lecture.slides?.length > 0 && (
                            <span className="meta-badge slides">
                              <FaFileAlt /> {lecture.slides.length}
                            </span>
                          )}
                          {lecture.isPublished && (
                            <span className="status-badge published">Published</span>
                          )}
                        </div>
                        <button className="expand-btn">
                          <span className={`expand-icon ${expandedLecture === lecture._id ? 'rotated' : ''}`}>
                            ▼
                          </span>
                        </button>
                      </div>
                      
                      <div className={`lecture-card-body ${expandedLecture === lecture._id ? 'show' : ''}`}>
                        {lecture.description && (
                          <p className="lecture-description">{lecture.description}</p>
                        )}
                        
                        {lecture.topicsCovered && lecture.topicsCovered.length > 0 && (
                          <div className="lecture-section">
                            <h4><FaListUl /> Topics Covered</h4>
                            <ul className="topics-list">
                              {lecture.topicsCovered.map((topic, i) => (
                                <li key={i}>{topic}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        <div className="lecture-resources-grid">
                          {lecture.videos && lecture.videos.length > 0 && (
                            <div className="resource-card videos">
                              <h4><FaPlay /> Video Lectures</h4>
                              <ul>
                                {lecture.videos.map((video, i) => (
                                  <li key={i}>
                                    <button
                                      className="resource-btn"
                                      onClick={() => openViewer(video, lecture.videos, i)}
                                    >
                                      <span className="resource-title">{video.title}</span>
                                      {video.duration && <span className="resource-meta">{video.duration}</span>}
                                      <span className="view-badge">View</span>
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {lecture.slides && lecture.slides.length > 0 && (
                            <div className="resource-card slides">
                              <h4><FaFileAlt /> Slides & Materials</h4>
                              <ul>
                                {lecture.slides.map((slide, i) => (
                                  <li key={i}>
                                    <div className="resource-btn-group">
                                      <button
                                        className="resource-btn"
                                        onClick={() => openViewer(slide, lecture.slides, i)}
                                      >
                                        <span className="resource-title">{slide.title}</span>
                                        <span className="view-badge">View</span>
                                      </button>
                                      {getDownloadUrl(slide.url) && (
                                        <a 
                                          href={getDownloadUrl(slide.url)} 
                                          target="_blank" 
                                          rel="noopener noreferrer"
                                          className="download-badge"
                                          title="Download"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <FaDownload />
                                        </a>
                                      )}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          {lecture.readingMaterials && lecture.readingMaterials.length > 0 && (
                            <div className="resource-card readings">
                              <h4><FaBook /> Reading Materials</h4>
                              <ul>
                                {lecture.readingMaterials.map((reading, i) => (
                                  <li key={i}>
                                    {reading.url ? (
                                      // Reading materials: directly open in new browser tab
                                      // External websites often block iframe embedding
                                      canEmbed(reading.url) ? (
                                        <button
                                          className="resource-btn"
                                          onClick={() => openViewer(reading, lecture.readingMaterials.filter(r => r.url && canEmbed(r.url)), lecture.readingMaterials.filter(r => r.url && canEmbed(r.url)).findIndex(r => r.url === reading.url))}
                                        >
                                          <span className="resource-title">
                                            {reading.title}
                                            {reading.author && <span className="resource-author"> — {reading.author}</span>}
                                          </span>
                                          <span className="view-badge">View</span>
                                        </button>
                                      ) : (
                                        <a
                                          href={reading.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="resource-btn resource-external-link"
                                        >
                                          <span className="resource-title">
                                            {reading.title}
                                            {reading.author && <span className="resource-author"> — {reading.author}</span>}
                                          </span>
                                          <span className="view-badge external"><FaExternalLinkAlt /> Open</span>
                                        </a>
                                      )
                                    ) : (
                                      <span className="resource-title">
                                        {reading.title}
                                        {reading.author && <span className="resource-author"> — {reading.author}</span>}
                                      </span>
                                    )}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </main>
      
      {/* Content Viewer Modal */}
      {viewerOpen && viewerContent && (
        <ContentViewer
          content={viewerContent}
          onClose={closeViewer}
          allContent={allViewerContent}
          currentIndex={currentContentIndex}
          onNavigate={navigateViewer}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default LecturesPage;
