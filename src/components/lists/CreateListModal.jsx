import { useState } from 'react';
import { FiX } from 'react-icons/fi';
import Button from '../common/Button';
import Input from '../common/Input';

const CreateListModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'oneTime',
    tags: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // ניקוי שגיאה אם קיימת
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'שם הרשימה הוא שדה חובה';
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    
    try {
      // המרת התגיות ממחרוזת למערך
      const tags = formData.tags
        ? formData.tags.split(',').map((tag) => tag.trim())
        : [];
      
      // הכנת האובייקט לשליחה
      const listData = {
        name: formData.name,
        description: formData.description,
        type: formData.type,
        tags,
      };
      
      await onSubmit(listData);
    } catch (error) {
      console.error('שגיאה בשליחת הטופס:', error);
      setErrors({ submit: 'אירעה שגיאה ביצירת הרשימה' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-large p-6 shadow-lg w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">רשימה חדשה</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {errors.submit && (
          <div className="mb-4 p-3 bg-error bg-opacity-10 border border-error rounded-normal text-error">
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            label="שם הרשימה"
            placeholder="למשל: קניות לשבת"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
          />

          <div className="mb-4">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              תיאור (אופציונלי)
            </label>
            <textarea
              id="description"
              name="description"
              rows="3"
              className="input-field"
              placeholder="תיאור קצר של הרשימה"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              סוג רשימה
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="oneTime"
                  checked={formData.type === 'oneTime'}
                  onChange={handleChange}
                  className="ml-2"
                />
                <span>חד פעמית</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="type"
                  value="permanent"
                  checked={formData.type === 'permanent'}
                  onChange={handleChange}
                  className="ml-2"
                />
                <span>קבועה</span>
              </label>
            </div>
          </div>

          <Input
            id="tags"
            name="tags"
            label="תגיות (אופציונלי)"
            placeholder="הפרדה עם פסיקים, למשל: שבת, מכולת"
            value={formData.tags}
            onChange={handleChange}
          />

          <div className="flex justify-end mt-6 gap-3">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              ביטול
            </Button>
            <Button type="submit" loading={loading}>
              צור רשימה
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateListModal;