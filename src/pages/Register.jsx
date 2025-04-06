import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

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
    if (!formData.name) {
      newErrors.name = 'נא להזין שם';
    }
    if (!formData.email) {
      newErrors.email = 'נא להזין כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    if (!formData.password) {
      newErrors.password = 'נא להזין סיסמה';
    } else if (formData.password.length < 6) {
      newErrors.password = 'הסיסמה חייבת להכיל לפחות 6 תווים';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
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
    
    try {
      // שליחת בקשת הרשמה ללא confirmPassword
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/');
    } catch (err) {
      // השגיאה תטופל דרך AuthContext
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-large shadow-card p-6 md:p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="לוגו" className="h-16 w-auto mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800">הרשמה</h2>
          <p className="mt-2 text-gray-600">צור חשבון חדש</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error bg-opacity-10 text-error border border-error rounded-normal">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <Input
            id="name"
            name="name"
            type="text"
            label="שם מלא"
            placeholder="הזן את שמך המלא"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            icon={<FiUser className="text-gray-400" />}
            required
          />

          <Input
            id="email"
            name="email"
            type="email"
            label="אימייל"
            placeholder="הזן את כתובת האימייל שלך"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            icon={<FiMail className="text-gray-400" />}
            required
          />

          <Input
            id="password"
            name="password"
            type="password"
            label="סיסמה"
            placeholder="בחר סיסמה (לפחות 6 תווים)"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<FiLock className="text-gray-400" />}
            required
          />

          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            label="אימות סיסמה"
            placeholder="הזן את הסיסמה שוב"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            icon={<FiLock className="text-gray-400" />}
            required
          />

          <Button type="submit" fullWidth loading={loading}>
            הירשם
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              כבר יש לך חשבון?{' '}
              <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
                התחבר כאן
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;