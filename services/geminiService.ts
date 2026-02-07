
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSubtasks = async (taskDescription: string): Promise<string[]> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down the following task into 3-5 concise, actionable sub-tasks: "${taskDescription}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subtasks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "A list of actionable steps for the main task."
            }
          },
          required: ["subtasks"]
        }
      }
    });

    const data = JSON.parse(response.text || '{"subtasks": []}');
    return data.subtasks;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return [];
  }
};
