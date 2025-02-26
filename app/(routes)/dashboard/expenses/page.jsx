'use client';
import { supabase } from '@/utils/dbConfig';
import { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import OcrReader from "./_components/OcrReader";
import { useUser } from '@clerk/clerk-react';
import { Receipt, Filter, RefreshCw } from 'lucide-react';

export default function ExpensesPage() {
  const [expensesList, setExpensesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      getAllExpenses();
    }
  }, [user]);

  const getAllExpenses = async () => {
    try {
      setLoading(true);
      const email = user?.primaryEmailAddress?.emailAddress;
      
      if (!email) {
        console.error('User email not found');
        return;
      }

      // First, get the budget IDs that belong to this user
      const { data: budgets, error: budgetError } = await supabase
        .from('Budgets')
        .select('id')
        .eq('createdBy', email);
        
      if (budgetError) {
        console.error('Error fetching user budgets:', budgetError);
        return;
      }
      
      // Extract the budget IDs
      const userBudgetIds = budgets.map(budget => budget.id);
      
      // Now fetch expenses that belong to these budgets
      const { data, error } = await supabase
        .from('Expenses')
        .select('id, name, amount, createdAt, budgetId')
        .in('budgetId', userBudgetIds.length > 0 ? userBudgetIds : [0]); // Use [0] as fallback to get no results if no budgets

      if (error) {
        console.error('Error fetching expenses:', error);
        return;
      }

      const result = data.map(expense => ({
        id: expense.id,
        name: expense.name,
        amount: expense.amount,
        createdAt: expense.createdAt,
        budgetId: expense.budgetId
      }));

      setExpensesList(result);
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await getAllExpenses();
    setTimeout(() => setRefreshing(false), 500); // Show refresh animation for at least 500ms
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header Section */}
        <div className="mb-6 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
            <div className="flex items-center">
              <Receipt className="h-8 w-8 text-green-500 mr-3" />
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">My Expenses</h1>
            </div>
            
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                className={`flex items-center justify-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all ${refreshing ? 'animate-pulse' : ''}`}
                disabled={loading || refreshing}
                title="Refresh expenses"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button className="flex items-center justify-center p-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all" title="Filter expenses">
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Stats Summary */}
          {!loading && expensesList.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <p className="text-xs text-green-700 font-medium">Total Expenses</p>
                <p className="text-xl font-bold text-green-800">
                  ${expensesList.reduce((sum, expense) => sum + Number(expense.amount), 0).toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-xs text-blue-700 font-medium">This Month</p>
                <p className="text-xl font-bold text-blue-800">
                  ${expensesList
                    .filter(expense => {
                      const date = new Date(expense.createdAt);
                      const now = new Date();
                      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                    })
                    .reduce((sum, expense) => sum + Number(expense.amount), 0)
                    .toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <p className="text-xs text-purple-700 font-medium">Expense Count</p>
                <p className="text-xl font-bold text-purple-800">{expensesList.length}</p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-700 font-medium">Average Expense</p>
                <p className="text-xl font-bold text-amber-800">
                  ${expensesList.length > 0 
                    ? (expensesList.reduce((sum, expense) => sum + Number(expense.amount), 0) / expensesList.length).toFixed(2) 
                    : '0.00'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 relative">
          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 rounded-xl flex items-center justify-center z-10">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                <p className="text-gray-600">Loading expenses...</p>
              </div>
            </div>
          )}
          
          {/* Expenses Table */}
          {expensesList.length > 0 ? (
            <ExpenseListTable expenses={expensesList} refreshData={getAllExpenses} />
          ) : !loading && (
            <div className="text-center py-16">
              <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Expenses Yet</h3>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                Start tracking your expenses by adding them manually or scanning a receipt.
              </p>
            </div>
          )}
        </div>
        
        {/* Floating OCR Button */}
        <div className="fixed bottom-6 right-6 z-20">
          <OcrReader onProcessComplete={getAllExpenses} />
        </div>
      </div>
    </div>
  );
}