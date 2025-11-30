import { GoogleGenAI, Type } from "@google/genai";
import { Book, GeneratedBookResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchBooks = async (query: string): Promise<Book[]> => {
  const model = "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: `Generate a list of 6 distinct, popular, or interesting books related to "${query}". 
      If the query is generic (like "any"), choose a mix of bestsellers.
      Return a JSON object with a "books" array.
      For 'coverUrl', simply return a keyword string relevant to the book cover visual (e.g., 'mountain', 'cyberpunk', 'romance', 'space') that I can use to fetch a placeholder image.
      Provide a short, punchy description (max 20 words).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            books: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING },
                  author: { type: Type.STRING },
                  description: { type: Type.STRING },
                  coverUrl: { type: Type.STRING },
                  genre: { type: Type.STRING },
                  rating: { type: Type.NUMBER },
                },
                required: ["id", "title", "author", "description", "coverUrl", "genre", "rating"],
              },
            },
          },
        },
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data received from Gemini");
    }

    const data = JSON.parse(jsonText) as GeneratedBookResponse;
    return data.books.map((book, index) => ({
      ...book,
      // Map the keyword to a high-quality picsum image to ensure visual appeal
      coverUrl: `https://picsum.photos/seed/${book.title.replace(/\s/g, '')}/400/600`
    }));

  } catch (error) {
    console.error("Gemini API Error:", error);
    // Fallback data in case of error to keep UI functional
    return [
      {
        id: "1",
        title: "The Silent Echo",
        author: "Julian Thorne",
        description: "A mystery unfolding in the quiet valleys of the Alps.",
        coverUrl: "https://picsum.photos/seed/echo/400/600",
        genre: "Mystery",
        rating: 4.5
      },
      {
        id: "2",
        title: "Neon Dreams",
        author: "Sarah K. Lee",
        description: "Cyberpunk adventures in a world ruled by AI.",
        coverUrl: "https://picsum.photos/seed/neon/400/600",
        genre: "Sci-Fi",
        rating: 4.8
      }
    ];
  }
};
