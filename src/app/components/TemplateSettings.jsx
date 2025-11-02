// Template Settings Page Component with Enhanced Update Functionality
// import React, { useState, useEffect, useMemo } from 'react';
// import { Edit, Save, AlertTriangle, GraduationCap, Users, Bell, ImageIcon, Settings, QrCode, BarChart3, Calendar } from 'lucide-react';

// const SETTINGS_API_URL = '/api/settings/template/'; // Adjust if needed

const TemplateSettingsPage = ({ settingsData, loading, error, darkMode, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    qrcode: false,
    barcode: true,
    expected_total: 0,
    min_admission_year: new Date().getFullYear(),
    notification_pref: 'sms',
    template_front: '',
    template_back: ''
  });
  const [originalData, setOriginalData] = useState({});
  const [fileUploads, setFileUploads] = useState({
    template_front: null,
    template_back: null
  });

  // Get the first settings object from the array
  const settings = Array.isArray(settingsData) && settingsData.length > 0 ? settingsData[0] : null;

  // Initialize form data when settings data changes
  useEffect(() => {
    if (settings) {
      const initialData = {
        qrcode: settings.qrcode || false,
        barcode: settings.barcode || true,
        expected_total: settings.expected_total || 0,
        min_admission_year: settings.min_admission_year || new Date().getFullYear(),
        notification_pref: settings.notification_pref || 'sms',
        template_front: settings.template_front || '',
        template_back: settings.template_back || ''
      };
      setFormData(initialData);
      setOriginalData(initialData);
      setFileUploads({ template_front: null, template_back: null });
    }
  }, [settings]);

  // Detect changes: only if formData differs from originalData OR new files are uploaded
  const hasChanges = useMemo(() => {
    if (!originalData || Object.keys(originalData).length === 0) return false;

    // Check if any text/form field has changed
    const fieldChanged = Object.keys(formData).some(key => {
      if (key === 'template_front' || key === 'template_back') return false;
      return formData[key] !== originalData[key];
    });

    // Check if new files are selected (regardless of current server value)
    const fileChanged = fileUploads.template_front !== null || fileUploads.template_back !== null;

    return fieldChanged || fileChanged;
  }, [formData, originalData, fileUploads]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setSubmitError('Only JPG, PNG, or GIF files are allowed.');
      e.target.value = '';
      return;
    }

    if (file.size > maxSize) {
      setSubmitError('File size must be under 10MB.');
      e.target.value = '';
      return;
    }

    setSubmitError('');
    setFileUploads(prev => ({
      ...prev,
      [name]: file
    }));
  };

  const clearFile = (field) => {
    setFileUploads(prev => ({
      ...prev,
      [field]: null
    }));
    const input = document.querySelector(`input[name="${field}"]`);
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      setSubmitError('No changes detected');
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const method = settings ? 'PATCH' : 'POST';
      const url = settings ? `${SETTINGS_API_URL}${settings.id}/` : SETTINGS_API_URL;

      const changedFields = {};
      Object.keys(formData).forEach(key => {
        if (key === 'template_front' || key === 'template_back') return;
        if (formData[key] !== originalData[key]) {
          changedFields[key] = formData[key];
        }
      });

      const formDataToSend = new FormData();

      // Append all changed form fields
      Object.keys(changedFields).forEach(key => {
        formDataToSend.append(key, changedFields[key]);
      });

      // Append new files
      if (fileUploads.template_front) {
        formDataToSend.append('template_front', fileUploads.template_front);
      }
      if (fileUploads.template_back) {
        formDataToSend.append('template_back', fileUploads.template_back);
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          // Let browser set Content-Type for multipart
        },
        body: formDataToSend
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }

      const updatedData = await response.json();

      // Update local state with fresh data
      const newValues = {
        qrcode: updatedData.qrcode ?? false,
        barcode: updatedData.barcode ?? true,
        expected_total: updatedData.expected_total ?? 0,
        min_admission_year: updatedData.min_admission_year ?? new Date().getFullYear(),
        notification_pref: updatedData.notification_pref ?? 'sms',
        template_front: updatedData.template_front || '',
        template_back: updatedData.template_back || ''
      };

      setFormData(newValues);
      setOriginalData(newValues);
      setFileUploads({ template_front: null, template_back: null });

      // Clear file inputs
      ['template_front', 'template_back'].forEach(name => {
        const input = document.querySelector(`input[name="${name}"]`);
        if (input) input.value = '';
      });

      if (onUpdate) {
        onUpdate(); // Refresh from parent
      }

      setIsEditing(false);
    } catch (err) {
      setSubmitError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSubmitError('');
    if (settings) {
      const resetData = {
        qrcode: settings.qrcode || false,
        barcode: settings.barcode || true,
        expected_total: settings.expected_total || 0,
        min_admission_year: settings.min_admission_year || new Date().getFullYear(),
        notification_pref: settings.notification_pref || 'sms',
        template_front: settings.template_front || '',
        template_back: settings.template_back || ''
      };
      setFormData(resetData);
      setOriginalData(resetData);
    }
    setFileUploads({ template_front: null, template_back: null });
    ['template_front', 'template_back'].forEach(name => {
      const input = document.querySelector(`input[name="${name}"]`);
      if (input) input.value = '';
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
        <div className="flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          <p>Error loading template settings: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Template Settings
          </h3>
          {settings && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
            >
              <Edit size={16} className="mr-2" />
              Update Settings
            </button>
          )}
        </div>

        {submitError && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm">
            {submitError}
          </div>
        )}

        {settings || isEditing ? (
          isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Minimum Admission Year
                  </label>
                  <input
                    type="number"
                    name="min_admission_year"
                    value={formData.min_admission_year}
                    onChange={handleInputChange}
                    min="2000"
                    max="2050"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Expected Students
                  </label>
                  <input
                    type="number"
                    name="expected_total"
                    value={formData.expected_total}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                    }`}
                    required
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Notification Preference
                  </label>
                  <select
                    name="notification_pref"
                    value={formData.notification_pref}
                    onChange={handleInputChange}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white' 
                        : 'bg-white border-gray-300 text-gray-900'
                    }`}
                  >
                    <option value="sms">SMS</option>
                    <option value="email">Email</option>
                    <option value="both">Both SMS & Email</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Template Front Image
                  </label>
                  {settings?.template_front && (
                    <div className="mb-3">
                      <img 
                        src={settings.template_front} 
                        alt="Current Template Front" 
                        className="w-96 h-48 object-cover border rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400" style={{ display: 'none' }}>
                        Failed to load image
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current front template
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="template_front"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                        : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Upload new front template image (JPG, PNG, GIF - Max 10MB)
                  </p>
                  {fileUploads.template_front && (
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-teal-600 dark:text-teal-400">Selected: {fileUploads.template_front.name}</span>
                      <button
                        type="button"
                        onClick={() => clearFile('template_front')}
                        className="ml-2 text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Template Back Image
                  </label>
                  {settings?.template_back && (
                    <div className="mb-3">
                      <img 
                        src={settings.template_back} 
                        alt="Current Template Back" 
                        className="w-96 h-48 object-cover border rounded-lg"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          const fallback = e.target.nextSibling;
                          if (fallback) fallback.style.display = 'block';
                        }}
                      />
                      <div className="text-xs mt-1 text-gray-500 dark:text-gray-400" style={{ display: 'none' }}>
                        Failed to load image
                      </div>
                      <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Current back template
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    name="template_back"
                    onChange={handleFileChange}
                    accept="image/*"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent ${
                      darkMode 
                        ? 'bg-gray-700 border-gray-600 text-white file:bg-gray-600 file:text-white file:border-0 file:rounded file:px-3 file:py-1 file:mr-3' 
                        : 'bg-white border-gray-300 text-gray-900 file:bg-gray-100 file:text-gray-700 file:border-0 file:rounded file:px-3 file:py-1 file:mr-3'
                    }`}
                  />
                  <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Upload new back template image (JPG, PNG, GIF - Max 10MB)
                  </p>
                  {fileUploads.template_back && (
                    <div className="flex items-center mt-1 text-xs">
                      <span className="text-teal-600 dark:text-teal-400">Selected: {fileUploads.template_back.name}</span>
                      <button
                        type="button"
                        onClick={() => clearFile('template_back')}
                        className="ml-2 text-red-500 hover:underline"
                      >
                        Clear
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="qrcode"
                    name="qrcode"
                    checked={formData.qrcode}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="qrcode" className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enable QR Code on ID Cards
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="barcode"
                    name="barcode"
                    checked={formData.barcode}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 dark:focus:ring-teal-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  />
                  <label htmlFor="barcode" className={`ml-2 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Enable Barcode on ID Cards
                  </label>
                </div>
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
                      Update Settings
                    </>
                  )}
                </button>
              </div>

              {hasChanges && (
                <div className="mt-2 text-xs text-teal-600 dark:text-teal-400">
                  Changes detected — submit button enabled
                </div>
              )}
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <GraduationCap className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Minimum Admission Year</p>
                  <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {settings.min_admission_year}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Users className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Expected Students</p>
                  <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {settings.expected_total != null ? settings.expected_total.toLocaleString() : 0}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Bell className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Notification Preference</p>
                  <p className={`text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {settings.notification_pref === 'sms' ? 'SMS' : 
                     settings.notification_pref === 'email' ? 'Email' :
                     settings.notification_pref === 'both' ? 'Both SMS & Email' : 'None'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {settings.template_front && (
                  <div className="flex items-start space-x-3">
                    <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Template Front</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <img 
                          src={settings.template_front} 
                          alt="Template Front" 
                          className="w-96 h-48 object-cover border rounded"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <a 
                          href={settings.template_front} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          View Template
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {settings.template_back && (
                  <div className="flex items-start space-x-3">
                    <ImageIcon className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                    <div>
                      <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Template Back</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <img 
                          src={settings.template_back} 
                          alt="Template Back" 
                          className="w-96 h-48 object-cover border rounded"
                          onError={(e) => (e.target.style.display = 'none')}
                        />
                        <a 
                          href={settings.template_back} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-sm text-teal-600 dark:text-teal-400 hover:underline"
                        >
                          View Template
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-start space-x-3">
                <Settings className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>ID Card Features</p>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <QrCode size={16} className={`${settings.qrcode ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        QR Code: {settings.qrcode ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BarChart3 size={16} className={`${settings.barcode ? 'text-green-600 dark:text-green-400' : 'text-gray-400'}`} />
                      <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Barcode: {settings.barcode ? 'Enabled' : 'Disabled'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Calendar className="text-teal-600 dark:text-teal-400 mt-1" size={18} />
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Last Updated</p>
                  <p className={`text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {settings.updated_at ? new Date(settings.updated_at).toLocaleString() : 'Never'}
                  </p>
                </div>
              </div>
            </div>
          )
        ) : (
          <div className="text-center py-8 flex flex-col gap-7">
            <div>
              <Settings className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Template settings not available
              </p>
            </div>
            <div className="text-center">
              <button
                onClick={() => setIsEditing(true)}
                className="px-8 bg-teal-600 hover:bg-teal-700 py-3 rounded-lg text-white font-semibold shadow-md transition-all duration-300"
              >
                Register Settings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemplateSettingsPage;