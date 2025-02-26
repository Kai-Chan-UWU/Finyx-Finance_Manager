'use client';

import { useEffect, useState } from "react";
import CreateIncomes from "./CreateIncomes";
import { supabase } from "@/utils/dbConfig";
import { useUser } from "@clerk/clerk-react";
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
      const { data: incomesData, error: incomesError } = await supabase
        .from('Incomes')
        .select('*')
        .eq('createdBy', email)
        .order('id', { ascending: false });

      if (incomesError) throw incomesError;

      const incomesWithTotals = await Promise.all(
        incomesData.map(async (income) => {
          const { data: expensesData, error: expensesError } = await supabase
            .from('Expenses')
            .select('amount, id')
            .eq('budgetId', income.id);

          if (expensesError) throw expensesError;

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <CreateIncomes refreshData={getIncomelist} />
        {incomelist?.length > 0
          ? incomelist.map((budget, index) => (
              <IncomeItem 
                budget={budget} 
                key={budget.id} 
                refreshData={getIncomelist}
              />
            ))
          : [1, 2, 3, 4, 5].map((item, index) => (
              <div
                key={index}
                className="w-full bg-slate-200 rounded-lg h-[150px] animate-pulse"
              />
            ))}
      </div>
    </div>
  );
}

export default IncomeList;
