import { Link } from 'react-router-dom';
import { FiShoppingCart, FiCheck, FiClock, FiUsers, FiTag } from 'react-icons/fi';

// פונקציה שמחזירה אייקון לפי סטטוס הרשימה
const getStatusIcon = (status) => {
  switch (status) {
    case 'shopping':
      return <FiShoppingCart className="text-primary" />;
    case 'completed':
      return <FiCheck className="text-success" />;
    default:
      return <FiClock className="text-gray-400" />;
  }
};

// פונקציה שמחזירה טקסט לפי סטטוס הרשימה
const getStatusText = (status) => {
  switch (status) {
    case 'shopping':
      return 'בקנייה';
    case 'completed':
      return 'הושלמה';
    default:
      return 'פעילה';
  }
};

const ListCard = ({ list }) => {
  const { _id, name, description, status, sharedWith, tags, lastModified, type } = list;
  
  // פורמוט תאריך עבור "עודכן לאחרונה"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('he-IL', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <Link to={`/lists/${_id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-800">{name}</h3>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs">
            {getStatusIcon(status)}
            <span className="mr-1">{getStatusText(status)}</span>
          </div>
        </div>
        
        {description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        )}
        
        <div className="flex flex-wrap gap-2 mt-3">
          {/* תגית סוג הרשימה */}
          <div className="tag flex items-center">
            <FiClock size={12} />
            <span className="mr-1">{type === 'permanent' ? 'קבועה' : 'חד פעמית'}</span>
          </div>
          
          {/* הצגת משתמשים משותפים */}
          {sharedWith && sharedWith.length > 0 && (
            <div className="tag flex items-center">
              <FiUsers size={12} />
              <span className="mr-1">{sharedWith.length} משתתפים</span>
            </div>
          )}
          
          {/* הצגת תגיות */}
          {tags && tags.length > 0 && (
            <div className="tag flex items-center">
              <FiTag size={12} />
              <span className="mr-1">{tags.join(', ')}</span>
            </div>
          )}
        </div>
        
        <div className="text-gray-500 text-xs mt-4">
          עודכן: {formatDate(lastModified)}
        </div>
      </div>
    </Link>
  );
};

export default ListCard;