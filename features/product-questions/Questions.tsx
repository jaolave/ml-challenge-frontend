import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";
import Icon from '../../components/atoms/Icon';
import { QA } from '../../lib/types';

/**
 * @interface QuestionsProps
 * Defines the props for the Questions component.
 */
interface QuestionsProps {
  /** The full product data object, used for context in AI prompts. */
  product: any;
  /** The list of existing questions and answers. */
  questionsList: QA[];
  /** A callback to add a new question to the list. */
  onAddQuestion: (newQuestion: QA) => void;
  /** A callback to update a question with its answer. */
  onUpdateQuestionAnswer: (questionId: number, answer: string) => void;
  /** A callback to delete a question from the list. */
  onDeleteQuestion: (questionId: number) => void;
}

/**
 * A component for displaying and asking questions about the product.
 * It features an AI-powered "Ask the seller" functionality using the Gemini API.
 *
 * @param {QuestionsProps} props - The component props.
 * @returns {React.ReactElement} The rendered questions and answers section.
 */
const Questions: React.FC<QuestionsProps> = ({ 
  product, 
  questionsList = [],
  onAddQuestion,
  onUpdateQuestionAnswer,
  onDeleteQuestion
}) => {
  /** State for the text of the new question being typed by the user. */
  const [newQuestion, setNewQuestion] = useState('');
  /** State to track if an AI request is in progress. */
  const [isAsking, setIsAsking] = useState(false);

  /**
   * Handles the submission of the question form.
   * It adds the question to the list optimistically, then calls the Gemini API
   * to generate an answer based on the product's details.
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userQuestion = newQuestion.trim();
    if (!userQuestion || isAsking) return;

    setIsAsking(true);
    
    // Optimistically add the new question to the UI with a temporary ID.
    const tempId = Date.now();
    const newQ: QA = {
      id: tempId,
      question: userQuestion,
      answer: null, // `null` answer triggers the loading animation
      isUserGenerated: true,
    };
    
    onAddQuestion(newQ);
    setNewQuestion('');

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Create a summary of product specs for the prompt context.
      const specsSummary = product.specs.highlighted.map((s: any) => `${s.name} ${s.value}`).join(', ');

      // Define the persona and instructions for the AI model.
      const systemInstruction = `You are a friendly and helpful seller on an e-commerce platform. Your task is to answer customer questions about a product based solely on the information provided. Be concise, friendly, and direct. If the information to answer the question is not in the provided details, politely state that you do not have that information.`;

      // Construct the user's content, combining product data with their question.
      const userContent = `
Product Details:
- Title: ${product.title}
- Description: ${product.description}
- Key Specs: ${specsSummary}

Customer Question: "${userQuestion}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userContent,
        config: {
          systemInstruction: systemInstruction,
        },
      });
      
      // Update the question in the UI with the response from the AI.
      onUpdateQuestionAnswer(tempId, response.text);

    } catch (error) {
      console.error("Error generating AI response:", error);
      // Provide a user-friendly error message on failure.
      onUpdateQuestionAnswer(tempId, 'Sorry, I was unable to process your question at this time. Please try again later.');
    } finally {
      setIsAsking(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-light text-gray-800 mb-2">Preguntas</h2>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">¿Qué quieres saber?</h3>

      <h3 className="text-lg font-semibold text-gray-800 mt-2 mb-2">Pregúntale al vendedor</h3>
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-start md:items-center gap-2 flex-col md:flex-row">
          <textarea
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition disabled:bg-gray-100"
            placeholder="Escribe tu pregunta..."
            rows={1}
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            disabled={isAsking}
            aria-label="Escribe tu pregunta para el vendedor"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-md transition-colors flex items-center gap-2 disabled:bg-blue-300 disabled:cursor-not-allowed w-full md:w-auto justify-center"
            disabled={isAsking || !newQuestion.trim()}
          >
            {isAsking ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Preguntando...</span>
              </>
            ) : (
              <>
                <Icon name="aiSparkle" className="w-5 h-5" />
                <span>Preguntar</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="border-t my-4"></div>

      <h3 className="text-lg font-semibold text-gray-800 mb-2">Últimas preguntas</h3>
      {questionsList.length === 0 ? (
        <p className="text-sm text-gray-500">Nadie ha hecho una pregunta aún. ¡Sé el primero!</p>
      ) : (
        <ul className="space-y-4">
          {questionsList.map((qa) => (
            <li key={qa.id} className="text-sm">
              <div className="flex items-start gap-3">
                <span className="font-bold text-gray-800">P:</span>
                <div className="flex-1">
                  <p className="text-gray-800">{qa.question}</p>
                </div>
                {qa.isUserGenerated && (
                  <button 
                    onClick={() => onDeleteQuestion(qa.id)} 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                    aria-label="Eliminar pregunta"
                  >
                    <Icon name="trash" className="w-5 h-5" />
                  </button>
                )}
              </div>
              <div className="flex items-start gap-3 mt-2 pl-6">
                <span className="font-bold text-gray-600">R:</span>
                <div className="flex-1">
                  {qa.answer === null ? (
                    <div className="flex items-center space-x-1" aria-label="Esperando respuesta...">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                  ) : (
                    <p className="text-gray-600 whitespace-pre-wrap">{qa.answer}</p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

export default Questions;
