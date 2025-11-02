export const metadata= {
  title: 'Invalid Request',
  description:"Student Registration Failed"
};

import React from 'react';
import { AlertTriangle, ArrowLeft, RefreshCw } from 'lucide-react';

const InvalidRequest = () => {
  const handleGoBack = () => {
    window.history.back();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Request</h1>
          <p className="text-gray-600 leading-relaxed">
            The request you made is invalid or malformed. Please check your input and try again.
          </p>
        </div>

        <div className="space-y-3">
         
          
       
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            If this problem persists, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvalidRequest;