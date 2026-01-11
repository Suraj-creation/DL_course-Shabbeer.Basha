import React, { useState, useEffect } from 'react';
import { examAPI, courseAPI, lectureAPI } from '../../services/api';
import './ManagerPage.css';

const ExamManager = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course: '', examType: 'Midterm', title: '', date: '', time: { start: '', end: '' },
    location: '', duration: '', totalMarks: '', format: '', syllabus: [''],
    coveredLectures: [], guidelines: [''], preparationResources: [{ title: '', url: '' }]
  });

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) { loadExams(); loadLectures(); } }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const response = await courseAPI.getAll();
      setCourses(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const loadLectures = async () => {
    if (!selectedCourse) return;
    try {
      const response = await lectureAPI.getByCourse(selectedCourse);
      setLectures(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const loadExams = async () => {
    if (!selectedCourse) return;
    try {
      const response = await examAPI.getByCourse(selectedCourse);
      setExams(response.data.data || []);
    } catch (error) { console.error('Error:', error); }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('time.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, time: { ...prev.time, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].map((item, i) => i === index ? value : item) }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }));
  };

  const handleResourceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      preparationResources: prev.preparationResources.map((item, i) => i === index ? { ...item, [field]: value } : item)
    }));
  };

  const addResource = () => {
    setFormData(prev => ({ ...prev, preparationResources: [...prev.preparationResources, { title: '', url: '' }] }));
  };

  const removeResource = (index) => {
    setFormData(prev => ({ ...prev, preparationResources: prev.preparationResources.filter((_, i) => i !== index) }));
  };

  const handleLectureToggle = (lectureId) => {
    setFormData(prev => ({
      ...prev,
      coveredLectures: prev.coveredLectures.includes(lectureId)
        ? prev.coveredLectures.filter(id => id !== lectureId)
        : [...prev.coveredLectures, lectureId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        course: selectedCourse,
        syllabus: formData.syllabus.filter(s => s.trim()),
        guidelines: formData.guidelines.filter(g => g.trim()),
        preparationResources: formData.preparationResources.filter(r => r.title.trim())
      };
      if (editingId) {
        await examAPI.update(editingId, dataToSubmit);
        alert('Exam updated successfully!');
      } else {
        await examAPI.create(dataToSubmit);
        alert('Exam created successfully!');
      }
      resetForm();
      loadExams();
    } catch (error) { console.error('Error:', error); alert('Failed to save exam'); }
  };

  const handleEdit = (exam) => {
    setFormData({
      course: exam.course?._id || exam.course || '',
      examType: exam.examType || 'Midterm',
      title: exam.title || '',
      date: exam.date ? exam.date.split('T')[0] : '',
      time: { start: exam.time?.start || '', end: exam.time?.end || '' },
      location: exam.location || '',
      duration: exam.duration || '',
      totalMarks: exam.totalMarks || '',
      format: exam.format || '',
      syllabus: exam.syllabus?.length ? exam.syllabus : [''],
      coveredLectures: exam.coveredLectures?.map(l => l._id || l) || [],
      guidelines: exam.guidelines?.length ? exam.guidelines : [''],
      preparationResources: exam.preparationResources?.length ? exam.preparationResources : [{ title: '', url: '' }]
    });
    setEditingId(exam._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await examAPI.delete(id);
        alert('Deleted!');
        loadExams();
      } catch (error) { alert('Failed'); }
    }
  };

  const resetForm = () => {
    setFormData({
      course: '', examType: 'Midterm', title: '', date: '', time: { start: '', end: '' },
      location: '', duration: '', totalMarks: '', format: '', syllabus: [''],
      coveredLectures: [], guidelines: [''], preparationResources: [{ title: '', url: '' }]
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="manager-page">
      <div className="page-header">
        <h2> Exam Manager</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} disabled={!selectedCourse}>
          {showForm ? ' Cancel' : ' Add New Exam'}
        </button>
      </div>

      <div className="course-selector">
        <label>Select Course:</label>
        <select value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)}>
          <option value="">-- Choose a course --</option>
          {courses.map(course => (<option key={course._id} value={course._id}>{course.courseCode} - {course.courseTitle}</option>))}
        </select>
      </div>

      {showForm && (
        <div className="form-card">
          <h3>{editingId ? 'Edit Exam' : 'Create New Exam'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Exam Type *</label>
                <select name="examType" value={formData.examType} onChange={handleInputChange}>
                  <option value="Midterm">Midterm</option>
                  <option value="End-Semester">End-Semester</option>
                  <option value="Quiz">Quiz</option>
                  <option value="Final">Final</option>
                </select>
              </div>
              <div className="form-group">
                <label>Title *</label>
                <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date *</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Start Time *</label>
                <input type="time" name="time.start" value={formData.time.start} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>End Time *</label>
                <input type="time" name="time.end" value={formData.time.end} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Location *</label>
                <input type="text" name="location" value={formData.location} onChange={handleInputChange} required />
              </div>
              <div className="form-group">
                <label>Duration</label>
                <input type="text" name="duration" value={formData.duration} onChange={handleInputChange} placeholder="e.g., 3 hours" />
              </div>
              <div className="form-group">
                <label>Total Marks *</label>
                <input type="number" name="totalMarks" value={formData.totalMarks} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="form-group">
              <label>Format</label>
              <input type="text" name="format" value={formData.format} onChange={handleInputChange} placeholder="e.g., Written, Online, MCQ" />
            </div>

            <div className="form-group">
              <label>Syllabus Topics</label>
              {formData.syllabus.map((topic, index) => (
                <div key={index} className="array-item">
                  <input type="text" value={topic} onChange={(e) => handleArrayChange('syllabus', index, e.target.value)} placeholder={`Topic ${index + 1}`} />
                  {formData.syllabus.length > 1 && (<button type="button" onClick={() => removeArrayItem('syllabus', index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('syllabus')} className="btn-secondary">+ Add Topic</button>
            </div>

            <div className="form-group">
              <label>Covered Lectures</label>
              <div className="checkbox-group">
                {lectures.map(lecture => (
                  <label key={lecture._id} className="checkbox-label">
                    <input type="checkbox" checked={formData.coveredLectures.includes(lecture._id)} onChange={() => handleLectureToggle(lecture._id)} />
                    Lecture {lecture.lectureNumber}: {lecture.title}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Guidelines</label>
              {formData.guidelines.map((guideline, index) => (
                <div key={index} className="array-item">
                  <input type="text" value={guideline} onChange={(e) => handleArrayChange('guidelines', index, e.target.value)} placeholder={`Guideline ${index + 1}`} />
                  {formData.guidelines.length > 1 && (<button type="button" onClick={() => removeArrayItem('guidelines', index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('guidelines')} className="btn-secondary">+ Add Guideline</button>
            </div>

            <div className="form-group">
              <label>Preparation Resources</label>
              {formData.preparationResources.map((resource, index) => (
                <div key={index} className="nested-item">
                  <input type="text" value={resource.title} onChange={(e) => handleResourceChange(index, 'title', e.target.value)} placeholder="Resource title" />
                  <input type="url" value={resource.url} onChange={(e) => handleResourceChange(index, 'url', e.target.value)} placeholder="https://..." />
                  {formData.preparationResources.length > 1 && (<button type="button" onClick={() => removeResource(index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={addResource} className="btn-secondary">+ Add Resource</button>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update Exam' : 'Create Exam'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {selectedCourse && (
        <div className="list-card">
          <h3>Exams ({exams.length})</h3>
          {exams.length === 0 ? (
            <p className="empty-message">No exams yet. Create your first exam!</p>
          ) : (
            <table>
              <thead><tr><th>Type</th><th>Title</th><th>Date</th><th>Time</th><th>Location</th><th>Marks</th><th>Actions</th></tr></thead>
              <tbody>
                {exams.map(exam => (
                  <tr key={exam._id}>
                    <td><span className="badge badge-warning">{exam.examType}</span></td>
                    <td><strong>{exam.title}</strong></td>
                    <td>{new Date(exam.date).toLocaleDateString()}</td>
                    <td>{exam.time?.start} - {exam.time?.end}</td>
                    <td>{exam.location}</td>
                    <td>{exam.totalMarks}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(exam)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(exam._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default ExamManager;
