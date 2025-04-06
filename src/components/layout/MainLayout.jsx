import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CreateListModal from '../lists/CreateListModal';
import { listAPI } from '../../services/api';

const MainLayout = () => {
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // הפונקציה שמקבלת את הכותרת הנוכחית לפי הנתיב
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'דף הבית';
    if (path.startsWith('/lists')) {
      if (path === '/lists') return 'הרשימות שלי';
      return 'פרטי רשימה';
    }
    if (path === '/profile') return 'הפרופיל שלי';
    if (path === '/settings') return 'הגדרות';
    return '';
  };

  // פתיחת מודל להוספת רשימה חדשה
  const handleNewList = () => {
    setIsNewListModalOpen(true);
  };

  // יצירת רשימה חדשה
  const handleCreateList = async (listData) => {
    try {
      const response = await listAPI.createList(listData);
      setIsNewListModalOpen(false);
      // ניווט לרשימה החדשה
      navigate(`/lists/${response.data.data._id}`);
    } catch (error) {
      console.error('שגיאה ביצירת רשימה:', error);
      // ניתן להוסיף כאן טיפול בשגיאה, כמו הצגת הודעת שגיאה
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* סרגל צד */}
      <Sidebar />

      {/* תוכן ראשי */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* כותרת */}
        <Header title={getPageTitle()} onNewList={handleNewList} />

        {/* תוכן הדף הדינמי */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>

      {/* מודל ליצירת רשימה חדשה */}
      {isNewListModalOpen && (
        <CreateListModal
          isOpen={isNewListModalOpen}
          onClose={() => setIsNewListModalOpen(false)}
          onSubmit={handleCreateList}
        />
      )}
    </div>
  );
};

export default MainLayout;