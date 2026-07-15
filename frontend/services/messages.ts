const API = "http://127.0.0.1:8000/api";

import type { Message } from "@/types/message";

/**
 * Load all messages of a conversation
 */
export async function getMessages(
  conversationId: string,
): Promise<Message[]> {
  const response = await fetch(
    `${API}/conversations/${conversationId}/messages/`,
  );

  if (!response.ok) {
    throw new Error("Failed to load messages");
  }

  return response.json();
}

/**
 * Send a new user message
 */
export async function sendMessage(
  conversationId: string,
  content: string,
): Promise<Message> {
  const response = await fetch(
    `${API}/conversations/${conversationId}/messages/`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to send message\n${error}`,
    );
  }

  return response.json();
}

/**
 * Like / Dislike
 */
export async function updateFeedback(
  messageId: string,
  liked: boolean,
): Promise<Message> {
  const response = await fetch(
    `${API}/messages/${messageId}/feedback/`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        liked,
      }),
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to update feedback\n${error}`,
    );
  }

  return response.json();
}

/**
 * Regenerate assistant response
 */
export async function regenerateMessage(
  messageId: string,
): Promise<Message> {
  const response = await fetch(
    `${API}/messages/${messageId}/regenerate/`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    const error = await response.text();

    throw new Error(
      `Failed to regenerate message\n${error}`,
    );
  }

  return response.json();
}