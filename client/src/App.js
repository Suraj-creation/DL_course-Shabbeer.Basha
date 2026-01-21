import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ErrorBoundary';

// Public Pages
import HomePage from './pages/public/HomePage';
import LecturesPage from './pages/public/LecturesPage';
import AssignmentsPage from './pages/public/AssignmentsPage';
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
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes - Each wrapped in ErrorBoundary for isolation */}
            <Route path="/" element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            } />
            <Route path="/lectures" element={
              <ErrorBoundary>
                <LecturesPage />
              </ErrorBoundary>
            } />
            {/* Redirect old curriculum route to lectures */}
            <Route path="/curriculum" element={<Navigate to="/lectures" replace />} />
            <Route path="/assignments" element={
              <ErrorBoundary>
                <AssignmentsPage />
              </ErrorBoundary>
            } />
            <Route path="/tutorials" element={
              <ErrorBoundary>
                <TutorialsPage />
              </ErrorBoundary>
            } />
            <Route path="/exams" element={
              <ErrorBoundary>
                <ExamsPage />
              </ErrorBoundary>
            } />
            <Route path="/prerequisites" element={
              <ErrorBoundary>
                <PrerequisitesPage />
              </ErrorBoundary>
            } />
            <Route path="/resources" element={
              <ErrorBoundary>
                <ResourcesPage />
              </ErrorBoundary>
            } />

            {/* Admin Login */}
            <Route path="/admin/login" element={
              <ErrorBoundary>
                <AdminLogin />
              </ErrorBoundary>
            } />

            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <AdminLayout />
                  </ErrorBoundary>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="courses" element={<CourseManager />} />
              <Route path="lectures" element={<LectureManager />} />
              <Route path="assignments" element={<AssignmentManager />} />
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
    </ErrorBoundary>
  );
}

export default App;
