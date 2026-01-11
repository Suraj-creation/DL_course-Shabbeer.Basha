import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public Pages
import HomePage from './pages/public/HomePage';
import CurriculumPage from './pages/public/CurriculumPage';
import AssignmentsPage from './pages/public/AssignmentsPage';
import TeachingTeamPage from './pages/public/TeachingTeamPage';
import ResourcesPage from './pages/public/ResourcesPage';
import TutorialsPage from './pages/public/TutorialsPage';
import ExamsPage from './pages/public/ExamsPage';
import PrerequisitesPage from './pages/public/PrerequisitesPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLayout from './components/AdminLayout';
import CourseManager from './pages/admin/CourseManager';
import LectureManager from './pages/admin/LectureManager';
import AssignmentManager from './pages/admin/AssignmentManager';
import TAManager from './pages/admin/TAManager';
import TutorialManager from './pages/admin/TutorialManager';
import PrerequisiteManager from './pages/admin/PrerequisiteManager';
import ExamManager from './pages/admin/ExamManager';
import ResourceManager from './pages/admin/ResourceManager';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/admin/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/curriculum" element={<CurriculumPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/exams" element={<ExamsPage />} />
          <Route path="/prerequisites" element={<PrerequisitesPage />} />
          <Route path="/teaching-team" element={<TeachingTeamPage />} />
          <Route path="/resources" element={<ResourcesPage />} />

          {/* Admin Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<CourseManager />} />
            <Route path="lectures" element={<LectureManager />} />
            <Route path="assignments" element={<AssignmentManager />} />
            <Route path="teaching-assistants" element={<TAManager />} />
            <Route path="tutorials" element={<TutorialManager />} />
            <Route path="prerequisites" element={<PrerequisiteManager />} />
            <Route path="exams" element={<ExamManager />} />
            <Route path="resources" element={<ResourceManager />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
