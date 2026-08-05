"use client";

import { useEffect, useState } from "react";

import { ChatHeader } from "./ChatHeader";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

import type { Message } from "@/types/message";

import { getMessages } from "@/services/messages";

type ChatWindowProps = {
  contractId: string | null;

  conversationId: string | null;

  onConversationCreated: (
    id: string,
  ) => void;
};

export function ChatWindow({
  contractId,
  conversationId,
  onConversationCreated,
}: ChatWindowProps) {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      return;
    }

    async function loadMessages() {
      try {
        setLoading(true);

        const data =
          await getMessages(
            conversationId,
          );

        console.log(
          "Messages:",
          data,
        );

        setMessages(data);

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    }

    loadMessages();
  }, [conversationId]);

  function handleLike(
    messageId: string,
  ) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              liked: true,
            }
          : message,
      ),
    );
  }

  function handleDislike(
    messageId: string,
  ) {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              liked: false,
            }
          : message,
      ),
    );
  }

  function handleRegenerated(
    message: Message,
  ) {
    if (!message) return;

    setMessages((prev) => [
      ...prev,
      message,
    ]);
  }

  function handleAssistant(
    assistant: Message,
  ) {
    if (!assistant) {
      console.error(
        "Assistant message is undefined",
      );
      return;
    }

    console.log(
      "Assistant:",
      assistant,
    );

    setMessages((prev) => [
      ...prev,
      assistant,
    ]);
  }

  return (
    <main className="flex flex-1 flex-col">

      <ChatHeader />

      <MessageList
        messages={messages}
        onLike={handleLike}
        onDislike={handleDislike}
        onRegenerated={
          handleRegenerated
        }
      />

      {loading && (
        <div className="border-t p-3 text-sm text-gray-500">
          Loading...
        </div>
      )}

      <ChatInput
        contractId={contractId}
        conversationId={
          conversationId
        }
        onConversationCreated={
          onConversationCreated
        }
        onMessageSent={
          handleAssistant
        }
      />

    </main>
  );
}