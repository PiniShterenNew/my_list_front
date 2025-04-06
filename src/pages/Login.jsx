import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const { login, loading, error } = useAuth();
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
    if (!formData.email) {
      newErrors.email = 'נא להזין כתובת אימייל';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'כתובת אימייל לא תקינה';
    }
    if (!formData.password) {
      newErrors.password = 'נא להזין סיסמה';
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
      await login(formData);
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
          <h2 className="text-3xl font-bold text-gray-800">ברוכים הבאים!</h2>
          <p className="mt-2 text-gray-600">נא להתחבר כדי להמשיך</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-error bg-opacity-10 text-error border border-error rounded-normal">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
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
            placeholder="הזן את הסיסמה שלך"
            value={formData.password}
            onChange={handleChange}
            error={errors.password}
            icon={<FiLock className="text-gray-400" />}
            required
          />

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="ml-2 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="text-sm text-gray-700">
                זכור אותי
              </label>
            </div>

            <div className="text-sm">
              <Link to="/forgot-password" className="text-primary hover:text-primary-dark">
                שכחת סיסמה?
              </Link>
            </div>
          </div>

          <Button type="submit" fullWidth loading={loading}>
            התחבר
          </Button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              אין לך חשבון?{' '}
              <Link to="/register" className="text-primary hover:text-primary-dark font-medium">
                הירשם עכשיו
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;