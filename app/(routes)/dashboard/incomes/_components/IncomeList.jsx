"use client";
import React, { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { supabase } from "@/utils/dbConfig";
// import { desc, eq, getTableColumns, sql } from "drizzle-orm";
// import { Incomes, Expenses } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import IncomeItem from "./IncomeItem";

function IncomeList() {
  const [incomelist, setIncomelist] = useState([]);
  const { user } = useUser();
  useEffect(() => {
    user && getIncomelist();
  }, [user]);

  const getIncomelist = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    try {
      // Fetch incomes
      const { data: incomesData, error: incomesError } = await supabase
        .from('Incomes')
        .select('*')
        .eq('createdBy', email)
        .order('id', { ascending: false });

      if (incomesError) throw incomesError;

      // Fetch expenses for each income
      const incomesWithTotals = await Promise.all(
        incomesData.map(async (income) => {
          const { data: expensesData, error: expensesError } = await supabase
            .from('Expenses')
            .select('amount, id')
            .eq('budgetId', income.id);

          if (expensesError) throw expensesError;

          // Calculate totals
          const totalSpend = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
          const totalItem = expensesData.length;

          return {
            ...income,
            totalSpend,
            totalItem,
          };
        })
      );

      setIncomelist(incomesWithTotals);
    } catch (error) {
      console.error('Error fetching income list:', error);
    }
  };
  return (
    <div className="mt-7">
      <div
        className="grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5"
      >
        <CreateIncomes refreshData={() => getIncomelist()} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem budget={budget} key={index} />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
