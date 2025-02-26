'use client';

import { supabase } from "@/utils/dbConfig";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
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
import EditIncome from "./EditIncome";

function IncomeItem({ budget, refreshData }) {
  const router = useRouter();

  const deleteIncome = async () => {
    try {
      const { error } = await supabase
        .from("Incomes")
        .delete()
        .eq("id", budget?.id);
      
      if (error) throw error;

      toast("Income Deleted!");
      refreshData();
      router.push("/dashboard/incomes");
    } catch (error) {
      console.error('Error deleting income:', error);
      toast.error('Failed to delete income');
    }
  };

  return (
    <div className="p-5 border rounded-2xl hover:shadow-md cursor-pointer h-[170px]">
      <div className="flex gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl p-3 px-4 bg-emerald-100 rounded-full">
            {budget?.icon}
          </h2>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
            <h2 className="text-sm text-gray-500">{budget.totalItem} Item</h2>
          </div>
        </div>
        <h2 className="font-bold text-emerald-600 text-lg">
          ${budget.amount}
        </h2>
      </div>
      <div className="flex gap-2 items-center mt-8"> {/* Added mt-4 for margin-top */}
        <EditIncome budgetInfo={budget} refreshData={refreshData} />

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="flex gap-2 rounded-full" variant="red">
              <Trash className="w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete
                your current budget along with expenses.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={deleteIncome}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default IncomeItem;
