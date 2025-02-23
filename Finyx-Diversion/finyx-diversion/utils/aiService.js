// utils/aiService.js
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/utils/dbConfig";
import { fetchChat, storeChat } from "@/utils/storeChat";

export async function getAIResponse(userId, message) {
  try {
    // Validate input
    if (!userId || !message) {
      throw new Error("Missing userId or message");
    }

    // Fetch user profile
    const { data: userData, error: userError } = await supabase
      .from("Users")
      .select("name, preferences")
      .eq("id", userId)
      .single();

    if (userError) {
      throw new Error("Failed to fetch user profile");
    }

    // Fetch last 10 chat messages
    const { data: chatHistory, error: chatError } = await fetchChat(userId);

    if (chatError) {
      throw new Error("Failed to fetch chat history");
    }

    // Prepare AI Context
    const aiContext = `
      User Profile:
      Name: ${userData?.name || "User"}
      Preferences: ${JSON.stringify(userData?.preferences || {})}

      Chat History:
      ${chatHistory?.map((c) => `User: ${c.message}\nAI: ${c.response}`).join("\n")}

      New User Message: ${message}
    `;

    // Call Gemini API
    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(aiContext);
    const aiResponse = result.response.text();

    // Store Chat in DB
    await storeChat(userId, message, aiResponse);

    return { response: aiResponse };
  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
}