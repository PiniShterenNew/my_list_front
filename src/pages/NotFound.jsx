import { Link } from 'react-router-dom';
import { FiHome } from 'react-icons/fi';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <h1 className="text-9xl font-bold text-primary">404</h1>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">הדף לא נמצא</h2>
        <p className="text-gray-600 mt-2 mb-8">
          מצטערים, הדף שחיפשת אינו קיים או שהועבר למקום אחר.
        </p>
        
        <Link to="/">
          <Button icon={<FiHome />}>
            חזרה לדף הבית
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;