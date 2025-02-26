"use client";
import { supabase } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import BudgetItem from "../../budgets/_components/BudgetItem";
import AddExpense from "../_components/AddExpense";
import ExpenseListTable from "../_components/ExpenseListTable";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pen, PenBox, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import EditBudget from "../_components/EditBudget";

function ExpensesScreen({ params }) {
  const { user } = useUser();
  const [budgetInfo, setbudgetInfo] = useState();
  const [expensesList, setExpensesList] = useState([]);
  const route = useRouter();
  useEffect(() => {
    user && getBudgetInfo();
  }, [user]);

  /**
   * Get Budget Information
   */

  const getBudgetInfo = async () => {
    const email = user?.primaryEmailAddress?.emailAddress;

    // Fetch budget details
    const { data: budgetData, error: budgetError } = await supabase
      .from('Budgets')
      .select('*')
      .eq('createdBy', email)
      .eq('id', params.id)
      .single();

    if (budgetError) {
      console.error('Error fetching budget:', budgetError);
      return;
    }

    // Fetch related expenses
    const { data: expensesData, error: expensesError } = await supabase
      .from('Expenses')
      .select('amount, id')
      .eq('budgetId', params.id);

    if (expensesError) {
      console.error('Error fetching expenses:', expensesError);
      return;
    }

    // Calculate totals
    const totalSpend = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    const totalItem = expensesData.length;

    // Combine results
    const result = {
      ...budgetData,
      totalSpend,
      totalItem,
    };

    setbudgetInfo(result);
    getExpensesList();
  };

  /**
   * Get Latest Expenses
   */
  const getExpensesList = async () => {
    const { data, error } = await supabase
      .from('Expenses')
      .select('*')
      .eq('budgetId', params.id)
      .order('id', { ascending: false });

    if (error) {
      console.error('Error fetching expenses:', error);
      return;
    }

    setExpensesList(data);
    console.log(data);
  };

  /**
   * Used to Delete budget
   */
  const deleteBudget = async () => {
  // Delete associated expenses
  const { error: deleteExpensesError } = await supabase
    .from('Expenses')
    .delete()
    .eq('budgetId', params.id);

  if (deleteExpensesError) {
    console.error('Error deleting expenses:', deleteExpensesError);
    return;
  }

  // Delete the budget
  const { error: deleteBudgetError } = await supabase
    .from('Budgets')
    .delete()
    .eq('id', params.id);

    if (deleteBudgetError) {
      console.error('Error deleting budget:', deleteBudgetError);
      return;
    }

  toast('Budget Deleted!');
  route.replace('/dashboard/budgets');
};

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold gap-2 flex justify-between items-center">
        <span className="flex gap-2 items-center">
          <ArrowLeft onClick={() => route.back()} className="cursor-pointer" />
          My Budget
        </span>
        <div className="flex gap-2 items-center">
          <EditBudget
            budgetInfo={budgetInfo}
            refreshData={() => getBudgetInfo()}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="flex gap-2 rounded-full" variant="destructive">
                <Trash className="w-4" /> Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your current budget along with expenses and remove your data
                  from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteBudget()}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </h2>
      <div
        className="grid grid-cols-1 
        md:grid-cols-2 mt-6 gap-5"
      >
        {budgetInfo ? (
          <BudgetItem budget={budgetInfo} />
        ) : (
          <div
            className="h-[150px] w-full bg-slate-200 
            rounded-lg animate-pulse"
          ></div>
        )}
        <AddExpense
          budgetId={params.id}
          user={user}
          refreshData={() => getBudgetInfo()}
        />
      </div>
      <div className="mt-4">
        <ExpenseListTable
          expenses={expensesList} 
          refreshData={() => getBudgetInfo()}
        />
      </div>
    </div>
  );
}

export default ExpensesScreen;
