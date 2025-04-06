import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiBell, FiUser, FiSearch, FiPlus } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';

const Header = ({ title, onNewList }) => {
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const notificationsRef = useRef(null);
  const userMenuRef = useRef(null);

  // סגירת התפריטים כאשר לוחצים מחוץ להם
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800">{title || 'דף הבית'}</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* חיפוש */}
          <div className="hidden md:flex relative ml-4">
            <input
              type="text"
              placeholder="חיפוש..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-primary focus:ring-opacity-50 focus:border-primary transition-colors outline-none"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
          </div>

          {/* כפתור הוספת רשימה חדשה */}
          {onNewList && (
            <Button
              onClick={onNewList}
              variant="primary"
              size="sm"
              icon={<FiPlus />}
              className="md:flex hidden"
            >
              רשימה חדשה
            </Button>
          )}

          {/* התראות */}
          <div className="relative" ref={notificationsRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-full hover:bg-gray-100 relative"
            >
              <FiBell className="text-gray-600" />
              <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs text-white bg-error rounded-full">
                2
              </span>
            </button>

            {showNotifications && (
              <div className="absolute left-0 mt-2 w-72 bg-white rounded-large shadow-dropdown py-2 z-10">
                <div className="px-4 py-2 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">התראות</h3>
                </div>

                <div className="max-h-96 overflow-y-auto">
                  <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-700">משתמש אחר שיתף איתך רשימת קניות: רשימה משפחתית</p>
                    <p className="text-xs text-gray-500 mt-1">לפני שעתיים</p>
                  </div>
                  <div className="p-4 hover:bg-gray-50 cursor-pointer">
                    <p className="text-sm text-gray-700">ברוך הבא למערכת רשימות הקניות!</p>
                    <p className="text-xs text-gray-500 mt-1">אתמול</p>
                  </div>
                </div>

                <div className="px-4 py-2 border-t border-gray-100">
                  <Link to="/notifications" className="text-sm text-primary hover:text-primary-dark">
                    הצג את כל ההתראות
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* תפריט משתמש */}
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center"
            >
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white overflow-hidden">
                {currentUser?.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  <FiUser />
                )}
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute left-0 mt-2 w-48 bg-white rounded-large shadow-dropdown py-2 z-10">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  הפרופיל שלי
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  onClick={() => setShowUserMenu(false)}
                >
                  הגדרות
                </Link>
                <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    // קריאה לפונקציית התנתקות
                  }}
                  className="block w-full text-right px-4 py-2 text-gray-700 hover:bg-gray-100"
                >
                  התנתק
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;