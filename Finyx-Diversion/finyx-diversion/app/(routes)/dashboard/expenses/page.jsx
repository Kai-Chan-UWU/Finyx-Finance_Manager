"use client"
import { supabase } from '@/utils/dbConfig';
// import { Budgets, Expenses } from '@/utils/schema';
// import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import ExpenseListTable from './_components/ExpenseListTable';
import { useUser } from '@clerk/nextjs';

function ExpensesScreen() {

  const [expensesList,setExpensesList]=useState([]);
    const {user}=useUser();

    useEffect(()=>{
        user&&getAllExpenses();
      },[user])
    /**
   * Used to get All expenses belong to users
   */
  // const getAllExpenses=async()=>{
  //   const result=await db.select({
  //     id:Expenses.id,
  //     name:Expenses.name,
  //     amount:Expenses.amount,
  //     createdAt:Expenses.createdAt
  //   }).from(Budgets)
  //   .rightJoin(Expenses,eq(Budgets.id,Expenses.budgetId))
  //   .where(eq(Budgets.createdBy,user?.primaryEmailAddress.emailAddress))
  //   .orderBy(desc(Expenses.id));
  //   setExpensesList(result);
  // }

const getAllExpenses = async () => {
  const email = user?.primaryEmailAddress?.emailAddress;

  // Supabase query using the stored function
  const { data, error } = await supabase
    .rpc('get_expenses', { email })
    .select('id, name, amount, createdAt, budgetId');

  if (error) {
    console.error('Error fetching expenses:', error);
    return;
  }

  // Map the results
  const result = data.map(expense => ({
    id: expense.id,
    name: expense.name,
    amount: expense.amount,
    createdAt: expense.createdAt
  }));

  setExpensesList(result);
};
  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl'>My Expenses</h2>

        <ExpenseListTable refreshData={()=>getAllExpenses()}
        expensesList={expensesList}
        />
    </div>
  )
}

export default ExpensesScreen