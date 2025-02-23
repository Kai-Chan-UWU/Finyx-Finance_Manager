import { supabase } from "./dbConfig";

export const storeChat = async (userId, message, response) => {
    const { error } = await supabase
    .from("ChatHistory")
    .insert([{user_id: userId, message, response}]);

    if (error) {
        console.error("Chat Store failed :", error);
    }
}

export const fetchChat = async (userId) => {
    // Fetch user's chat history (last 10 messages)
    const { data, error } = await supabase
        .from("ChatHistory")
        .select("id")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })  // Sort by latest first
    .limit(10);

    if (error) {
        console.error("Error fetching latest 10 records:", error.message);
    } else {
        const latestIds = data.map(row => row.id);
        
        const { delError } = await supabase
        .from("ChatHistory")
        .eq("user_id", userId)
        .delete()
        .not("id", "in", latestIds); 

    if (delError) {
        console.error("Error deleting old records:", delError.message);
    } else {
        console.log("Successfully deleted old records, keeping only the latest 10.");

        const { finalData, finalError } = await supabase
        .from("ChatHistory")
        .select("message", "response")
        .eq("user_id", userId)
        .order("timestamp", { ascending: false })  // Sort by latest first
        .limit(10);

        if (finalError) {
            console.error("Chat history fetch failed:", error.message);
            return [];
        }
    }
    }
    if (error) {
        console.error("Chat history fetch failed:", error.message);
        return [];
    }
    return finalData;
}