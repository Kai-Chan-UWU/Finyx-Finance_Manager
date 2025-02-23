import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";
import { fetchChat, storeChat } from "@/utils/storeChat";
import { NextResponse } from "next/server";

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
    try {
        // Parse the JSON body
        const { userId, message } = await request.json();
        
        if (!userId || !message) {
            return NextResponse.json(
                { error: "Missing userId or message" }, 
                { status: 400 }
            );
        }

        // Fetch user profile
        const { data: userData } = await supabase
            .from("Users")
            .select("name, preferences")
            .eq("id", userId)
            .single();

        // Fetch last 10 chat messages
        const { data: chatHistory } = await fetchChat(userId);

        // Prepare AI Context
        const aiContext = `
            User Profile:
            Name: ${userData?.name || "User"}
            Preferences: ${JSON.stringify(userData?.preferences || {})}

            Chat History:
            ${chatHistory?.map(c => `User: ${c.message}\nAI: ${c.response}`).join("\n")}

            New User Message: ${message}
        `;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(aiContext);
        const aiResponse = await result.response.text();

        // Store Chat in DB
        await storeChat(userId, message, aiResponse);
        
        return NextResponse.json({ response: aiResponse });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "AI response failed" }, 
            { status: 500 }
        );
    }
}