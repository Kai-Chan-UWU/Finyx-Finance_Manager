import { supabase } from "./dbConfig";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUser } from "@clerk/nextjs";

// Function to generate structured expense data from receipt OCR
export default function ReceiptProcessor({ budgetId }) {
  const { user } = useUser();
  
  // Initialize the Google Generative AI client
  const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
  
  const processReceipt = async (ocrText) => {
    if (!user) {
      console.error("User not authenticated");
      return { success: false, message: "User not authenticated" };
    }
    
    try {
      // Define the user prompt
      const userPrompt = `
        Extract structured expense data from the following OCR text and return a JSON array with:
        - "name": Item name (properly formatted, combining broken words if needed).
        - "amount": Item price (float).
        - "createdAt": Date and time in ISO format ("YYYY-MM-DDTHH:MM:SSZ").

        Ignore store details, cashier info, subtotal, discounts, and grand total. Only return a JSON array of individual expenses.

        ### Input:
        "text": "${ocrText}"

        ### Output format:
        [
          { "name": "Mineral Bottle", "amount": 30.00, "createdAt": "2024-12-27T15:31:00Z" },
          { "name": "Chicken B.B.Q. Pizza", "amount": 499.00, "createdAt": "2024-12-27T15:31:00Z" }
        ]

        Return only the JSON array, nothing else.
      `;

      // Get the generative model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      // Generate content
      const result = await model.generateContent(userPrompt);
      const response = result.response;
      const resultText = response.text(); // Extract the generated text
      const sanitizedResponse = resultText
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();

      try {
        // Parse the AI response into JSON
        const structuredExpenses = JSON.parse(sanitizedResponse);
        console.log("Extracted expenses:", structuredExpenses);
        
        // Step 1: Validate that the budget exists
        const { data: budget, error: budgetError } = await supabase
          .from('Budgets')
          .select('id')
          .eq('id', budgetId)
          .single();
        
        if (budgetError || !budget) {
          throw new Error(`Invalid budget ID: ${budgetId}`);
        }
        
        // Step 2: Insert the expenses with the provided budgetId
        const expensesWithBudgetId = structuredExpenses.map(expense => ({
          ...expense,
          budgetId: budgetId,
          amount: Number(expense.amount) // Ensure numeric type
        }));
        
        const { data, error } = await supabase
          .from('Expenses')
          .insert(expensesWithBudgetId)
          .select();
        
        if (error) {
          console.error("Error inserting expenses:", error);
          return { success: false, message: "Failed to save expenses", error };
        }
        
        console.log("Expenses inserted successfully:", data);
        return { success: true, expenses: data };
        
      } catch (parseError) {
        console.error("Failed to parse AI response:", parseError);
        return { success: false, message: "Failed to parse AI response", error: parseError };
      }

    } catch (error) {
      console.error('Error processing receipt:', error);
      return { 
        success: false, 
        message: 'Sorry, I couldn\'t process the receipt at this moment. Please try again later.',
        error
      };
    }
  };
  
  return { processReceipt };
}