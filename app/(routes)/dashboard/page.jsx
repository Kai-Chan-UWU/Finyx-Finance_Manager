"use client";
import React, { useEffect, useState } from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import CardInfo from "./_components/CardInfo";
import { supabase } from "@/utils/dbConfig";
// import { desc, eq, getTableColumns, sql } from "drizzle-orm";
// import { Budgets, Expenses, Incomes } from "@/utils/schema";
import BarChartDashboard from "./_components/BarChartDashboard";
import BudgetItem from "./budgets/_components/BudgetItem";
import ExpenseListTable from "./expenses/_components/ExpenseListTable";
function Dashboard() {
  const { user } = useUser();

  const [budgetList, setBudgetList] = useState([]);
  const [incomeList, setIncomeList] = useState([]);
  const [expensesList, setExpensesList] = useState([]);
  useEffect(() => {
    user && getBudgetList();
  }, [user]);
  /**
   * used to get budget List
   */
  const getBudgetList = async () => {
  const email = user?.primaryEmailAddress?.emailAddress;

  try {
    // Fetch budgets
    const { data: budgetsData, error: budgetsError } = await supabase
      .from('Budgets')
      .select('*')
      .eq('createdBy', email)
      .order('id', { ascending: false });

    if (budgetsError) throw budgetsError;

    // Fetch expenses for each budget
    const budgetsWithTotals = await Promise.all(
      budgetsData.map(async (budget) => {
        const { data: expensesData, error: expensesError } = await supabase
          .from('Expenses')
          .select('amount, id')
          .eq('budgetId', budget.id);

        if (expensesError) throw expensesError;

        // Calculate totals
        const totalSpend = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
        const totalItem = expensesData.length;

        return {
          ...budget,
          totalSpend,
          totalItem,
        };
      })
    );

    setBudgetList(budgetsWithTotals);
    getAllExpenses();
    getIncomeList();
  } catch (error) {
    console.error('Error fetching budget list:', error);
  }
};

  /**
   * Get Income stream list
   */
  const getIncomeList = async () => {
    try {
      const { data: incomesData, error: incomesError } = await supabase
        .from('Incomes')
        .select('*')
        .order('id', { ascending: false });

      if (incomesError) throw incomesError;

      // Calculate total amount for each income
      const incomesWithTotals = incomesData.map((income) => ({
        ...income,
        totalAmount: income.amount, // Assuming you want the amount itself
      }));

      setIncomeList(incomesWithTotals);
    } catch (error) {
      console.error('Error fetching income list:', error);
    }
  };

  /**
   * Used to get All expenses belong to users
   */
  const getAllExpenses = async () => {
  const email = user?.primaryEmailAddress?.emailAddress;

  try {
    // Fetch expenses with budget info
    const { data: expensesData, error: expensesError } = await supabase
      .from('Expenses')
      .select('id, name, amount, createdAt, Budgets:budgetId (createdBy)')
      .or(`Budgets.createdBy.eq.${email},Budgets.is.null`)
      .order('id', { ascending: false });

    if (expensesError) throw expensesError;

    // Filter expenses created by the user
    const userExpenses = expensesData.filter(
      (expense) => expense.Budgets?.createdBy === email || !expense.Budgets
    );

    setExpensesList(userExpenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
  }
};

  return (
    <div className="p-8 bg-">
      <h2 className="font-bold text-4xl">Hi, {user?.fullName} 👋</h2>
      <p className="text-gray-500">
        Here's what happenning with your money, Lets Manage your expense
      </p>

      <CardInfo budgetList={budgetList} incomeList={incomeList} />
      <div className="grid grid-cols-1 lg:grid-cols-3 mt-6 gap-5">
        <div className="lg:col-span-2">
          <BarChartDashboard budgetList={budgetList} />

          <ExpenseListTable
            expensesList={expensesList}
            refreshData={() => getBudgetList()}
          />
        </div>
        <div className="grid gap-5">
          <h2 className="font-bold text-lg">Latest Budgets</h2>
          {budgetList?.length > 0
            ? budgetList.map((budget, index) => (
                <BudgetItem budget={budget} key={index} />
              ))
            : [1, 2, 3, 4].map((item, index) => (
                <div
                  className="h-[180xp] w-full
                 bg-slate-200 rounded-lg animate-pulse"
                ></div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
