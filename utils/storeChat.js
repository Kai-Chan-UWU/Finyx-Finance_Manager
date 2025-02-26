import { supabase } from "@/utils/dbConfig";

async function updateUserPreferences(userId) {
  try {
    // 1. Fetch all financial data for this user
    const [budgetsResponse, incomesResponse, budgetIdsResponse] = await Promise.all([
      supabase
        .from('Budgets')
        .select('*')
        .eq('createdBy', userId),
      
      supabase
        .from('Incomes')
        .select('*')
        .eq('createdBy', userId),
      
      supabase
        .from('Budgets')
        .select('id')
        .eq('createdBy', userId)
    ]);

    // Check for errors
    if (budgetsResponse.error) throw budgetsResponse.error;
    if (incomesResponse.error) throw incomesResponse.error;
    if (budgetIdsResponse.error) throw budgetIdsResponse.error;

    // Extract budget IDs
    const budgetIds = budgetIdsResponse.data.map(budget => budget.id);

    // Fetch expenses using the budget IDs
    const expensesResponse = await supabase
      .from('Expenses')
      .select('id, name, amount, createdAt, budgetId')
      .in('budgetId', budgetIds);

    if (expensesResponse.error) throw expensesResponse.error;

    // 2. Structure the data as a JSON object
    const financialData = {
      budgets: budgetsResponse.data || [],
      incomes: incomesResponse.data || [],
      expenses: expensesResponse.data || [],
      lastUpdated: new Date().toISOString()
    };

    // 3. Update the user's preferences field
    const { error } = await supabase
      .from('Users')
      .update({ preferences: financialData })
      .eq('email', userId);

    if (error) throw error;
    
    console.log('User preferences updated successfully');
    return { success: true };
    
  } catch (error) {
    console.error('Error updating user preferences:', error);
    return { success: false, error };
  }
}

// Function to ensure user exists in the database
export const ensureUserExists = async (clerkUserId, userData = {}) => {
  // Check if user already exists
  const { data: existingUser, error: checkError } = await supabase
    .from("Users")
    .select("id")
    .eq("email", clerkUserId)
    .single();
  
  if (checkError && checkError.code !== 'PGRST116') {
    console.error("Error checking user existence:", checkError);
    throw checkError;
  }
  
  // If user doesn't exist, create them
  if (!existingUser) {
    const { error: insertError } = await supabase
      .from("Users")
      .insert([{
        email: clerkUserId,
        name: userData.name || '',
        preferences: userData.preferences || {}
      }]);
      
    if (insertError) {
      console.error("Error creating user:", insertError);
      throw insertError;
    }
  }
  
  await updateUserPreferences(clerkUserId);

  // Return the user record
  const { data: user, error: fetchError } = await supabase
    .from("Users")
    .select("*")
    .eq("email", clerkUserId)
    .single();
    
  if (fetchError) {
    console.error("Error fetching user:", fetchError);
    throw fetchError;
  }
  
  return user;
};

export const storeChat = async (clerkUserId, message, response) => {
  // First ensure the user exists and get their internal ID
  const user = await ensureUserExists(clerkUserId);
  
  // Now store the chat using the internal user ID
  const { error } = await supabase
    .from("ChatHistory")
    .insert([{ 
      user_id: user.id, 
      message, 
      response, 
      timestamp: new Date() 
    }]);

  if (error) {
    console.error("Chat Store failed:", error);
    throw error;
  }
  
  return { success: true };
};

export const fetchChat = async (clerkUserId) => {
  // First ensure the user exists and get their internal ID
  const user = await ensureUserExists(clerkUserId);
  
  // Fetch user's chat history (last 10 messages)
  const { data, error } = await supabase
    .from("ChatHistory")
    .select("*")
    .eq("user_id", user.id)
    .order("timestamp", { ascending: false })
    .limit(10);

  if (error) {
    console.error("Chat history fetch failed:", error.message);
    return [];
  }

  // Clean up older messages (keep only the most recent 10)
  const cleanupOldMessages = async () => {
    // Get all message IDs for this user
    const { data: allMessages, error: fetchError } = await supabase
      .from("ChatHistory")
      .select("id")
      .eq("user_id", user.id)
      .order("timestamp", { ascending: false });
      
    if (fetchError) {
      console.error("Error fetching all messages:", fetchError.message);
      return;
    }
    
    if (allMessages.length > 10) {
      // Get IDs to keep (the 10 most recent)
      const idsToKeep = allMessages.slice(0, 10).map(msg => msg.id);
      
      // Delete older messages
      const { error: deleteError } = await supabase
        .from("ChatHistory")
        .delete()
        .eq("user_id", user.id)
        .not("id", "in", `(${idsToKeep.join(",")})`);
        
      if (deleteError) {
        console.error("Error deleting old messages:", deleteError.message);
      } else {
        console.log("Successfully deleted older messages");
      }
    }
  };
  
  // Run cleanup in the background
  cleanupOldMessages().catch(console.error);
  
  // Return the chat history with most recent first
  return data;
};