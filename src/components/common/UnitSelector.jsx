import { MdLineWeight, MdLocalDrink, MdScale, MdViewModule } from "react-icons/md";

// רשימת יחידות מידה בסיסיות
const UNIT_OPTIONS = [
  { value: 'יח\'', label: 'יח׳', icon: <MdViewModule size={18} /> },
  { value: 'ק"ג', label: 'ק״ג', icon: <MdScale size={18} /> },
  { value: 'גרם', label: 'גרם', icon: <MdLineWeight size={18} /> },
  { value: 'ליטר', label: 'ל׳', icon: <MdLocalDrink size={18} /> },
  { value: 'מ"ל', label: 'מ״ל', icon: <MdLocalDrink size={18} /> },
  { value: 'חבילה', label: 'חב׳', icon: <MdViewModule size={18} /> },
  { value: 'קרטון', label: 'קרט׳', icon: <MdViewModule size={18} /> },
];


const UnitSelector = ({ value, onChange }) => {
  // פונקציה לטיפול באירועי מגע (swipe) עבור מכשירים ניידים
  const handleTouchStart = (e, unitValue) => {
    // מניעת ברירת מחדל כדי למנוע גלילה בזמן החלקה
    e.preventDefault();

    // אם המשתמש לחץ על היחידה הנוכחית, בחר אותה מיד
    if (unitValue === value) {
      onChange(unitValue);
      return;
    }

    // הגדלת אזור המגע לשיפור חווית המשתמש
    const touchTimeout = setTimeout(() => {
      onChange(unitValue);
    }, 50);

    // ניקוי הטיימר אם המשתמש מבטל את המגע
    const handleTouchEnd = () => {
      clearTimeout(touchTimeout);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd, { passive: true });
  };

  return (
    <div className="relative overflow-x-auto">
      <div className="p-1 w-full flex flex-wrap justify-center items-center">
        {UNIT_OPTIONS.map((unit) => (
          <button
            key={unit.value}
            type="button"
            onClick={() => onChange(unit.value)}
            onTouchStart={(e) => handleTouchStart(e, unit.value)}
            className={`
          flex items-center justify-center
          px-3 py-1 m-1 rounded-full text-sm transition-colors
          min-w-[60px] touch-manipulation border-2 border-primary gap-2
          ${unit.value === value
                ? 'bg-primary text-white shadow-sm'
                : 'bg-white !text-primary hover:bg-gray-100 active:bg-gray-200'
              }
        `}
            aria-label={`בחר יחידת מידה ${unit.value}`}
          >
            {unit.icon}{unit.label}
          </button>
        ))}
      </div>
    </div>

  );
};

export default UnitSelector;