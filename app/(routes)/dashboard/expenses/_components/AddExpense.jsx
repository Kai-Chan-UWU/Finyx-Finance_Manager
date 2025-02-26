import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/utils/dbConfig";
import { Loader } from "lucide-react";
import moment from "moment";
import React, { useState } from "react";
import { toast } from "sonner";

function AddExpense({ budgetId, user, refreshData }) {
  const [name, setName] = useState();
  const [amount, setAmount] = useState();
  const [loading, setLoading] = useState(false);
  /**
   * Used to Add New Expense
   */
const addNewExpense = async () => {
  setLoading(true);

  try {
    // Step 1: Validate that the budget exists
    const { data: budget, error: budgetError } = await supabase
      .from('Budgets')
      .select('id')
      .eq('id', budgetId)
      .single();

    if (budgetError || !budget) {
      throw new Error('Invalid budget ID');
    }

    // Step 2: Insert the new expense
    const { data, error } = await supabase
      .from('Expenses')
      .insert({
        name: name,
        amount: Number(amount), // Ensure numeric type
        budgetId: budgetId,
        createdAt: new Date().toISOString(), // Use ISO format
      })
      .select('id') // Return the inserted ID
      .single();

    if (error) throw error;

    // Step 3: Reset form and show success message
    setAmount('');
    setName('');
    toast.success('New Expense Added!');
    refreshData();
  } catch (error) {
    console.error('Error adding expense:', error);
    toast.error('Failed to add expense');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="border p-5 rounded-2xl">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <Input
          placeholder="e.g. Bedroom Decor"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <Input
          placeholder="e.g. 1000"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <Button
        disabled={!(name && amount) || loading}
        onClick={() => addNewExpense()}
        className="mt-3 w-full rounded-full"
      >
        {loading ? <Loader className="animate-spin" /> : "Add New Expense"}
      </Button>
    </div>
  );
}
export default AddExpense;
