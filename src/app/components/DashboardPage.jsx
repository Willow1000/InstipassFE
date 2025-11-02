// Dashboard Page Component - MODIFIED TO USE SETTINGS DATA
const DashboardPage = ({ students, loading, error, darkMode, refreshData, settingsData, settingsLoading }) => {
  const [searchName, setSearchName] = useState('');
  const [searchRegNo, setSearchRegNo] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const debouncedSetSearchName = useCallback(debounce(setSearchName, 300), []);
  const debouncedSetSearchRegNo = useCallback(debounce(setSearchRegNo, 300), []);

  // Calculate summary stats - MODIFIED TO USE SETTINGS DATA
  const summaryStats = useMemo(() => {
    if (!students) {
      return {
        totalSubmitted: 0,
        pending: 0,
        processing: 0,
        ready: 0,
        expected: 0
      };
    }

    const totalSubmitted = students.length;
    const pending = students.filter(s => s.status === 'pending').length;
    const processing = students.filter(s => s.status === 'processing').length;
    const ready = students.filter(s => s.status === 'ready' || s.status === 'id_ready').length;
    
    // Get expected total from settings data
    const settings = Array.isArray(settingsData) && settingsData.length > 0 ? settingsData[0] : null;
    const expected = settings?.expected_total || 0;

    return { totalSubmitted, pending, processing, ready, expected };
  }, [students, settingsData]);

  // Filter students based on search and status
  const filteredStudents = useMemo(() => {
    if (!students) return [];
    
    return students.filter(student => {
      const nameMatch = searchName === '' || 
        `${student.first_name} ${student.last_name}`.toLowerCase().includes(searchName.toLowerCase());
      const regNoMatch = searchRegNo === '' || 
        student.reg_no.toLowerCase().includes(searchRegNo.toLowerCase());
      const statusMatch = filterStatus === 'all' || student.status === filterStatus;
      
      return nameMatch && regNoMatch && statusMatch;
    });
  }, [students, searchName, searchRegNo, filterStatus]);

  const getStatusInfo = (status) => {
    return statusMap[status] || statusMap.default;
  };

  const resultCount = filteredStudents.length;
  const hasFilters = searchName || searchRegNo || filterStatus !== 'all';

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Summary Cards - MODIFIED TO USE SETTINGS DATA */}
        
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
         <StatCard 
          title="Expected Total" 
          value={settingsLoading ? '...' : summaryStats.expected.toLocaleString()} 
          icon={<Clock />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Total Students Submitted" 
          value={loading ? '...' : summaryStats.totalSubmitted.toLocaleString()} 
          icon={<Users />} 
          darkMode={darkMode} 
        />
     
        <StatCard 
          title="Processing" 
          value={loading ? '...' : summaryStats.processing.toLocaleString()} 
          icon={<Activity />} 
          darkMode={darkMode} 
        />
        <StatCard 
          title="Ready for Delivery" 
          value={loading ? '...' : summaryStats.ready.toLocaleString()} 
          icon={<CheckCircle />} 
          darkMode={darkMode} 
        />
      </div>

      {/* Student Submissions Table */}
      <div className={`p-4 md:p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 ">
          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Student Submissions
          </h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
              <input
                type="text"
                placeholder="Search by name..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-48 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                onChange={(e) => debouncedSetSearchName(e.target.value)}
              />
            </div>
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
              <input
                type="text"
                placeholder="Search by reg no..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent w-full sm:w-48 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                onChange={(e) => debouncedSetSearchRegNo(e.target.value)}
              />
            </div>
            <div className="relative">
              <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={16} />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className={`pl-10 pr-8 py-2 border rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none w-full sm:w-40 ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white' 
                    : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready">Ready</option>
                <option value="id_ready">Ready</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400' : 'text-gray-500'} pointer-events-none`} size={16} />
            </div>
            
          </div>
        </div>

        {/* Results summary */}
        <div className={`mb-4 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {hasFilters ? (
            <span>Showing {resultCount} of {students?.length || 0} students</span>
          ) : (
            <span>Total: {students?.length || 0} students</span>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-teal-500"></div>
          </div>
        ) : error ? (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300">
            <div className="flex items-center">
              <AlertTriangle className="mr-2" size={20} />
              <p>Error loading students: {error.message}</p>
            </div>
          </div>
        ) : filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
           <table className="w-full min-w-[600px]">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Student Name</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Registration Number</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Submission Date</th>
                <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan="4" className="p-4 text-center">
                    <div className="flex justify-center items-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-teal-500 mr-3"></div>
                      <span>Loading student data...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents && filteredStudents.length > 0 ? filteredStudents.map(student => (
                <tr key={student.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                  <td className="p-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <img 
                        src={student.photo || `https://i.pravatar.cc/40?u=${student.id}`} 
                        alt={`${student.first_name} ${student.last_name}`} 
                        className="w-8 h-8 rounded-full object-cover mr-3" 
                      />
                      <span className="text-sm font-medium">{student.first_name} {student.last_name}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm whitespace-nowrap">{student.reg_no}</td>
                  <td className="p-3 text-sm whitespace-nowrap">
                    {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="p-3 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusInfo(student.status).colorClass}`}>
                      {getStatusInfo(student.status).icon}
                      <span className="ml-1">{getStatusInfo(student.status).label}</span>
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="p-8 text-center">
                    <Users className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {hasFilters ? 'No students match your search criteria' : 'No student submissions found'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <Users className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {hasFilters ? 'No students match your search criteria' : 'No student submissions found'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;