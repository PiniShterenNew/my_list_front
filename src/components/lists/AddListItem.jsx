import { useState, useEffect, useRef } from 'react';
import { FiSearch, FiPlus, FiX } from 'react-icons/fi';
import { catalogAPI, listItemAPI } from '../../services/api';
import Button from '../common/Button';
import QuantitySelector from '../common/QuantitySelector';
import UnitSelector from '../common/UnitSelector';

const AddListItem = ({ listId, onItemAdded }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: { main: '', sub: '' },
    quantity: 1,
    unit: '',
    isPermanent: false,
    notes: '',
  });

  const searchInputRef = useRef(null);
  const formRef = useRef(null);

  // קבלת קטגוריות בטעינה ראשונית
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await catalogAPI.getCategories();
        setCategories(response.data.data);
      } catch (error) {
        console.error('שגיאה בקבלת קטגוריות:', error);
      }
    };

    fetchCategories();
  }, []);

  // חיפוש מוצרים כאשר משנים את מחרוזת החיפוש
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchResults([]);
      return;
    }

    const searchTimeout = setTimeout(async () => {
      try {
        const response = await catalogAPI.searchProducts({ q: searchTerm, limit: 5 });
        setSearchResults(response.data.data);
      } catch (error) {
        console.error('שגיאה בחיפוש מוצרים:', error);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  // פוקוס על שדה החיפוש כשהטופס נפתח
  useEffect(() => {
    if (isExpanded && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isExpanded]);

  // ריקון הטופס כשנסגר
  useEffect(() => {
    if (!isExpanded) {
      resetForm();
    }
  }, [isExpanded]);

  // איפוס הטופס
  const resetForm = () => {
    setFormData({
      name: '',
      category: { main: '', sub: '' },
      quantity: 1,
      unit: '',
      isPermanent: false,
      notes: '',
    });
    setSearchTerm('');
    setSearchResults([]);
    setSelectedProduct(null);
  };

  // בחירת מוצר מתוצאות החיפוש
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      quantity: 1,
      unit: product.defaultUnit || '',
      isPermanent: false,
      notes: '',
      productId: product._id,
    });
    setSearchTerm('');
    setSearchResults([]);
  };

  // שינוי ערך בטופס
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'main-category') {
      setFormData((prev) => ({
        ...prev,
        category: { ...prev.category, main: value, sub: '' },
      }));
    } else if (name === 'sub-category') {
      setFormData((prev) => ({
        ...prev,
        category: { ...prev.category, sub: value },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  // הוספת המוצר לרשימה
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const itemData = {
        ...formData,
        productId: selectedProduct?._id || undefined,
      };

      const response = await listItemAPI.addItem(listId, itemData);
      onItemAdded(response.data.data);
      setIsExpanded(false);
      resetForm();
    } catch (error) {
      console.error('שגיאה בהוספת פריט:', error);
      // כאן ניתן להוסיף הודעת שגיאה למשתמש
    } finally {
      setLoading(false);
    }
  };

  // רינדור תוצאות החיפוש
  const renderSearchResults = () => {
    if (searchResults.length === 0) {
      return searchTerm.length >= 2 ? (
        <div className="p-3 text-center text-gray-500 text-sm">
          לא נמצאו תוצאות
        </div>
      ) : null;
    }

    return (
      <div className="absolute top-full right-0 left-0 bg-white border border-gray-200 rounded-b-normal shadow-lg z-10 max-h-60 overflow-y-auto">
        {searchResults.map((product) => (
          <div
            key={product._id}
            className="p-3 border-b last:border-0 cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={() => handleProductSelect(product)}
          >
            <div className="flex items-center">
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-10 h-10 rounded object-cover ml-3"
                />
              )}
              <div>
                <div className="font-medium">{product.name}</div>
                <div className="text-xs text-gray-500 flex items-center">
                  <span>{product.category.main}</span>
                  {product.price && (
                    <span className="mr-2">{product.price} ₪</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-large shadow-card mb-6">
      {isExpanded ? (
        <form ref={formRef} onSubmit={handleSubmit} className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">הוספת פריט לרשימה</h3>
            <button
              type="button"
              className="text-gray-400 hover:text-gray-600"
              onClick={() => setIsExpanded(false)}
            >
              <FiX size={20} />
            </button>
          </div>

          {/* חיפוש מוצר */}
          <div className="mb-4 relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              חיפוש מוצר (אופציונלי)
            </label>
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="הקלד שם מוצר לחיפוש"
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
            </div>
            {renderSearchResults()}
          </div>

          {/* שם הפריט */}
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              שם הפריט *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="input-field"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* קטגוריה */}
          {/* <div className="grid grid-cols-1 gap-4 mb-4">
            <div>
              <label htmlFor="main-category" className="block text-sm font-medium text-gray-700 mb-1">
                קטגוריה *
              </label>
              <select
                id="main-category"
                name="main-category"
                className="input-field"
                value={formData.category.main}
                onChange={handleChange}
                required
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((category) => (
                  <option key={category.code} value={category.code}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sub-category" className="block text-sm font-medium text-gray-700 mb-1">
                תת-קטגוריה
              </label>
              <select
                id="sub-category"
                name="sub-category"
                className="input-field"
                value={formData.category.sub}
                onChange={handleChange}
                disabled={!formData.category.main}
              >
                <option value="">בחר תת-קטגוריה</option>
                {formData.category.main && categories.find(c => c.code === formData.category.main)?.subCategories.map((subCode) => {
                  const subCategory = categories.find(c => c.code === subCode);
                  return subCategory ? (
                    <option key={subCategory.code} value={subCategory.code}>
                      {subCategory.name}
                    </option>
                  ) : null;
                })}
              </select>
            </div>
          </div> */}

          {/* כמות ויחידת מידה */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                כמות
              </label>
              <div className="flex justify-center">
                <QuantitySelector
                  value={formData.quantity}
                  onChange={(value) => setFormData(prev => ({ ...prev, quantity: value }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                יחידת מידה
              </label>
              <div className="flex justify-center">
                <UnitSelector
                  value={formData.unit}
                  onChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}
                />
              </div>
            </div>
          </div>

          {/* הערות */}
          <div className="mb-4">
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              הערות
            </label>
            <textarea
              id="notes"
              name="notes"
              className="input-field"
              rows="2"
              placeholder="הערות נוספות לפריט"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          {/* האם פריט קבוע */}
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isPermanent"
                className="ml-2"
                checked={formData.isPermanent}
                onChange={handleChange}
              />
              <span className="text-sm text-gray-700">פריט קבוע (יישאר ברשימה לאחר השלמת הקנייה)</span>
            </label>
          </div>

          {/* כפתורי פעולה */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsExpanded(false)}
              disabled={loading}
            >
              ביטול
            </Button>
            <Button type="submit" loading={loading}>
              הוסף לרשימה
            </Button>
          </div>
        </form>
      ) : (
        <button
          className="w-full p-4 flex items-center justify-center text-primary hover:bg-primary-light hover:bg-opacity-10 transition-colors rounded-normal"
          onClick={() => setIsExpanded(true)}
        >
          <FiPlus className="ml-2" size={20} />
          <span className="font-medium">הוסף פריט לרשימה</span>
        </button>
      )}
    </div>
  );
};

export default AddListItem;