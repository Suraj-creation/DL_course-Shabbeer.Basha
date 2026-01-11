import React, { useState, useEffect } from 'react';
import { tutorialAPI, courseAPI, lectureAPI } from '../../services/api';
import './ManagerPage.css';

const TutorialManager = () => {
  const [tutorials, setTutorials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [lectures, setLectures] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    course: '', tutorialNumber: '', title: '', date: '', instructor: '', topicsCovered: [''],
    coveredInLectures: [], whyItMatters: '', videos: [{ title: '', url: '', duration: '', platform: 'YouTube' }],
    slides: [{ title: '', url: '', fileName: '' }], practiceProblems: [{ title: '', description: '', difficulty: 'Easy' }], isPublished: true
  });

  useEffect(() => { loadCourses(); }, []);
  useEffect(() => { if (selectedCourse) { loadTutorials(); loadLectures(); } }, [selectedCourse]);

  const loadCourses = async () => { try { const response = await courseAPI.getAll(); setCourses(response.data.data || []); } catch (error) { console.error('Error:', error); } };
  const loadLectures = async () => { if (!selectedCourse) return; try { const response = await lectureAPI.getByCourse(selectedCourse); setLectures(response.data.data || []); } catch (error) { console.error('Error:', error); } };
  const loadTutorials = async () => { if (!selectedCourse) return; try { const response = await tutorialAPI.getByCourse(selectedCourse); setTutorials(response.data.data || []); } catch (error) { console.error('Error:', error); } };

  const handleInputChange = (e) => { const { name, value, type, checked } = e.target; setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value })); };
  const handleArrayChange = (field, index, value) => { setFormData(prev => ({ ...prev, [field]: prev[field].map((item, i) => i === index ? value : item) })); };
  const addArrayItem = (field) => { setFormData(prev => ({ ...prev, [field]: [...prev[field], ''] })); };
  const removeArrayItem = (field, index) => { setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) })); };

  const handleVideoChange = (index, field, value) => { setFormData(prev => ({ ...prev, videos: prev.videos.map((item, i) => i === index ? { ...item, [field]: value } : item) })); };
  const addVideo = () => { setFormData(prev => ({ ...prev, videos: [...prev.videos, { title: '', url: '', duration: '', platform: 'YouTube' }] })); };
  const removeVideo = (index) => { setFormData(prev => ({ ...prev, videos: prev.videos.filter((_, i) => i !== index) })); };

  const handleSlideChange = (index, field, value) => { setFormData(prev => ({ ...prev, slides: prev.slides.map((item, i) => i === index ? { ...item, [field]: value } : item) })); };
  const addSlide = () => { setFormData(prev => ({ ...prev, slides: [...prev.slides, { title: '', url: '', fileName: '' }] })); };
  const removeSlide = (index) => { setFormData(prev => ({ ...prev, slides: prev.slides.filter((_, i) => i !== index) })); };

  const handleProblemChange = (index, field, value) => { setFormData(prev => ({ ...prev, practiceProblems: prev.practiceProblems.map((item, i) => i === index ? { ...item, [field]: value } : item) })); };
  const addProblem = () => { setFormData(prev => ({ ...prev, practiceProblems: [...prev.practiceProblems, { title: '', description: '', difficulty: 'Easy' }] })); };
  const removeProblem = (index) => { setFormData(prev => ({ ...prev, practiceProblems: prev.practiceProblems.filter((_, i) => i !== index) })); };

  const handleLectureToggle = (lectureId) => { setFormData(prev => ({ ...prev, coveredInLectures: prev.coveredInLectures.includes(lectureId) ? prev.coveredInLectures.filter(id => id !== lectureId) : [...prev.coveredInLectures, lectureId] })); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        course: selectedCourse,
        topicsCovered: formData.topicsCovered.filter(t => t.trim()),
        videos: formData.videos.filter(v => v.title.trim()),
        slides: formData.slides.filter(s => s.title.trim()),
        practiceProblems: formData.practiceProblems.filter(p => p.title.trim())
      };
      if (editingId) { await tutorialAPI.update(editingId, dataToSubmit); alert('Tutorial updated!'); }
      else { await tutorialAPI.create(dataToSubmit); alert('Tutorial created!'); }
      resetForm(); loadTutorials();
    } catch (error) { console.error('Error:', error); alert('Failed to save'); }
  };

  const handleEdit = (tutorial) => {
    setFormData({
      course: tutorial.course?._id || tutorial.course || '', tutorialNumber: tutorial.tutorialNumber || '',
      title: tutorial.title || '', date: tutorial.date ? tutorial.date.split('T')[0] : '', instructor: tutorial.instructor || '',
      topicsCovered: tutorial.topicsCovered?.length ? tutorial.topicsCovered : [''],
      coveredInLectures: tutorial.coveredInLectures?.map(l => l._id || l) || [],
      whyItMatters: tutorial.whyItMatters || '',
      videos: tutorial.videos?.length ? tutorial.videos : [{ title: '', url: '', duration: '', platform: 'YouTube' }],
      slides: tutorial.slides?.length ? tutorial.slides : [{ title: '', url: '', fileName: '' }],
      practiceProblems: tutorial.practiceProblems?.length ? tutorial.practiceProblems : [{ title: '', description: '', difficulty: 'Easy' }],
      isPublished: tutorial.isPublished !== undefined ? tutorial.isPublished : true
    });
    setEditingId(tutorial._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => { if (window.confirm('Are you sure?')) { try { await tutorialAPI.delete(id); alert('Deleted!'); loadTutorials(); } catch (error) { alert('Failed'); } } };

  const resetForm = () => {
    setFormData({
      course: '', tutorialNumber: '', title: '', date: '', instructor: '', topicsCovered: [''],
      coveredInLectures: [], whyItMatters: '', videos: [{ title: '', url: '', duration: '', platform: 'YouTube' }],
      slides: [{ title: '', url: '', fileName: '' }], practiceProblems: [{ title: '', description: '', difficulty: 'Easy' }], isPublished: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="manager-page">
      <div className="page-header">
        <h2> Tutorial Manager</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)} disabled={!selectedCourse}>{showForm ? ' Cancel' : ' Add New Tutorial'}</button>
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
          <h3>{editingId ? 'Edit Tutorial' : 'Create New Tutorial'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group"><label>Tutorial Number *</label><input type="number" name="tutorialNumber" value={formData.tutorialNumber} onChange={handleInputChange} required /></div>
              <div className="form-group"><label>Title *</label><input type="text" name="title" value={formData.title} onChange={handleInputChange} required /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleInputChange} /></div>
              <div className="form-group"><label>Instructor</label><input type="text" name="instructor" value={formData.instructor} onChange={handleInputChange} /></div>
            </div>
            <div className="form-group"><label>Topics Covered</label>
              {formData.topicsCovered.map((topic, index) => (
                <div key={index} className="array-item">
                  <input type="text" value={topic} onChange={(e) => handleArrayChange('topicsCovered', index, e.target.value)} placeholder={`Topic ${index + 1}`} />
                  {formData.topicsCovered.length > 1 && (<button type="button" onClick={() => removeArrayItem('topicsCovered', index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={() => addArrayItem('topicsCovered')} className="btn-secondary">+ Add Topic</button>
            </div>
            <div className="form-group"><label>Covered in Lectures</label>
              <div className="checkbox-group">{lectures.map(lecture => (<label key={lecture._id} className="checkbox-label"><input type="checkbox" checked={formData.coveredInLectures.includes(lecture._id)} onChange={() => handleLectureToggle(lecture._id)} />Lecture {lecture.lectureNumber}: {lecture.title}</label>))}</div>
            </div>
            <div className="form-group"><label>Why It Matters</label><textarea name="whyItMatters" value={formData.whyItMatters} onChange={handleInputChange} rows="3" /></div>
            <div className="form-group"><label>Videos</label>
              {formData.videos.map((video, index) => (
                <div key={index} className="nested-item">
                  <input type="text" value={video.title} onChange={(e) => handleVideoChange(index, 'title', e.target.value)} placeholder="Title" />
                  <input type="url" value={video.url} onChange={(e) => handleVideoChange(index, 'url', e.target.value)} placeholder="https://..." />
                  <input type="text" value={video.duration} onChange={(e) => handleVideoChange(index, 'duration', e.target.value)} placeholder="Duration" style={{width: '100px'}} />
                  <select value={video.platform} onChange={(e) => handleVideoChange(index, 'platform', e.target.value)}><option value="YouTube">YouTube</option><option value="Vimeo">Vimeo</option><option value="Other">Other</option></select>
                  {formData.videos.length > 1 && (<button type="button" onClick={() => removeVideo(index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={addVideo} className="btn-secondary">+ Add Video</button>
            </div>
            <div className="form-group"><label>Slides</label>
              {formData.slides.map((slide, index) => (
                <div key={index} className="nested-item">
                  <input type="text" value={slide.title} onChange={(e) => handleSlideChange(index, 'title', e.target.value)} placeholder="Title" />
                  <input type="url" value={slide.url} onChange={(e) => handleSlideChange(index, 'url', e.target.value)} placeholder="https://..." />
                  {formData.slides.length > 1 && (<button type="button" onClick={() => removeSlide(index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={addSlide} className="btn-secondary">+ Add Slides</button>
            </div>
            <div className="form-group"><label>Practice Problems</label>
              {formData.practiceProblems.map((problem, index) => (
                <div key={index} className="nested-item">
                  <input type="text" value={problem.title} onChange={(e) => handleProblemChange(index, 'title', e.target.value)} placeholder="Title" />
                  <input type="text" value={problem.description} onChange={(e) => handleProblemChange(index, 'description', e.target.value)} placeholder="Description" />
                  <select value={problem.difficulty} onChange={(e) => handleProblemChange(index, 'difficulty', e.target.value)}><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
                  {formData.practiceProblems.length > 1 && (<button type="button" onClick={() => removeProblem(index)} className="btn-remove"></button>)}
                </div>
              ))}
              <button type="button" onClick={addProblem} className="btn-secondary">+ Add Problem</button>
            </div>
            <div className="form-group"><label className="checkbox-label"><input type="checkbox" name="isPublished" checked={formData.isPublished} onChange={handleInputChange} />Publish immediately</label></div>
            <div className="form-actions">
              <button type="submit" className="btn-primary">{editingId ? 'Update Tutorial' : 'Create Tutorial'}</button>
              <button type="button" className="btn-secondary" onClick={resetForm}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {selectedCourse && (
        <div className="list-card">
          <h3>Tutorials ({tutorials.length})</h3>
          {tutorials.length === 0 ? (<p className="empty-message">No tutorials yet. Create your first tutorial!</p>) : (
            <table><thead><tr><th>#</th><th>Title</th><th>Date</th><th>Videos</th><th>Problems</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {tutorials.map(tutorial => (
                  <tr key={tutorial._id}>
                    <td><strong>{tutorial.tutorialNumber}</strong></td>
                    <td>{tutorial.title}</td>
                    <td>{tutorial.date ? new Date(tutorial.date).toLocaleDateString() : 'N/A'}</td>
                    <td>{tutorial.videos?.length || 0}</td>
                    <td>{tutorial.practiceProblems?.length || 0}</td>
                    <td><span className={`badge ${tutorial.isPublished ? 'badge-success' : 'badge-warning'}`}>{tutorial.isPublished ? 'Published' : 'Draft'}</span></td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(tutorial)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(tutorial._id)}>Delete</button>
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

export default TutorialManager;
