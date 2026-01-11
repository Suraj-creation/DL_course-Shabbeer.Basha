import React, { useState, useEffect } from 'react';
import { assignmentAPI, courseAPI, lectureAPI } from '../../services/api';
import './ManagerPage.css';

const AssignmentManager = () => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course: '', assignmentNumber: '', title: '', description: '', learningObjectives: [''],
    requirements: [''], relatedLectures: [], releaseDate: '', dueDate: '', totalPoints: '',
    status: 'Upcoming', submissionFormat: '', rubric: [{ criteria: '', points: '', description: '' }]
  });

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) { loadAssignments(); loadLectures(); } }, [selectedCourse]);

  const loadCourses = async () => { try { const response = await courseAPI.getAll(); setCourses(response.data.data || []); } catch (error) { console.error('Error:', error); } };
  const loadLectures = async () => { if (!selectedCourse) return; try { const response = await lectureAPI.getByCourse(selectedCourse); setLectures(response.data.data || []); } catch (error) { console.error('Error:', error); } };
  const loadAssignments = async () => { if (!selectedCourse) return; try { const response = await assignmentAPI.getByCourse(selectedCourse); setAssignments(response.data.data || []); } catch (error) { console.error('Error:', error); } };

  const handleInputChange = (e) => { const { name, value } = e.target; setFormData(prev => ({ ...prev, [name]: value })); };
  const handleArrayChange = (field, index, value) => { setFormData(prev => ({ ...prev, [field]: prev[field].map((item, i) => i === index ? value : item) })); };
  const addArrayItem = (field) => { setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] })); };
  const removeArrayItem = (field, index) => { setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) })); };

  const handleRubricChange = (index, field, value) => { setFormData(prev => ({ ...prev, rubric: prev.rubric.map((item, i) => i === index ? { ...item, [field]: value } : item) })); };
  const addRubricItem = () => { setFormData(prev => ({ ...prev, rubric: [...prev.rubric, { criteria: '', points: '', description: '' }] })); };
  const removeRubricItem = (index) => { setFormData(prev => ({ ...prev, rubric: prev.rubric.filter((_, i) => i !== index) })); };

  const handleLectureToggle = (lectureId) => { setFormData(prev => ({ ...prev, relatedLectures: prev.relatedLectures.includes(lectureId) ? prev.relatedLectures.filter(id => id !== lectureId) : [...prev.relatedLectures, lectureId] })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        course: selectedCourse,
        learningObjectives: formData.learningObjectives.filter(obj => obj.trim()),
        requirements: formData.requirements.filter(req => req.trim()),
        rubric: formData.rubric.filter(r => r.criteria.trim())
      };
      if (editingId) { await assignmentAPI.update(editingId, dataToSubmit); alert('Assignment updated!'); }
      else { await assignmentAPI.create(dataToSubmit); alert('Assignment created!'); }
      resetForm(); loadAssignments();
    } catch (error) { console.error('Error:', error); alert('Failed to save'); }
  };

  const handleEdit = (assignment) => {
    setFormData({
      course: assignment.course?._id || assignment.course || '', assignmentNumber: assignment.assignmentNumber || '',
      title: assignment.title || '', description: assignment.description || '',
      learningObjectives: assignment.learningObjectives?.length ? assignment.learningObjectives : [''],
      requirements: assignment.requirements?.length ? assignment.requirements : [''],
      relatedLectures: assignment.relatedLectures?.map(l => l._id || l) || [],
      releaseDate: assignment.releaseDate ? assignment.releaseDate.split('T')[0] : '',
      dueDate: assignment.dueDate ? assignment.dueDate.split('T')[0] : '',
      totalPoints: assignment.totalPoints || '', status: assignment.status || 'Upcoming',
      submissionFormat: assignment.submissionFormat || '',
      rubric: assignment.rubric?.length ? assignment.rubric : [{ criteria: '', points: '', description: '' }]
    });
    setEditingId(assignment._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => { if (window.confirm('Are you sure?')) { try { await assignmentAPI.delete(id); alert('Deleted!'); loadAssignments(); } catch (error) { alert('Failed'); } } };

  const resetForm = () => {
    setFormData({
      course: '', assignmentNumber: '', title: '', description: '', learningObjectives: [''],
      requirements: [''], relatedLectures: [], releaseDate: '', dueDate: '', totalPoints: '',
      status: 'Upcoming', submissionFormat: '', rubric: [{ criteria: '', points: '', description: '' }]
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="manager-page">
      <div className="page-header">
        <h2> Assignment Manager</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} disabled={!selectedCourse}>{showForm ? ' Cancel' : ' Add New Assignment'}</button>
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
          <h3>{editingId ? 'Edit Assignment' : 'Create New Assignment'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Assignment Number *</label><input type="number" name="assignmentNumber" value={formData.assignmentNumber} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></div>
            </div>
            <div className="form-group"><label>Description *</label><textarea name="description" value={formData.description} onChange={handleInputChange} rows="3" required /></div>
            <div className="form-group"><label>Learning Objectives</label>
              {formData.learningObjectives.map((obj, index) => (
                <div key={index} className="array-item">
                  <input type="text" value={obj} onChange={(e) => handleArrayChange('learningObjectives', index, e.target.value)} placeholder={`Objective ${index + 1}`} />
                  {formData.learningObjectives.length > 1 && (<button type="button" onClick={() => removeArrayItem('learningObjectives', index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('learningObjectives')} className="btn-secondary">+ Add Objective</button>
            </div>
            <div className="form-group"><label>Requirements</label>
              {formData.requirements.map((req, index) => (
                <div key={index} className="array-item">
                  <input type="text" value={req} onChange={(e) => handleArrayChange('requirements', index, e.target.value)} placeholder={`Requirement ${index + 1}`} />
                  {formData.requirements.length > 1 && (<button type="button" onClick={() => removeArrayItem('requirements', index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('requirements')} className="btn-secondary">+ Add Requirement</button>
            </div>
            <div className="form-group"><label>Related Lectures</label>
              <div className="checkbox-group">{lectures.map(lecture => (<label key={lecture._id} className="checkbox-label"><input type="checkbox" checked={formData.relatedLectures.includes(lecture._id)} onChange={() => handleLectureToggle(lecture._id)} />Lecture {lecture.lectureNumber}: {lecture.title}</label>))}</div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Release Date *</label><input type="date" name="releaseDate" value={formData.releaseDate} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Due Date *</label><input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Total Points *</label><input type="number" name="totalPoints" value={formData.totalPoints} onChange={handleInputChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Status</label>
                <select name="status" value={formData.status} onChange={handleInputChange}>
                  <option value="Upcoming">Upcoming</option><option value="Active">Active</option><option value="Graded">Graded</option>
                  <option value="Ungraded">Ungraded</option><option value="Past Due">Past Due</option>
                </select>
              </div>
              <div className="form-group"><label>Submission Format</label><input type="text" name="submissionFormat" value={formData.submissionFormat} onChange={handleInputChange} placeholder="e.g., PDF, Code" /></div>
            </div>
            <div className="form-group"><label>Grading Rubric</label>
              {formData.rubric.map((item, index) => (
                <div key={index} className="nested-item">
                  <input type="text" value={item.criteria} onChange={(e) => handleRubricChange(index, 'criteria', e.target.value)} placeholder="Criteria" />
                  <input type="number" value={item.points} onChange={(e) => handleRubricChange(index, 'points', e.target.value)} placeholder="Points" style={{width: '100px'}} />
                  <input type="text" value={item.description} onChange={(e) => handleRubricChange(index, 'description', e.target.value)} placeholder="Description" />
                  {formData.rubric.length > 1 && (<button type="button" onClick={() => removeRubricItem(index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={addRubricItem} className="btn-secondary">+ Add Rubric Item</button>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update Assignment' : 'Create Assignment'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {selectedCourse && (
        <div className="list-card">
          <h3>Assignments ({assignments.length})</h3>
          {assignments.length === 0 ? (<p className="empty-message">No assignments yet. Create your first assignment!</p>) : (
            <table><thead><tr><th>#</th><th>Title</th><th>Due Date</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {assignments.map(assignment => (
                  <tr key={assignment._id}>
                    <td><strong>{assignment.assignmentNumber}</strong></td>
                    <td>{assignment.title}</td>
                    <td>{new Date(assignment.dueDate).toLocaleDateString()}</td>
                    <td>{assignment.totalPoints}</td>
                    <td><span className={`badge ${
                      assignment.status === 'Active' ? 'badge-success' :
                      assignment.status === 'Graded' ? 'badge-success' :
                      assignment.status === 'Past Due' ? 'badge-danger' : 'badge-warning'
                    }`}>{assignment.status}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(assignment)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(assignment._id)}>Delete</button>
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

export default AssignmentManager;
