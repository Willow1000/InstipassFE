const InstitutionDetailsPopup = ({ institutionData, isOpen, onClose, darkMode, onUpdate }) => {
  const institution = Array.isArray(institutionData) ? institutionData[0] : institutionData;
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    county: '',
    region: '',
    email: '',
    tel: '',
    address: '',
    web_url: '',
    admin_email: '',
    admin_tell: '',
    logo: null // Changed to handle file object
  });
  const [originalData, setOriginalData] = useState({});

  // Initialize form data when institution data changes
  useEffect(() => {
    if (institution) {
      const initialData = {
        name: institution.name || '',
        county: institution.county || '',
        region: institution.region || '',
        email: institution.email || '',
        tel: institution.tel || '',
        address: institution.address || '',
        web_url: institution.web_url || '',
        admin_email: institution.admin_email || '',
        admin_tell: institution.admin_tell || '',
        logo: null // File object will be null initially
      };
      setFormData(initialData);
      setOriginalData({
        ...initialData,
        logo_url: institution.logo || '' // Store original logo URL separately
      });
    }
  }, [institution]);

  // Function to detect if any changes have been made
  const hasChanges = useMemo(() => {
    if (!originalData.name) return false; // No original data yet
    
    // Check text fields for changes
    const textFieldsChanged = Object.keys(formData).some(key => {
      if (key === 'logo') return false; // Handle logo separately
      return formData[key] !== originalData[key];
    });
    
    // Check if logo file has been selected
    const logoChanged = formData.logo !== null;
    
    return textFieldsChanged || logoChanged;
  }, [formData, originalData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({
      ...prev,
      logo: file
    }));
  };

  // Function to get only changed fields for submission
  const getChangedFields = () => {
    const changedFields = {};
    
    // Check text fields for changes
    Object.keys(formData).forEach(key => {
      if (key === 'logo') return; // Handle logo separately
      if (formData[key] !== originalData[key]) {
        changedFields[key] = formData[key];
      }
    });
    
    return changedFields;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!hasChanges) {
      setError('No changes detected');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const changedFields = getChangedFields();
      const hasLogoChange = formData.logo !== null;
      
      let response;

      // Always use FormData for consistency, whether logo is changed or not
      const formDataToSend = new FormData();
      
      // Add changed text fields
      Object.keys(changedFields).forEach(key => {
        formDataToSend.append(key, changedFields[key]);
      });
      
      // Add logo if changed
      if (hasLogoChange) {
        formDataToSend.append('logo', formData.logo);
      }

      response = await fetch(`${INSTITUTION_API_URL}/${institution.id}/`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const updatedData = await response.json();

      // Reset form state
      const newOriginalData = {
        name: updatedData.name || '',
        county: updatedData.county || '',
        region: updatedData.region || '',
        email: updatedData.email || '',
        tel: updatedData.tel || '',
        address: updatedData.address || '',
        web_url: updatedData.web_url || '',
        admin_email: updatedData.admin_email || '',
        admin_tell: updatedData.admin_tell || '',
        logo_url: updatedData.logo || ''
      };
      
      setFormData({
        ...newOriginalData,
        logo: null
      });
      setOriginalData(newOriginalData);

      // Clear file input
      const logoInput = document.querySelector('input[name="logo"]');
      if (logoInput) logoInput.value = '';

      if (onUpdate) {
        onUpdate();
      }

      setIsEditing(false);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    if (institution) {
      const resetData = {
        name: institution.name || '',
        county: institution.county || '',
        region: institution.region || '',
        email: institution.email || '',
        tel: institution.tel || '',
        address: institution.address || '',
        web_url: institution.web_url || '',
        admin_email: institution.admin_email || '',
        admin_tell: institution.admin_tell || '',
        logo: null
      };
      setFormData(resetData);
      setOriginalData({
        ...resetData,
        logo_url: institution.logo || ''
      });
    }
    
    // Clear file input
    const logoInput = document.querySelector('input[name="logo"]');
    if (logoInput) logoInput.value = '';
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl max-w-md w-full max-h-[80vh] overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={`p-6 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'} flex items-center`}>
                <Building className="mr-2 text-teal-600 dark:text-teal-400" size={24} />
                Institution Details
              </h3>
              <div className="flex items-center space-x-2">
                {!isEditing && institution && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                    title="Edit Details"
                  >
                    <Edit size={20} />
                  </button>
                )}
                <button 
                  onClick={onClose}
                  className={`p-1 rounded-md ${darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {error && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
                {error}
              </div>
            )}

            {institution ? (
              isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Institution Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                      required
                    />
                  </div>

                  {/* Institution Logo Upload */}
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Institution Logo
                    </label>
                    {originalData.logo_url && (
                      <div className="mb-3">
                        <img 
                          src={originalData.logo_url} 
                          alt="Current Institution Logo" 
                          className="w-32 h-32 object-cover border rounded-lg"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Current logo</p>
                      </div>
                    )}
                    <input
                      type="file"
                      name="logo"
                      onChange={handleLogoChange}
                      accept="image/*"
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                          : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                      }`}
                    />
                    <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      Upload new logo image (JPG, PNG, GIF - Max 10MB)
                    </p>
                    {formData.logo && (
                      <p className={`text-xs mt-1 text-teal-600 dark:text-teal-400`}>
                        Selected: {formData.logo.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        County
                      </label>
                      <input
                        type="text"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                    <div>
                      <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        Region
                      </label>
                      <input
                        type="text"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                          darkMode 
                            ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="tel"
                      value={formData.tel}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Address
                    </label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      rows={3}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Website URL
                    </label>
                    <input
                      type="url"
                      name="web_url"
                      value={formData.web_url}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Admin Email
                    </label>
                    <input
                      type="email"
                      name="admin_email"
                      value={formData.admin_email}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      Admin Phone
                    </label>
                    <input
                      type="tel"
                      name="admin_tell"
                      value={formData.admin_tell}
                      onChange={handleInputChange}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                        darkMode 
                          ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                          : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                      }`}
                    />
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        darkMode 
                          ? 'bg-gray-600 text-white hover:bg-gray-700' 
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        hasChanges && !isSubmitting
                          ? 'bg-teal-600 text-white hover:bg-teal-700' 
                          : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                      }`}
                      disabled={!hasChanges || isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save size={16} className="mr-2" />
                          Update Details
                        </>
                      )}
                    </button>
                  </div>
                  
                  {/* Change indicator */}
                  {hasChanges && (
                    <div className="mt-2 text-xs text-teal-600 dark:text-teal-400">
                      Changes detected - submit button enabled
                    </div>
                  )}
                </form>
              ) : (
                <div className="space-y-4">
                  {institution.logo && (
                    <div className="flex items-start space-x-3">
                      <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Institution Logo</p>
                        <img 
                          src={institution.logo} 
                          alt="Institution Logo" 
                          className="w-32 h-32 object-cover border rounded-lg mt-1"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <Building className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Institution Name</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Location</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {[institution.county, institution.region].filter(Boolean).join(', ') || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Mail className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Email</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <Phone className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Phone</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.tel || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Address</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.address || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  {institution.web_url && (
                    <div className="flex items-start space-x-3">
                      <Globe className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                      <div>
                        <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Website</p>
                        <a 
                          href={institution.web_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-base text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          {institution.web_url}
                        </a>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-start space-x-3">
                    <User className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Admin Contact</p>
                      <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {institution.admin_email || 'N/A'}
                        {institution.admin_tell && ` • ${institution.admin_tell}`}
                      </p>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <Building className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Institution details not available
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstitutionDetailsPopup;