import { useState, useEffect } from 'react';
import { FiEdit2, FiUser, FiMail, FiSave, FiX, FiDatabase } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Profile = () => {
  const { currentUser, updateUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    avatar: '',
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [preferencesExpanded, setPreferencesExpanded] = useState(false);

  // קבלת נתוני פרופיל מהשרת
  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await userAPI.getProfile();
        setProfileData(response.data.data);
        setFormData({
          name: response.data.data.name,
          avatar: response.data.data.avatar || '',
        });
      } catch (err) {
        console.error('שגיאה בקבלת נתוני פרופיל:', err);
        setError('לא ניתן לטעון את נתוני הפרופיל. נסה שוב מאוחר יותר.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    try {
      const response = await userAPI.updateProfile(formData);
      setProfileData(response.data.data);
      setIsEditing(false);
      // עדכון נתוני המשתמש ב-context
      updateUser(response.data.data);
    } catch (err) {
      console.error('שגיאה בעדכון פרופיל:', err);
      setError('לא ניתן לעדכן את הפרופיל. נסה שוב מאוחר יותר.');
    } finally {
      setSaveLoading(false);
    }
  };

  // עריכת העדפות המשתמש
  const handlePreferenceChange = async (preferenceData) => {
    setLoading(true);
    try {
      const response = await userAPI.updatePreferences(preferenceData);
      setProfileData(prev => ({
        ...prev,
        preferences: response.data.data
      }));
      // עדכון נתוני המשתמש ב-context
      updateUser({
        ...currentUser,
        preferences: response.data.data
      });
    } catch (err) {
      console.error('שגיאה בעדכון העדפות:', err);
      setError('לא ניתן לעדכן את ההעדפות. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="bg-error bg-opacity-10 border border-error rounded-normal p-4 text-center">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">הפרופיל שלי</h1>

      {/* כרטיס פרופיל */}
      <div className="bg-white rounded-large shadow-card overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            {/* תמונת פרופיל */}
            <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-white text-3xl overflow-hidden mb-4 md:mb-0 md:ml-6">
              {profileData?.avatar ? (
                <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
              ) : (
                <FiUser />
              )}
            </div>

            {/* פרטי המשתמש */}
            {isEditing ? (
              <form onSubmit={handleSubmit} className="flex-1">
                <Input
                  id="name"
                  name="name"
                  label="שם"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  icon={<FiUser className="text-gray-400" />}
                />

                <Input
                  id="avatar"
                  name="avatar"
                  label="קישור לתמונת פרופיל (URL)"
                  value={formData.avatar}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                />

                <div className="flex gap-3 mt-4">
                  <Button type="submit" loading={saveLoading} icon={<FiSave />}>
                    שמור
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    icon={<FiX />}
                  >
                    ביטול
                  </Button>
                </div>
              </form>
            ) : (
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800">{profileData?.name}</h2>
                <p className="text-gray-600 flex items-center mt-1">
                  <FiMail className="ml-2" />
                  {profileData?.email}
                </p>
                
                <p className="text-sm text-gray-500 mt-2">
                  חבר מתאריך: {new Date(profileData?.createdAt).toLocaleDateString('he-IL')}
                </p>
                
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="outline" 
                  className="mt-4"
                  icon={<FiEdit2 />}
                >
                  ערוך פרופיל
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* כרטיס העדפות */}
      <div className="bg-white rounded-large shadow-card overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">העדפות</h3>
            <Button
              onClick={() => setPreferencesExpanded(!preferencesExpanded)}
              variant="outline"
              size="sm"
            >
              {preferencesExpanded ? 'הסתר' : 'הרחב'}
            </Button>
          </div>

          {/* העדפות בסיסיות */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm font-medium text-gray-600">שפה</p>
              <p className="text-gray-800">
                {profileData?.preferences?.language === 'he' ? 'עברית' : 'English'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">ערכת נושא</p>
              <p className="text-gray-800">
                {profileData?.preferences?.theme === 'light' ? 'בהירה' : 'כהה'}
              </p>
            </div>
          </div>

          {/* העדפות מורחבות */}
          {preferencesExpanded && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-md font-medium text-gray-700 mb-3">העדפות מצב קנייה</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">הסתרת פריטים מסומנים</p>
                  <div className="mt-2 flex items-center">
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-primary rounded border-gray-300 focus:ring-primary"
                        checked={profileData?.preferences?.shoppingMode?.hideCheckedItems}
                        onChange={(e) => handlePreferenceChange({
                          ...profileData.preferences,
                          shoppingMode: {
                            ...profileData.preferences.shoppingMode,
                            hideCheckedItems: e.target.checked
                          }
                        })}
                      />
                      <span className="mr-2 text-gray-700">הסתר אוטומטית פריטים שנרכשו</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600">מיון ברירת מחדל</p>
                  <div className="mt-2">
                    <select
                      className="input-field"
                      value={profileData?.preferences?.shoppingMode?.sortBy}
                      onChange={(e) => handlePreferenceChange({
                        ...profileData.preferences,
                        shoppingMode: {
                          ...profileData.preferences.shoppingMode,
                          sortBy: e.target.value
                        }
                      })}
                    >
                      <option value="category">לפי קטגוריה</option>
                      <option value="name">לפי שם</option>
                      <option value="custom">מותאם אישית</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* כרטיס מועדפים */}
      <div className="bg-white rounded-large shadow-card overflow-hidden mb-8">
        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">מוצרים מועדפים</h3>
          
          {profileData?.favoriteItems?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profileData.favoriteItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-normal p-3 flex items-center">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded ml-3" />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center ml-3">
                      <FiUser className="text-gray-500" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category.main}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">אין לך מוצרים מועדפים עדיין</p>
          )}
        </div>
      </div>
     
    </div>
  );
};

export default Profile;