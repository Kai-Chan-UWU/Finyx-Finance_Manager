"use client"
import React, { useEffect, useState } from 'react'
import CreateBudget from './CreateBudget'
import { supabase } from '@/utils/dbConfig'
// import { desc, eq, getTableColumns, sql } from 'drizzle-orm'
// import { Budgets, Expenses } from '@/utils/schema'

import { useUser } from '@clerk/nextjs'
import BudgetItem from './BudgetItem'

function BudgetList() {

  const [budgetList,setBudgetList]=useState([]);
  const {user}=useUser();
  useEffect(()=>{
    user&&getBudgetList();
  },[user])
  /**
   * used to get budget List
   */
  const getBudgetList=async()=>{

    const { data, error } = await supabase
      .from('Budgets')
      .select(`
        *,
        Expenses (
          amount,
          id
        )
      `)
      .eq('createdBy', user?.primaryEmailAddress?.emailAddress)
      .order('id', { ascending: false });
    
    // Checking if there are any errors
    if (error) {
      console.error('Supabase error:', error);
      return [];
    }

    // Process the results
    const result = data?.map(budget => ({
      ...budget,
      totalSpend: budget.Expenses.reduce((sum, expense) => sum + expense.amount, 0),
      totalItem: budget.Expenses.length
    })) || [];

    setBudgetList(result);

  }

  return (
    <div className='mt-7'>
        <div className='grid grid-cols-1
        md:grid-cols-2 lg:grid-cols-3 gap-5'>
        <CreateBudget
        refreshData={()=>getBudgetList()}/>
        {budgetList?.length>0? budgetList.map((budget,index)=>(
          <BudgetItem budget={budget} key={index} />
        ))
      :[1,2,3,4,5].map((item,index)=>(
        <div key={index} className='w-full bg-slate-200 rounded-lg
        h-[150px] animate-pulse'>

        </div>
      ))
      }
        </div>
       
    </div>
  )
}

export default BudgetList