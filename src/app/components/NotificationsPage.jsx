const NotificationsPage = ({ notificationsData, loading, error, darkMode, institutionData }) => {
  const [showReportForm, setShowReportForm] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

  const handleReportSuccess = () => {
    setShowSuccessNotification(true);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'info':
        return <Info className="text-blue-600 dark:text-blue-400" size={20} />;
      case 'warning':
        return <AlertTriangle className="text-yellow-600 dark:text-yellow-400" size={20} />;
      case 'error':
        return <X className="text-red-600 dark:text-red-400" size={20} />;
      case 'success':
        return <CheckCircle className="text-green-600 dark:text-green-400" size={20} />;
      default:
        return <Bell className="text-gray-600 dark:text-gray-400" size={20} />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'info':
        return 'border-blue-500 bg-blue-50 dark:bg-blue-900/20';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      case 'error':
        return 'border-red-500 bg-red-50 dark:bg-red-900/20';
      case 'success':
        return 'border-green-500 bg-green-50 dark:bg-green-900/20';
      default:
        return 'border-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
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
          <p>Error loading notifications: {error.message}</p>
        </div>
      </div>
    );
  }

  const notifications = notificationsData || [];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Success Notification */}
      <SuccessNotification 
        isVisible={showSuccessNotification}
        onClose={() => setShowSuccessNotification(false)}
        message="Issue reported successfully! We'll get back to you soon."
      />

      {/* Report Issue Form */}
      <ReportIssueForm 
        isOpen={showReportForm}
        onClose={() => setShowReportForm(false)}
        darkMode={darkMode}
        institutionData={institutionData}
        onSuccess={handleReportSuccess}
      />

      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Notifications
          </h3>
          <button
            onClick={() => setShowReportForm(true)}
            className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center"
          >
            <Flag size={16} className="mr-2" />
            Report Issue
          </button>
        </div>
        
        {notifications.length > 0 ? (
          <div className="space-y-4 flex flex-col-reverse">
            {notifications.map((notification, index) => (
              <div 
                key={notification.id || index} 
                className={`p-4 border-l-4 rounded-r-lg ${getNotificationColor(notification.type)}`}
              >
                <div className="flex items-start space-x-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1">
                    <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {notification.title || 'Notification'}
                    </h4>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {notification.message}
                    </p>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Bell className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No notifications available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;