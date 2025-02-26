"use client";
import React, { useEffect } from "react";
import SideNav from "./_components/SideNav";
import DashboardHeader from "./_components/DashboardHeader";
import { supabase } from "@/utils/dbConfig";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

function DashboardLayout({ children }) {
  const { user } = useUser();
  const router = useRouter();
  useEffect(() => {
    user && checkUserBudgets();
  }, [user]);

  const checkUserBudgets = async () => {
    const { data, error } = await supabase
      .from('Budgets')
      .select('*')
      .eq('createdBy', user?.primaryEmailAddress?.emailAddress);

    if (error) {
      console.error('Error checking budgets:', error);
      return;
    }

    console.log(data);
    if (data?.length === 0) {
      router.replace("/dashboard/budgets");
    }
  };

  return (
    <div>
      <div className="fixed md:w-64 hidden md:block ">
        <SideNav />
      </div>
      <div className="md:ml-64 ">
        <DashboardHeader />
        {children}
      </div>
    </div>
  );
}

export default DashboardLayout;
