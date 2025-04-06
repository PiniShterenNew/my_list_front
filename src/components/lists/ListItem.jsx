import { useState } from 'react';
import { FiEdit2, FiTrash2, FiCheck } from 'react-icons/fi';
import { listItemAPI } from '../../services/api';
import QuantitySelector from '../common/QuantitySelector';
import UnitSelector from '../common/UnitSelector';
import ActionButton from '../common/ActionButton';

const ListItem = ({ item, listId, onUpdate, onDelete }) => {
  const [isChecked, setIsChecked] = useState(item.isChecked);
  const [isEditing, setIsEditing] = useState(false);
  const [quantity, setQuantity] = useState(item.quantity);
  const [loading, setLoading] = useState(false);

  // פונקציה לשינוי סטטוס "נרכש"
  const handleToggleCheck = async () => {
    setLoading(true);
    try {
      const newCheckedState = !isChecked;
      const response = await listItemAPI.toggleItemCheck(listId, item._id, newCheckedState);
      setIsChecked(newCheckedState);
      onUpdate({ ...item, isChecked: newCheckedState, checkedAt: newCheckedState ? new Date().toISOString() : null });
    } catch (error) {
      console.error('שגיאה בשינוי סטטוס הפריט:', error);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה לשינוי כמות הפריט
  const handleQuantityChange = async (newQuantity) => {
    if (newQuantity <= 0) return;
    
    setLoading(true);
    try {
      const updatedItem = { ...item, quantity: newQuantity };
      await listItemAPI.updateItem(listId, item._id, updatedItem);
      setQuantity(newQuantity);
      onUpdate({ ...item, quantity: newQuantity });
    } catch (error) {
      console.error('שגיאה בעדכון כמות הפריט:', error);
    } finally {
      setLoading(false);
    }
  };
  
  // פונקציה לשינוי יחידת המידה
  const handleUnitChange = async (newUnit) => {
    setLoading(true);
    try {
      const updatedItem = { ...item, unit: newUnit };
      await listItemAPI.updateItem(listId, item._id, updatedItem);
      onUpdate({ ...item, unit: newUnit });
    } catch (error) {
      console.error('שגיאה בעדכון יחידת המידה:', error);
    } finally {
      setLoading(false);
    }
  };

  // פונקציה למחיקת פריט
  const handleDelete = async () => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק פריט זה?')) {
      setLoading(true);
      try {
        await listItemAPI.deleteItem(listId, item._id);
        onDelete(item._id);
      } catch (error) {
        console.error('שגיאה במחיקת הפריט:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // עיצוב מותנה לפי סטטוס הפריט
  const itemClasses = `
    flex items-center p-3 border-b border-gray-100 last:border-0 transition-colors
    ${isChecked ? 'bg-gray-50' : 'bg-white'}
    ${loading ? 'opacity-60' : ''}
  `;

  const textClasses = `
    flex-1 mr-3
    ${isChecked ? 'line-through text-gray-400' : 'text-gray-700'}
  `;

  return (
    <div className={itemClasses}>
      {/* צ'קבוקס */}
      <div className="mr-2">
        <ActionButton
          icon={isChecked ? <FiCheck size={18} /> : null}
          onClick={handleToggleCheck}
          disabled={loading}
          color={isChecked ? "success" : "gray"}
        />
      </div>

      {/* פרטי הפריט */}
      <div className={textClasses}>
        <div className="font-medium">{item.name}</div>
        {item.category && (
          <div className="text-xs text-gray-500">{item.category.main}</div>
        )}
      </div>

      {/* יחידת מידה וכמות */}
      <div className="flex items-center">
        {/* בורר כמות */}
        {isEditing ? (
          <div className="ml-2" style={{ width: '80px' }}>
            <QuantitySelector 
              value={quantity} 
              onChange={handleQuantityChange}
            />
          </div>
        ) : (
          <span className="ml-2 min-w-[40px] text-center font-medium">
            {quantity}
          </span>
        )}

        {/* יחידת מידה */}
        <div className="ml-2">
          {isEditing ? (
            <UnitSelector
              value={item.unit}
              onChange={(value) => handleUnitChange(value)}
            />
          ) : (
            <span className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-500">
              {item.unit}
            </span>
          )}
        </div>

        {/* פעולות */}
        <div className="flex">
          <ActionButton
            icon={<FiEdit2 size={18} />}
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
            color="gray"
          />
          <ActionButton
            icon={<FiTrash2 size={18} />}
            onClick={handleDelete}
            disabled={loading}
            color="danger"
          />
        </div>
      </div>
    </div>
  );
};

export default ListItem;