import { OpenAI } from 'openai';

// Define the tool schemas
export const extractPdfTextTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'extract_pdf_text',
    description: 'Reads the extracted text of the uploaded PDF document.',
    parameters: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'The ID of the document to read',
        },
      },
      required: ['documentId'],
    },
  },
};

export const retrieveChunksTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'retrieve_chunks',
    description: 'Retrieves relevant chunks of text from the document based on a keyword search. Use this to find specific information to answer user questions.',
    parameters: {
      type: 'object',
      properties: {
        documentId: {
          type: 'string',
          description: 'The ID of the document',
        },
        query: {
          type: 'string',
          description: 'The keyword or phrase to search for in the document chunks',
        },
      },
      required: ['documentId', 'query'],
    },
  },
};

export const countDocumentWordsTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'count_document_words',
    description: 'Counts the total number of words in the uploaded PDF document.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
};

export const handoffToAnalysisTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'handoff_to_analysis',
    description: 'Transfer the conversation to the Document Analysis Agent. Use this when the user wants to analyze the document type, extract themes, or locate sections.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string' }
      },
      required: ['reason']
    },
  },
};

export const handoffToSummaryTool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'handoff_to_summary',
    description: 'Transfer the conversation to the Summary Agent. Use this when the user asks for a summary, highlights, or bullet points of the document.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string' }
      },
      required: ['reason']
    },
  },
};

export const handoffToQnATool: OpenAI.Chat.Completions.ChatCompletionTool = {
  type: 'function',
  function: {
    name: 'handoff_to_qna',
    description: 'Transfer the conversation to the Q&A Agent. Use this when the user asks a specific question about the content of the document.',
    parameters: {
      type: 'object',
      properties: {
        reason: { type: 'string' }
      },
      required: ['reason']
    },
  },
};
