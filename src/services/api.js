// src/services/api.js
import axios from 'axios';

// יצירת מופע axios עם הגדרות בסיסיות
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://shoppinglistserver-59ab0a59cfbd.herokuapp.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// הוספת interceptor עבור הוספת טוקן אימות לכל בקשה
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// הוספת interceptor עבור טיפול בשגיאות וחידוש טוקן
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // אם התקבלה שגיאת 401 (לא מורשה) וזה לא ניסיון חידוש חוזר
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // ניסיון לחדש את הטוקן
        const refreshToken = localStorage.getItem('refreshToken');
        const { data } = await axios.post('/api/auth/refresh', { refreshToken });
        
        // שמירת הטוקן החדש
        localStorage.setItem('accessToken', data.accessToken);
        
        // שליחת הבקשה המקורית שוב עם הטוקן החדש
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return axios(originalRequest);
      } catch (refreshError) {
        // אם לא הצלחנו לחדש את הטוקן, נניח שהמשתמש צריך להתחבר מחדש
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// יצוא פונקציות API מוכנות לשימוש

// ----- אימות -----
export const authAPI = {
  // הרשמה
  register: (userData) => api.post('/auth/register', userData),
  
  // כניסה
  login: (credentials) => api.post('/auth/login', credentials),
  
  // חידוש טוקן
  refreshToken: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  
  // ניתוק
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  
  // קבלת המשתמש הנוכחי
  getCurrentUser: () => api.get('/auth/me'),
};

// ----- משתמשים -----
export const userAPI = {
  // קבלת פרופיל המשתמש
  getProfile: () => api.get('/users/me'),
  
  // עדכון פרופיל
  updateProfile: (userData) => api.put('/users/me', userData),
  
  // עדכון העדפות
  updatePreferences: (preferences) => api.put('/users/me/preferences', { preferences }),
  
  // חיפוש משתמשים
  searchUsers: (query) => api.get('/users/search', { params: { q: query } }),
  
  // קבלת אנשי קשר
  getContacts: () => api.get('/users/contacts'),
  
  // הוספת איש קשר
  addContact: (userId) => api.post('/users/contacts', { userId }),
  
  // הסרת איש קשר
  removeContact: (contactId) => api.delete(`/users/contacts/${contactId}`),
};

// ----- רשימות -----
export const listAPI = {
  // קבלת כל הרשימות
  getLists: () => api.get('/lists'),
  
  // יצירת רשימה חדשה
  createList: (listData) => api.post('/lists', listData),
  
  // קבלת רשימות משותפות
  getSharedLists: () => api.get('/lists/shared'),
  
  // קבלת רשימה ספציפית
  getList: (listId) => api.get(`/lists/${listId}`),
  
  // עדכון רשימה
  updateList: (listId, listData) => api.put(`/lists/${listId}`, listData),
  
  // מחיקת רשימה
  deleteList: (listId) => api.delete(`/lists/${listId}`),
  
  // עדכון סטטוס רשימה
  updateListStatus: (listId, status) => api.put(`/lists/${listId}/status`, { status }),
  
  // שיתוף רשימה
  shareList: (listId, users) => api.post(`/lists/${listId}/share`, { users }),
  
  // ביטול שיתוף
  unshareList: (listId, userId) => api.delete(`/lists/${listId}/share/${userId}`),
  
  // סיום רשימת קניות
  completeList: (listId) => api.post(`/lists/${listId}/complete`),
};

// ----- פריטים ברשימה -----
export const listItemAPI = {
  // קבלת פריטים ברשימה
  getListItems: (listId) => api.get(`/lists/${listId}/items`),
  
  // הוספת פריט לרשימה
  addItem: (listId, itemData) => api.post(`/lists/${listId}/items`, itemData),
  
  // עדכון פריט
  updateItem: (listId, itemId, itemData) => api.put(`/lists/${listId}/items/${itemId}`, itemData),
  
  // מחיקת פריט
  deleteItem: (listId, itemId) => api.delete(`/lists/${listId}/items/${itemId}`),
  
  // סימון פריט כנרכש או ביטול סימון
  toggleItemCheck: (listId, itemId, isChecked) => api.put(`/lists/${listId}/items/${itemId}/check`, { isChecked }),
};

// ----- קטלוג -----
export const catalogAPI = {
  // חיפוש במוצרי הקטלוג
  searchProducts: (params) => api.get('/catalog', { params }),
  
  // קבלת כל הקטגוריות
  getCategories: () => api.get('/catalog/categories'),
  
  // קבלת תת-קטגוריות
  getSubCategories: (categoryId) => api.get(`/catalog/categories/${categoryId}`),
  
  // קבלת מוצר ספציפי
  getProduct: (productId) => api.get(`/catalog/products/${productId}`),
  
  // חיפוש מוצר לפי ברקוד
  getProductByBarcode: (barcode) => api.get(`/catalog/barcode/${barcode}`),
  
  // עדכון מחיר מוצר
  updateProductPrice: (productId, price, supermarket) => api.put(`/catalog/products/${productId}/price`, { price, supermarket }),
};

// ----- התראות -----
export const notificationAPI = {
  // קבלת התראות למשתמש
  getNotifications: (params) => api.get('/notifications', { params }),
  
  // סימון התראה כנקראה
  markNotificationAsRead: (notificationId) => api.put(`/notifications/${notificationId}/read`),
  
  // סימון כל ההתראות כנקראות
  markAllNotificationsAsRead: () => api.put('/notifications/read-all'),
  
  // מחיקת התראה
  deleteNotification: (notificationId) => api.delete(`/notifications/${notificationId}`),
};

export default api;