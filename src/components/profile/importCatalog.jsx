import { useState } from 'react';
import { FiUpload, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import Button from '../common/Button';

const ImportCatalog = ({ onCatalogImport }) => {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError('');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('נא לבחור קובץ JSON');
      return;
    }

    setIsProcessing(true);
    setError('');
    setResult(null);

    try {
      // קריאת הקובץ
      const fileReader = new FileReader();
      fileReader.onload = (event) => {
        try {
          // המרת תוכן הקובץ למערך אובייקטים
          const jsonData = JSON.parse(event.target.result);
          
          // וידוא שהקובץ הוא מערך של אובייקטים
          if (!Array.isArray(jsonData)) {
            setError('הקובץ אינו בפורמט תקין. נדרש מערך של אובייקטים.');
            setIsProcessing(false);
            return;
          }
          
          // המרת המוצרים לפורמט של האפליקציה
          const convertedProducts = convertCatalog(jsonData);
          
          // הצגת סיכום למשתמש
          setResult({
            totalProducts: jsonData.length,
            convertedProducts: convertedProducts.length,
            sample: convertedProducts.slice(0, 3) // דגימה של 3 מוצרים ראשונים
          });
          
          // העברת התוצאה לקומפוננטת האב
          if (onCatalogImport) {
            onCatalogImport(convertedProducts);
          }
        } catch (error) {
          console.error('שגיאה בהמרת הקובץ:', error);
          setError('הקובץ אינו בפורמט JSON תקין.');
        } finally {
          setIsProcessing(false);
        }
      };
      
      fileReader.onerror = () => {
        setError('שגיאה בקריאת הקובץ. נא לנסות שוב.');
        setIsProcessing(false);
      };
      
      fileReader.readAsText(file);
    } catch (err) {
      console.error('שגיאה בתהליך הייבוא:', err);
      setError('אירעה שגיאה בעת ייבוא הקובץ.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-large shadow-card p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">ייבוא קטלוג מוצרים</h3>
      <p className="text-gray-600 mb-6">
        באפשרותך לייבא את רשימת המוצרים שלך מקובץ JSON. המערכת תזהה אוטומטית את הקטגוריות והיחידות המתאימות לכל מוצר.
      </p>
      
      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 bg-gray-50">
        <input
          type="file"
          id="catalog-file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <div className="text-center mb-4">
          <FiUpload className="mx-auto text-gray-400 mb-2" size={36} />
          <p className="text-gray-500 mb-1">גרור קובץ לכאן או</p>
          <label
            htmlFor="catalog-file"
            className="text-primary cursor-pointer font-medium hover:underline"
          >
            בחר קובץ
          </label>
        </div>
        
        {file && (
          <div className="text-sm bg-primary-light bg-opacity-20 text-primary-dark px-3 py-1 rounded-full">
            {file.name}
          </div>
        )}
      </div>
      
      {error && (
        <div className="flex items-center p-3 mb-4 bg-error bg-opacity-10 text-error rounded-normal">
          <FiAlertCircle className="ml-2 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      <Button
        onClick={handleImport}
        loading={isProcessing}
        disabled={!file || isProcessing}
        fullWidth
        icon={<FiUpload />}
      >
        ייבא קטלוג
      </Button>
      
      {result && (
        <div className="mt-4 p-4 border border-success bg-success bg-opacity-10 rounded-normal">
          <div className="flex items-center mb-2 text-success">
            <FiCheckCircle className="ml-2" />
            <span className="font-medium">הייבוא הושלם בהצלחה!</span>
          </div>
          
          <div className="text-gray-700">
            <p>יובאו {result.convertedProducts} מתוך {result.totalProducts} מוצרים.</p>
            
            {result.sample.length > 0 && (
              <div className="mt-3">
                <p className="font-medium mb-2">דוגמאות מהקטלוג:</p>
                <ul className="text-sm">
                  {result.sample.map((product, index) => (
                    <li key={index} className="mb-1">
                      <span className="font-medium">{product.name}</span> - קטגוריה: {product.category.main}, יחידת מידה: {product.defaultUnit}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportCatalog;