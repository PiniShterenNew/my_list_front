import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiEdit2,
  FiTrash2,
  FiShare2,
  FiShoppingCart,
  FiCheckCircle,
  FiUsers,
  FiArrowRight,
  FiArchive,
  FiMenu,
  FiX
} from 'react-icons/fi';
import { listAPI, listItemAPI, catalogAPI } from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ListItem from '../components/lists/ListItem';
import AddListItem from '../components/lists/AddListItem';

const ListDetails = () => {
  const { listId } = useParams();
  const navigate = useNavigate();

  const [list, setList] = useState(null);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [groupByCategory, setGroupByCategory] = useState(true);
  const [hideChecked, setHideChecked] = useState(false);
  const [isActionSheetOpen, setIsActionSheetOpen] = useState(false);

  // טעינת נתוני הרשימה והפריטים
  useEffect(() => {
    const fetchListDetails = async () => {
      setLoading(true);
      setError('');

      try {
        // קבלת פרטי הרשימה
        const listResponse = await listAPI.getList(listId);
        setList(listResponse.data.data);

        // קבלת פריטי הרשימה
        const itemsResponse = await listItemAPI.getListItems(listId);
        setItems(itemsResponse.data.data);

        // קבלת הקטגוריות עבור מיון
        const categoriesResponse = await catalogAPI.getCategories();
        setCategories(categoriesResponse.data.data);
      } catch (err) {
        console.error('שגיאה בטעינת פרטי רשימה:', err);
        setError('לא ניתן לטעון את פרטי הרשימה. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchListDetails();
  }, [listId]);

  // פונקציה לעדכון פריט
  const handleUpdateItem = (updatedItem) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id ? updatedItem : item
      )
    );
  };

  // פונקציה למחיקת פריט
  const handleDeleteItem = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  // פונקציה להוספת פריט
  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  // פונקציה לשינוי סטטוס הרשימה
  const handleStatusChange = async (newStatus) => {
    try {
      await listAPI.updateListStatus(listId, newStatus);
      setList((prevList) => ({ ...prevList, status: newStatus }));
    } catch (err) {
      console.error('שגיאה בשינוי סטטוס הרשימה:', err);
      setError('לא ניתן לעדכן את סטטוס הרשימה. נסה שוב מאוחר יותר.');
    }
  };

  // פונקציה לסיום הקניות
  const handleCompleteList = async () => {
    if (window.confirm('האם אתה בטוח שברצונך לסמן את הרשימה כהושלמה?')) {
      try {
        const response = await listAPI.completeList(listId);
        setList((prevList) => ({ ...prevList, status: 'completed' }));

        // אם זו רשימה חד פעמית, היא תעבור לארכיון
        if (response.data.data.type === 'oneTime') {
          navigate('/lists');
        } else {
          // עדכון רשימה קבועה - איפוס הפריטים הלא קבועים
          const itemsResponse = await listItemAPI.getListItems(listId);
          setItems(itemsResponse.data.data);
        }
      } catch (err) {
        console.error('שגיאה בסיום הרשימה:', err);
        setError('לא ניתן לסמן את הרשימה כהושלמה. נסה שוב מאוחר יותר.');
      }
    }
  };

  // פונקציה למחיקת הרשימה
  const handleDeleteList = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק את הרשימה? פעולה זו אינה הפיכה!')) {
      try {
        await listAPI.deleteList(listId);
        navigate('/lists');
      } catch (err) {
        console.error('שגיאה במחיקת הרשימה:', err);
        setError('לא ניתן למחוק את הרשימה. נסה שוב מאוחר יותר.');
      }
    }
  };

  // תצוגת טעינה
  if (loading && !list) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // תצוגת שגיאה
  if (error && !list) {
    return (
      <div className="bg-error bg-opacity-10 border border-error rounded-normal p-4 text-center">
        <p className="text-error mb-4">{error}</p>
        <Button onClick={() => navigate('/lists')} variant="outline" icon={<FiArrowRight />}>
          חזרה לרשימות
        </Button>
      </div>
    );
  }

  // אם אין רשימה להציג
  if (!list) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 mb-4">הרשימה לא נמצאה</p>
        <Button onClick={() => navigate('/lists')} variant="outline" icon={<FiArrowRight />}>
          חזרה לרשימות
        </Button>
      </div>
    );
  }

  // מיון וסינון הפריטים
  let filteredItems = [...items];

  // הסתרת פריטים מסומנים אם צריך
  if (hideChecked) {
    filteredItems = filteredItems.filter((item) => !item.isChecked);
  }

  // ארגון לפי קטגוריות
  const groupedItems = {};
  const uncategorizedItems = [];

  if (groupByCategory) {
    filteredItems.forEach((item) => {
      if (item.category && item.category.main) {
        if (!groupedItems[item.category.main]) {
          groupedItems[item.category.main] = [];
        }
        groupedItems[item.category.main].push(item);
      } else {
        uncategorizedItems.push(item);
      }
    });

    // מיון לפי שם הקטגוריה
    Object.keys(groupedItems).forEach((categoryCode) => {
      groupedItems[categoryCode].sort((a, b) => a.name.localeCompare(b.name));
    });
  } else {
    // מיון לפי שם הפריט
    filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  }

  // פונקציה להצגת שם הקטגוריה
  const getCategoryName = (categoryCode) => {
    const category = categories.find((cat) => cat.code === categoryCode);
    return category ? category.name : categoryCode;
  };

  // פונקציה לקבלת אייקון עבור הקטגוריה
  const getCategoryIcon = (categoryCode) => {
    const category = categories.find((cat) => cat.code === categoryCode);
    return category?.icon || '📦';
  };

  return (
    <div className="container mx-auto">
      {/* מובייל: כותרת ופעולות */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 truncate">{list.name}</h1>
          {list.description && (
            <p className="text-gray-600 mt-1 text-xs md:text-sm truncate">{list.description}</p>
          )}
        </div>

        <button
          onClick={() => setIsActionSheetOpen(true)}
          className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiMenu size={24} />
        </button>
      </div>

      {/* מידע על הרשימה */}
      <div className="bg-white rounded-normal shadow-card p-3 md:p-4 mb-4 md:mb-6">
        <div className="grid grid-cols-3 gap-2 text-xs md:text-sm">
          <div className="flex items-center">
            <div className="ml-2 bg-primary-light bg-opacity-20 p-1 rounded-full">
              <FiShoppingCart className="text-primary-dark text-sm" />
            </div>
            <span>{list.status === 'active' ? 'פעילה' : list.status === 'shopping' ? 'בקנייה' : 'הושלמה'}</span>
          </div>

          {list.sharedWith && list.sharedWith.length > 0 && (
            <div className="flex items-center">
              <div className="ml-2 bg-accent bg-opacity-20 p-1 rounded-full">
                <FiUsers className="text-accent text-sm" />
              </div>
              <span>  {list.sharedWith.length} </span>
            </div>
          )}

          <div className="flex items-center">
            <div className="ml-2 bg-secondary-light bg-opacity-20 p-1 rounded-full">
              <FiArchive className="text-secondary-dark text-sm" />
            </div>
            <span>{list.type === 'permanent' ? 'קבועה' : 'חד פעמית'}</span>
          </div>
        </div>
      </div>

      {/* כפתורי סינון ומיון */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
        <div className="flex flex-wrap gap-2 mb-2 sm:mb-0">
          <Button
            onClick={() => setGroupByCategory(!groupByCategory)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {groupByCategory ? 'ביטול מיון' : 'מיון לפי קטגוריה'}
          </Button>

          <Button
            onClick={() => setHideChecked(!hideChecked)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            {hideChecked ? 'הצג מסומנים' : 'הסתר מסומנים'}
          </Button>
        </div>

        <div className="text-xs text-gray-500">
          {items.length} פריטים ({items.filter(item => item.isChecked).length} נרכשו)
        </div>
      </div>

      {/* הוספת פריט */}
      <AddListItem listId={listId} onItemAdded={handleAddItem} />

      {/* תוכן הרשימה */}
      <div className="bg-white rounded-large shadow-card overflow-hidden mb-8">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <p className="mb-2 text-sm">הרשימה ריקה</p>
            <p className="text-xs">הוסף פריטים לרשימה באמצעות הכפתור למעלה</p>
          </div>
        ) : groupByCategory ? (
          /* תצוגה מקובצת לפי קטגוריות */
          <>
            {Object.keys(groupedItems).map((categoryCode) => (
              <div key={categoryCode}>
                <div className="bg-gray-50 p-2 md:p-3 border-b border-gray-200 font-medium flex items-center text-sm">
                  <span className="ml-2 text-sm">{getCategoryIcon(categoryCode)}</span>
                  <span className="truncate">{getCategoryName(categoryCode)}</span>
                  <span className="mr-2 text-xs text-gray-500">({groupedItems[categoryCode].length})</span>
                </div>

                <div>
                  {groupedItems[categoryCode].map((item) => (
                    <ListItem
                      key={item._id}
                      item={item}
                      listId={listId}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* פריטים ללא קטגוריה */}
            {uncategorizedItems.length > 0 && (
              <div>
                <div className="bg-gray-50 p-2 md:p-3 border-b border-gray-200 font-medium text-sm">
                  <span>ללא קטגוריה</span>
                  <span className="mr-2 text-xs text-gray-500">({uncategorizedItems.length})</span>
                </div>

                <div>
                  {uncategorizedItems.map((item) => (
                    <ListItem
                      key={item._id}
                      item={item}
                      listId={listId}
                      onUpdate={handleUpdateItem}
                      onDelete={handleDeleteItem}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          /* תצוגה רשימתית לפי שם */
          <div>
            {filteredItems.map((item) => (
              <ListItem
                key={item._id}
                item={item}
                listId={listId}
                onUpdate={handleUpdateItem}
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        )}
      </div>

      {/* Mobile Action Sheet */}
      {isActionSheetOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setIsActionSheetOpen(false)}>
          <div
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl p-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">פעולות רשימה</h3>
              <button onClick={() => setIsActionSheetOpen(false)} className="text-gray-500">
                <FiX size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {list.status === 'active' && (
                <Button
                  onClick={() => {
                    handleStatusChange('shopping');
                    setIsActionSheetOpen(false);
                  }}
                  variant="primary"
                  icon={<FiShoppingCart />}
                  className="w-full"
                >
                  התחל קנייה
                </Button>
              )}

              {list.status === 'shopping' && (
                <Button
                  onClick={() => {
                    handleCompleteList();
                    setIsActionSheetOpen(false);
                  }}
                  variant="success"
                  icon={<FiCheckCircle />}
                  className="w-full"
                >
                  סיים קנייה
                </Button>
              )}

              <Button
                onClick={() => { }}
                variant="outline"
                icon={<FiEdit2 />}
                className="w-full"
              >
                ערוך
              </Button>

              <Button
                onClick={() => { }}
                variant="outline"
                icon={<FiShare2 />}
                className="w-full"
              >
                שתף
              </Button>

              <Button
                onClick={() => {
                  handleDeleteList();
                  setIsActionSheetOpen(false);
                }}
                variant="outline"
                icon={<FiTrash2 />}
                className="w-full text-error hover:bg-error hover:bg-opacity-10 hover:border-error"
              >
                מחק
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListDetails;