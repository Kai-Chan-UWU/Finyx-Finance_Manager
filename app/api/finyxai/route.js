import { GoogleGenerativeAI } from "@google/generative-ai";
import { fetchChat, storeChat, ensureUserExists } from "@/utils/storeChat";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function POST(request) {
  try {
    // Get authentication details
    const { userId: clerkUserId } = auth();
    
    // Verify authentication
    if (!clerkUserId) {
      return NextResponse.json(
        { error: "Unauthorized" }, 
        { status: 401 }
      );
    }

    // Parse the JSON body
    const { userId, message } = await request.json();
    
    // Validate the user ID matches the authenticated user
    if (userId !== clerkUserId) {
      return NextResponse.json(
        { error: "User ID mismatch" }, 
        { status: 403 }
      );
    }
    
    if (!message) {
      return NextResponse.json(
        { error: "Missing message" }, 
        { status: 400 }
      );
    }

    // Ensure user exists in our database
    const userData = await ensureUserExists(clerkUserId);
    
    // Fetch last 10 chat messages
    const chatHistory = await fetchChat(clerkUserId);

    // Format chat history for context
    const formattedHistory = chatHistory
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map(c => `User: ${c.message}\nAI: ${c.response}`)
      .join("\n\n");

    // Prepare AI Context
    const aiContext = `
      You are Finyx AI, a personalized financial assistant.
      
      User Profile:
      Name: ${userData?.name || "User"}
      Preferences: ${JSON.stringify(userData?.preferences || {})}

      ${chatHistory.length > 0 ? `Chat History:\n${formattedHistory}\n\n` : ''}
      
      Current Message: ${message}
      
      Respond in a helpful, personalized way based on the user's profile and chat history.
    `;
    console.log(aiContext);
    // Call Gemini API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(aiContext);
    const aiResponse = await result.response.text();

    // Store Chat in DB
    await storeChat(clerkUserId, message, aiResponse);
    
    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "AI response failed", message: error.message }, 
      { status: 500 }
    );
  }
}