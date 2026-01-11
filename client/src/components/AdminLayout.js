import React from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FaHome, FaBook, FaGraduationCap, FaTasks, FaUsers, 
  FaBookReader, FaClipboardList, FaFileAlt, FaBoxOpen, 
  FaSignOutAlt 
} from 'react-icons/fa';
import './AdminLayout.css';

const AdminLayout = () => {
  const { admin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin', icon: <FaHome />, label: 'Dashboard', exact: true },
    { path: '/admin/courses', icon: <FaBook />, label: 'Courses' },
    { path: '/admin/lectures', icon: <FaGraduationCap />, label: 'Lectures' },
    { path: '/admin/assignments', icon: <FaTasks />, label: 'Assignments' },
    { path: '/admin/teaching-assistants', icon: <FaUsers />, label: 'Teaching Assistants' },
    { path: '/admin/tutorials', icon: <FaBookReader />, label: 'Tutorials' },
    { path: '/admin/prerequisites', icon: <FaClipboardList />, label: 'Prerequisites' },
    { path: '/admin/exams', icon: <FaFileAlt />, label: 'Exams' },
    { path: '/admin/resources', icon: <FaBoxOpen />, label: 'Resources' },
  ];

  const isActive = (path, exact) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <h2>📚 Admin Panel</h2>
          <p className="admin-name">{admin?.name}</p>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path, item.exact) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
