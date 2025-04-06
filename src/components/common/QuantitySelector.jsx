import { useState, useEffect, useRef } from 'react';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';

// רכיב picker בסגנון מובייל שעובד גם בדפדפן - מותאם למסכי מובייל
const QuantitySelector = ({ value, onChange, min = 0.5, max = 20, step = 0.5 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const scrollerRef = useRef(null);
  const pickerRef = useRef(null);
  
  // יצירת מערך ערכים אפשריים
  const options = [];
  for (let i = min; i <= max; i += step) {
    options.push(i);
  }
  
  // סגירת הבורר בלחיצה מחוץ לאלמנט
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // גלילה למיקום הערך הנוכחי כשפותחים את הבורר
  useEffect(() => {
    if (isOpen && scrollerRef.current) {
      const index = options.indexOf(value);
      const itemHeight = 40; // גובה כל אפשרות בפיקסלים
      
      if (index !== -1) {
        scrollerRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [isOpen, value, options]);
  
  // לחיצה על אפשרות בבורר
  const handleOptionClick = (option) => {
    onChange(option);
    setIsOpen(false);
  };
  
  // מימוש הזזה של ערך אחד (למעלה/למטה)
  const handleIncrement = (increment) => {
    const currentIndex = options.indexOf(value);
    if (increment && currentIndex < options.length - 1) {
      onChange(options[currentIndex + 1]);
    } else if (!increment && currentIndex > 0) {
      onChange(options[currentIndex - 1]);
    }
  };
  
  // טיפול באירועי מגע (swipe) עבור מכשירים ניידים
  const handleTouchStart = (e) => {
    const touchStartY = e.touches[0].clientY;
    const touchThreshold = 50; // מרחק סף למעלה/למטה בפיקסלים
    
    const handleTouchMove = (e) => {
      const touchCurrentY = e.touches[0].clientY;
      const touchDiff = touchStartY - touchCurrentY;
      
      // אם המשתמש החליק מספיק למעלה/למטה
      if (Math.abs(touchDiff) > touchThreshold) {
        if (touchDiff > 0) { // החלקה למעלה - הגדלת ערך
          handleIncrement(true);
        } else { // החלקה למטה - הקטנת ערך
          handleIncrement(false);
        }
        // הסרת מאזיני אירועים לאחר פעולה
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
      }
    };
    
    const handleTouchEnd = () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  };
  
  return (
    <div className="relative" ref={pickerRef}>
      {/* תצוגת הערך הנוכחי */}
      <div className="flex items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm overflow-hidden">
        <button
          type="button"
          onClick={() => handleIncrement(false)}
          className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 touch-manipulation"
          disabled={value <= min}
          aria-label="הפחת כמות"
        >
          <FiChevronDown size={20} />
        </button>
        
        <button
          type="button"
          className="px-4 py-3 min-w-[60px] text-center font-medium text-lg"
          onClick={() => setIsOpen(!isOpen)}
          onTouchStart={handleTouchStart}
          aria-label="פתח בורר כמויות"
        >
          {value}
        </button>
        
        <button
          type="button"
          onClick={() => handleIncrement(true)}
          className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 touch-manipulation"
          disabled={value >= max}
          aria-label="הגדל כמות"
        >
          <FiChevronUp size={20} />
        </button>
      </div>
      
      {/* בורר הכמויות */}
      {isOpen && (
        <div 
          className="absolute z-50 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-full max-h-60 overflow-y-auto"
          ref={scrollerRef}
          style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="py-2">
            {options.map((option) => (
              <div
                key={option}
                className={`py-3 px-4 text-center cursor-pointer transition-colors text-lg ${
                  option === value ? 'bg-primary-light bg-opacity-20 text-primary font-medium' : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;