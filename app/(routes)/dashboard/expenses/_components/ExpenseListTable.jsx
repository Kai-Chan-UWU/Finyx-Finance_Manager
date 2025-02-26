import { supabase } from "@/utils/dbConfig";
import { Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function ExpenseListTable({ expenses = [], refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const { error } = await supabase
        .from('Expenses')
        .delete()
        .eq('id', expense.id);

      if (error) throw error;

      toast.success('Expense Deleted!');
      refreshData();
    } catch (error) {
      console.error('Error deleting expense:', error);
      toast.error('Failed to delete expense');
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">All Expenses</h2>
      <div className="grid grid-cols-4 rounded-tl-xl rounded-tr-xl bg-emerald-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expenses && expenses.length > 0 ? (
        expenses.map((expense, index) => (
          <div key={expense.id || index} className="grid grid-cols-4 bg-slate-50 rounded-bl-xl rounded-br-xl p-2">
            <h2>{expense.name}</h2>
            <h2>${Number(expense.amount).toFixed(2)}</h2>
            <h2>{new Date(expense.createdAt).toLocaleDateString()}</h2>
            <h2
              onClick={() => deleteExpense(expense)}
              className="text-red-500 cursor-pointer"
            >
              Delete
            </h2>
          </div>
        ))
      ) : (
        <div className="p-4 text-center bg-slate-50 rounded-bl-xl rounded-br-xl">
          No expenses found
        </div>
      )}
    </div>
  );
}

export default ExpenseListTable;