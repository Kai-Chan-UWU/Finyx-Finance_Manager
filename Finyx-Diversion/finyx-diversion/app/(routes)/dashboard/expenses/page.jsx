// app/expenses/page.jsx
'use client';
import { supabase } from '@/utils/dbConfig';
import { useEffect, useState } from 'react';
import ExpenseListTable from './_components/ExpenseListTable';
import OcrReader from "./_components/OcrReader";
import { useUser } from '@clerk/clerk-react';

export default function ExpensesPage() {
  const [expensesList, setExpensesList] = useState([]);
  const { user } = useUser();

  useEffect(() => {
    user && getAllExpenses();
  }, [user]);

  const getAllExpenses = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    const { data, error } = await supabase
      .rpc('get_expenses', { email })
      .select('id, name, amount, createdAt, budgetId');

    if (error) {
      console.error('Error fetching expenses:', error);
      return;
    }

    const result = data.map(expense => ({
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      createdAt: expense.createdAt
    }));

    setExpensesList(result);
  };

  return (
    <div>
      <div className="p-10">
        <h2 className="font-bold text-3xl">My Expenses</h2>

        <ExpenseListTable
          refreshData={() => getAllExpenses()}
          expensesList={expensesList}
        />
      </div>
      <div className="fixed bottom-0 right-0 p-12">
        <OcrReader />
      </div>
    </div>
  );
}