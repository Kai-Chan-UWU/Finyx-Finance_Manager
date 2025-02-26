'use client';
import React, { useState, useEffect } from "react";
import { ScanLine } from "lucide-react";
import OCRProcessor from "./OCRProcessor";
import { supabase } from '@/utils/dbConfig';
import { useUser } from '@clerk/clerk-react';

function OcrReader({ onProcessComplete }) {
  const [isOcrSectionOpen, setIsOcrSectionOpen] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBudgetId, setSelectedBudgetId] = useState('');
  const { user } = useUser();
  
  // Fetch budgets when component mounts
  useEffect(() => {
    if (user && isOcrSectionOpen) {
      fetchBudgets();
    }
  }, [user, isOcrSectionOpen]);
  
  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      
      const { data, error } = await supabase
      .from('Budgets')
      .select('id, name')
      .eq('createdBy', email)
      .order('id', { ascending: false });
        
      if (error) throw error;
      setBudgets(data || []);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOcrSectionOpen(false);
    setSelectedBudgetId('');
  };
  
  const handleProcessComplete = () => {
    if (onProcessComplete) onProcessComplete();
    handleClose();
  };

  return (
    <div className="relative">
      {/* Scan Button with Animation */}
      <button
        onClick={() => setIsOcrSectionOpen(!isOcrSectionOpen)}
        className="bg-gradient-to-r from-green-400 to-green-600 rounded-full h-16 w-16 flex items-center justify-center shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
        aria-label="Scan Receipt"
      >
        <ScanLine className="text-white w-7 h-7" />
      </button>

      {/* Modal Overlay */}
      {isOcrSectionOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto transition-opacity duration-300">
          <div 
            className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] shadow-2xl transform transition-all duration-300 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <ScanLine className="text-green-500 w-6 h-6 mr-2" />
                Scan Receipt
              </h2>
              <button 
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100"
                aria-label="Close"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            
            {/* Body */}
            <div className="p-6">
              {/* Budget Selector */}
              <div className="mb-6">
                <label htmlFor="budgetSelect" className="block text-sm font-medium text-gray-700 mb-2">
                  Select Budget
                </label>
                <div className="relative">
                  <select
                    id="budgetSelect"
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white appearance-none pr-10"
                    value={selectedBudgetId}
                    onChange={(e) => setSelectedBudgetId(e.target.value)}
                    disabled={loading}
                  >
                    <option value="">-- Select Budget --</option>
                    {budgets.map((budget) => (
                      <option key={budget.id} value={budget.id}>
                        {budget.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </div>
                </div>
                {loading && (
                  <div className="flex items-center mt-2">
                    <div className="w-4 h-4 mr-2 rounded-full border-2 border-green-500 border-t-transparent animate-spin"></div>
                    <p className="text-sm text-gray-500">Loading budgets...</p>
                  </div>
                )}
              </div>
              
              {/* OCR Processor */}
              {selectedBudgetId ? (
                <OCRProcessor 
                  budgetId={selectedBudgetId}
                  onProcessComplete={handleProcessComplete}
                />
              ) : (
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-700 mb-4 flex items-start">
                  <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <span>Please select a budget to proceed with receipt scanning.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OcrReader;