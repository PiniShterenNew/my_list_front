import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiList, FiShare2, FiClock, FiChevronRight } from 'react-icons/fi';
import { listAPI } from '../services/api';
import ListCard from '../components/lists/ListCard';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import CreateListModal from '../components/lists/CreateListModal';

const Home = () => {
  const [lists, setLists] = useState([]);
  const [sharedLists, setSharedLists] = useState([]);
  const [activeLists, setActiveLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewListModalOpen, setIsNewListModalOpen] = useState(false);
  
  // פונקציה לטעינת כל הרשימות
  const fetchLists = async () => {
    setLoading(true);
    setError('');
    
    try {
      // קבלת הרשימות של המשתמש
      const myListsResponse = await listAPI.getLists();
      const myLists = myListsResponse.data.data;
      setLists(myLists);
      
      // קבלת רשימות משותפות
      const sharedListsResponse = await listAPI.getSharedLists();
      const shared = sharedListsResponse.data.data;
      setSharedLists(shared);
      
      // מיון רשימות פעילות (שלי + משותפות)
      const active = [...myLists, ...shared].filter(
        (list) => list.status === 'active' || list.status === 'shopping'
      ).sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));
      
      setActiveLists(active.slice(0, 3)); // 3 רשימות אחרונות בלבד
    } catch (err) {
      console.error('שגיאה בטעינת רשימות:', err);
      setError('לא ניתן לטעון את הרשימות. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };
  
  // טעינת הרשימות בעת טעינת הדף
  useEffect(() => {
    fetchLists();
  }, []);
  
  // פתיחת המודל ליצירת רשימה חדשה
  const handleNewList = () => {
    setIsNewListModalOpen(true);
  };
  
  // יצירת רשימה חדשה
  const handleCreateList = async (listData) => {
    try {
      const response = await listAPI.createList(listData);
      setIsNewListModalOpen(false);
      
      // עדכון הרשימות בתצוגה
      fetchLists();
    } catch (error) {
      console.error('שגיאה ביצירת רשימה:', error);
      setError('לא ניתן ליצור רשימה חדשה. נסה שוב מאוחר יותר.');
    }
  };
  
  // תצוגת טעינה
  if (loading && !lists.length && !sharedLists.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div>
      {/* כותרת וכפתור רשימה חדשה */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">דף הבית</h1>
        <Button onClick={handleNewList} icon={<FiPlus />}>
          רשימה חדשה
        </Button>
      </div>
      
      {/* הודעת שגיאה */}
      {error && (
        <div className="mb-6 p-4 bg-error bg-opacity-10 border border-error rounded-normal text-error">
          {error}
        </div>
      )}
      
      {/* רשימות פעילות */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">רשימות פעילות</h2>
          <Link to="/lists" className="text-primary flex items-center hover:underline">
            <span>כל הרשימות</span>
            <FiChevronRight className="mr-1" />
          </Link>
        </div>
        
        {activeLists.length === 0 ? (
          <div className="card text-center py-8">
            <div className="text-gray-500 mb-4">
              <FiList size={48} className="mx-auto mb-2" />
              <p>אין לך רשימות פעילות</p>
            </div>
            <Button onClick={handleNewList} icon={<FiPlus />} size="sm">
              צור רשימה חדשה
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeLists.map((list) => (
              <ListCard key={list._id} list={list} />
            ))}
          </div>
        )}
      </section>
      
      {/* רשימות שיתפו איתך */}
      {sharedLists.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              <span className="flex items-center">
                <FiShare2 className="ml-2" />
                רשימות שיתפו איתך
              </span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sharedLists.slice(0, 3).map((list) => (
              <ListCard key={list._id} list={list} />
            ))}
          </div>
        </section>
      )}
      
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

export default Home;