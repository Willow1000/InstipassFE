// Payments Page Component
const PaymentsPage = ({ paymentsData, loading, error, darkMode }) => {
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
          <p>Error loading payments: {error.message}</p>
        </div>
      </div>
    );
  }

  const payments = paymentsData || [];

  return (
    <div className="space-y-6 md:space-y-8">
      <div className={`p-6 rounded-2xl shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h3 className={`text-lg font-semibold mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
          Payment History
        </h3>
        
        {payments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Transaction ID</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Amount</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Date</th>
                  <th className="p-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map(payment => (
                  <tr key={payment.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="p-3 text-sm whitespace-nowrap">{payment.transaction_id}</td>
                    <td className="p-3 text-sm whitespace-nowrap">${payment.amount}</td>
                    <td className="p-3 text-sm whitespace-nowrap">
                      {new Date(payment.created_at).toLocaleDateString()}
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        payment.status === 'completed' 
                          ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                          : payment.status === 'pending'
                          ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300'
                          : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CreditCard className={`mx-auto mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={48} />
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No payment history available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;