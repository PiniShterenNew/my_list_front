import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiList, FiUser, FiSettings, FiLogOut, FiMenu, FiX } from 'react-icons/fi';

const Sidebar = () => {
  const { currentUser, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const handleLogout = () => {
    logout();
  };

  const NavItem = ({ to, icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 transition-colors ${
          isActive
            ? 'bg-primary-light bg-opacity-20 text-primary-dark'
            : 'text-gray-700 hover:bg-gray-100'
        } rounded-normal my-1`
      }
      onClick={() => setIsMobileOpen(false)}
    >
      <span className="text-xl">{icon}</span>
      {!isCollapsed && <span className="mr-3">{label}</span>}
    </NavLink>
  );

  // תוכן הסייד-בר
  const sidebarContent = (
    <>
      <div className="flex items-center justify-between p-4">
        {!isCollapsed && (
          <div className="flex items-center">
            <img src="/logo.png" alt="לוגו" className="h-8 w-8" />
            <h1 className="text-lg font-bold text-primary mr-2">רשימות קניות</h1>
          </div>
        )}
        
        {/* כפתור קיפול לדסקטופ */}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-200 lg:block hidden"
        >
          {isCollapsed ? <FiMenu /> : <FiX />}
        </button>
        
        {/* כפתור סגירה למובייל */}
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-full hover:bg-gray-200 lg:hidden"
        >
          <FiX />
        </button>
      </div>

      <div className="p-4">
        <NavItem to="/" icon={<FiHome />} label="דף הבית" />
        <NavItem to="/lists" icon={<FiList />} label="רשימות שלי" />
        <NavItem to="/profile" icon={<FiUser />} label="פרופיל" />
        <NavItem to="/settings" icon={<FiSettings />} label="הגדרות" />
        
        <hr className="my-4 border-gray-200" />
        
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-normal my-1 transition-colors"
        >
          <span className="text-xl"><FiLogOut /></span>
          {!isCollapsed && <span className="mr-3">התנתק</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* סרגל צד למובייל */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMobileSidebar}
      ></div>

      <aside
        className={`fixed top-0 bottom-0 right-0 bg-white z-50 transition-all duration-300 lg:hidden w-64 shadow-lg ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* סרגל צד לדסקטופ */}
      <aside
        className={`hidden lg:flex flex-col sticky top-0 h-screen bg-white border-l border-gray-200 transition-all duration-300 ${
          isCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* כפתור פתיחת תפריט למובייל */}
      <button
        onClick={toggleMobileSidebar}
        className="fixed bottom-4 left-4 lg:hidden bg-primary text-white p-3 rounded-full shadow-lg z-30"
      >
        <FiMenu />
      </button>
    </>
  );
};

export default Sidebar;