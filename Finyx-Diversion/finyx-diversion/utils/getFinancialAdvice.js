// utils/getFinancialAdvice.js
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

// Function to generate personalized financial advice
const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  console.log('Input Data:', { totalBudget, totalIncome, totalSpend });

  try {
    // Define the user prompt
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: ${totalBudget} Rupees
      - Expenses: ${totalSpend} Rupees
      - Incomes: ${totalIncome} Rupees
      Provide detailed financial advice in 2 sentences to help the user manage their finances more effectively.
    `;

    // Get the generative model (e.g., 'gemini-pro')
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Generate content
    const result = await model.generateContent(userPrompt);
    const response = result.response;
    const advice = response.text(); // Extract the generated text

    console.log('Generated Advice:', advice);
    return advice;
  } catch (error) {
    console.error('Error fetching financial advice:', error);
    return 'Sorry, I couldn\'t fetch the financial advice at this moment. Please try again later.';
  }
};

export default getFinancialAdvice;