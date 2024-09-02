## Generative AI SaaS PDF Chat Full Stack Application

Deployed Link: [https://generative-ai-pdf-chat-saas.vercel.app/]

## Overview

This project is a Generative AI application that allows users to upload PDFs and then ask it questions using a chat functionality. It is built using tools like OpenAI, LangChain, Pinecone, Firebase, Stripe, and Clerk. On a free plan we allow users to upload 2 documents and 5 messages for each document.

## Key Features

1. **Google Sign-In**: Users can sign in using their Google accounts.
2. **Gen AI Chat functionality**: Users can ask questions to documents they upload
3. **Freemium Model**: Users can pay using stripe to get access to Premium plan

## Technologies Used

1. **OpenAI**: used for LLM that users interact with
2. **Pinecone**: vector database that is used to store the vector embeddings for each document
3. **Langchain**: simplified the integration of LLMs by managing input, prompt engineering, and model responses.
4. **Stripe**: used for handling premium payments
5. **Firebase**: used Firestore for NoSql database and used storage to hold uploaded pdfs
6. **Clerk**: used for google authentication
7. **Shadcn**: used for enhanced UI elements
8. **Next.js**: Used for building the frontend and handling server-side rendering.
9. **Tailwind CSS**: Utilized for styling the user interface with a responsive and modern design.
10. Vercel\*\*: Used for deploying application
