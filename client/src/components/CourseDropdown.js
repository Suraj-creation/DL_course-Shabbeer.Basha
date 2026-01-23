import React, { useState, useEffect, useRef } from 'react';
import { FaBook, FaChevronDown, FaCheck } from 'react-icons/fa';
import './CourseDropdown.css';

/**
 * Custom Course Dropdown Component
 * A reusable, styled dropdown for selecting courses across all pages
 * 
 * @param {Array} courses - Array of course objects with _id, courseCode, courseTitle
 * @param {String} selectedCourse - Currently selected course ID
 * @param {Function} onSelect - Callback function when course is selected
 * @param {Object} icon - Optional custom icon component for the label
 * @param {String} label - Optional custom label text (default: "Select Course:")
 * @param {String} accentColor - Optional accent color (default: "#667eea")
 */
const CourseDropdown = ({ 
  courses, 
  selectedCourse, 
  onSelect, 
  icon: CustomIcon,
  label = "Select Course:",
  accentColor = "#667eea"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const selectedCourseData = courses.find(c => c._id === selectedCourse);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);
  
  const handleSelect = (courseId) => {
    onSelect(courseId);
    setIsOpen(false);
  };
  
  const IconComponent = CustomIcon || FaBook;
  
  return (
    <div className="course-dropdown-container" ref={dropdownRef}>
      <div className="dropdown-label-group">
        <div 
          className="dropdown-icon-wrapper"
          style={{ background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustColor(accentColor, -20)} 100%)` }}
        >
          <IconComponent />
        </div>
        <span className="dropdown-label-text">{label}</span>
      </div>
      
      <div className="custom-course-dropdown">
        <button 
          className={`dropdown-trigger-btn ${isOpen ? 'open' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          style={{ 
            background: `linear-gradient(135deg, ${accentColor} 0%, ${adjustColor(accentColor, -30)} 100%)`,
            boxShadow: `0 4px 15px ${accentColor}4D`
          }}
        >
          <div className="selected-course-info">
            {selectedCourseData ? (
              <>
                <span className="course-code-tag">{selectedCourseData.courseCode}</span>
                <span className="course-separator">•</span>
                <span className="course-name">{selectedCourseData.courseTitle}</span>
              </>
            ) : (
              <span className="placeholder">Select a course...</span>
            )}
          </div>
          <FaChevronDown className={`dropdown-arrow ${isOpen ? 'rotated' : ''}`} />
        </button>
        
        {isOpen && (
          <div className="dropdown-options-menu" role="listbox">
            {courses.map(course => (
              <button
                key={course._id}
                className={`dropdown-option ${course._id === selectedCourse ? 'selected' : ''}`}
                onClick={() => handleSelect(course._id)}
                role="option"
                aria-selected={course._id === selectedCourse}
              >
                <div className="option-content">
                  <span 
                    className="option-code"
                    style={{ 
                      color: accentColor,
                      background: `${accentColor}15`
                    }}
                  >
                    {course.courseCode}
                  </span>
                  <span className="option-title">{course.courseTitle}</span>
                </div>
                {course._id === selectedCourse && (
                  <FaCheck className="selected-indicator" style={{ color: accentColor }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to adjust color brightness
function adjustColor(color, amount) {
  // Convert hex to RGB
  let hex = color.replace('#', '');
  if (hex.length === 3) {
    hex = hex.split('').map(c => c + c).join('');
  }
  
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export default CourseDropdown;
