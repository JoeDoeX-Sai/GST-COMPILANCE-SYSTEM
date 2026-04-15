const { Groq } = require('groq-sdk');

let groq;
try {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} catch (e) {
  console.warn('⚠️  Groq API is not configured properly or missing key.');
}

const SYSTEM_PROMPT = `You are a helpful and specialized AI assistant for the GST (Goods and Services Tax) Compliance System.
Your target audience is exclusively "Accountants" using this software.

YOUR PRIMARY RESPONSIBILITIES:
1. Answer GST-related questions (e.g., about GSTR-1, GSTR-3B, TDS, HSN codes, reconciliation).
2. Guide users in using the GST system correctly.
3. Help with system navigation (e.g., where to find Sales Invoices, Purchases, Compliance Calendar, etc.).

STRICT RESTRICTIONS:
- You DO NOT have permission to perform any actions directly. You cannot create, edit, or delete invoices, parties, returns, or any data. You must guide the user to do it themselves.
- You CANNOT access or provide guidance on Admin features (since the user is an Accountant).
- If the user asks about a business being unassigned or why they cannot access data because of no business, YOU MUST suggest that they "contact the system admin to get a business assigned".
- Never invent URLs. Only refer to sections logically (e.g., "Go to the Invoices tab").
- Keep your instructions concise and professional. Use formatting (bullet points, bold text) where appropriate for readability.
- If you are asked something completely unrelated to the GST system or accounting, politely remind the user that you are specialized in GST Compliance and cannot help with outside topics.`;

/**
 * Generate a response using Groq
 * @param {string} userMessage - the new user message
 * @param {Array} chatHistory - previous messages in the chat {role: 'user'|'admin', content: '...'}
 * @returns {Promise<{message: string, resolved: boolean}>}
 */
async function generateGstResponse(userMessage, chatHistory = []) {
  if (!groq || !process.env.GROQ_API_KEY) {
    return {
      resolved: false,
      message: "The AI system is currently unavailable. Please contact an admin or support agent."
    };
  }

  try {
    // Convert history into Groq format, we assume history is sorted oldest to newest
    const messages = chatHistory.map(msg => ({
      role: msg.role === 'admin' ? 'assistant' : 'user', // "admin" role from DB is the "assistant" from LLM's perspective
      content: msg.message
    }));

    messages.push({ role: 'user', content: userMessage });

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      model: 'llama3-8b-8192',
      temperature: 0.3,
      max_tokens: 500
    });

    const replyText = completion.choices[0]?.message?.content || "I am sorry, I was unable to generate a response.";
    return {
      resolved: true,
      message: replyText.trim()
    };
  } catch (error) {
    console.error('Groq AI Error:', error.message);
    return {
      resolved: false,
      message: "I encountered an error while trying to process your request. Our support team can assist you if you raise a ticket."
    };
  }
}

module.exports = { generateGstResponse };
