// כפתור פעולה מינימליסטי בדומה לתמונה שהועלתה
const ActionButton = ({ 
    icon, 
    onClick, 
    color = 'primary', 
    type = 'button',
    disabled = false 
  }) => {
    
    // מיפוי צבעים לפי סוג הכפתור
    const colorMap = {
      primary: 'text-primary hover:bg-primary-light hover:bg-opacity-10',
      danger: 'text-error hover:bg-error hover:bg-opacity-10',
      success: 'text-success hover:bg-success hover:bg-opacity-10',
      gray: 'text-gray-500 hover:bg-gray-100',
    };
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`p-2 rounded-md transition-colors ${colorMap[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {icon}
      </button>
    );
  };
  
  export default ActionButton;