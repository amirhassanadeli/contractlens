"use client";

import { useCallback, useEffect, useState } from "react";

import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";

import type { Message } from "@/types/message";

import {
  getMessages,
  updateFeedback,
} from "@/services/messages";

export function ChatWindow() {
  const [conversationId, setConversationId] =
    useState<string | null>(null);

  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(false);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);

      const data =
        await getMessages(conversationId);

      setMessages(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleLike = async (
    messageId: string,
  ) => {

    console.log("👍 Like:", messageId);

    // Optimistic UI
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              liked: true,
            }
          : message
      )
    );

    try {

      const updated =
        await updateFeedback(
          messageId,
          true,
        );

      console.log(
        "✅ Backend:",
        updated,
      );

    } catch (error) {

      console.error(
        "❌ Like failed:",
        error,
      );

      // Rollback
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                liked: null,
              }
            : message
        )
      );

    }

  };

  const handleDislike = async (
    messageId: string,
  ) => {

    console.log("👎 Dislike:", messageId);

    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId
          ? {
              ...message,
              liked: false,
            }
          : message
      )
    );

    try {

      const updated =
        await updateFeedback(
          messageId,
          false,
        );

      console.log(
        "✅ Backend:",
        updated,
      );

    } catch (error) {

      console.error(
        "❌ Dislike failed:",
        error,
      );

      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId
            ? {
                ...message,
                liked: null,
              }
            : message
        )
      );

    }

  };

  return (
    <main className="flex flex-1 flex-col">

      <ChatHeader />

      <div className="flex-1 overflow-hidden">

        {loading ? (
          <div className="flex h-full items-center justify-center">
            Loading...
          </div>
        ) : (
          <MessageList
            messages={messages}

            onLike={handleLike}

            onDislike={handleDislike}

            onRegenerated={(message) => {

              console.log(
                "➕ Add regenerated message:",
                message,
              );

              setMessages((prev) => [
                ...prev,
                message,
              ]);

            }}
          />
        )}

      </div>

      <ChatInput
        conversationId={conversationId}
        onConversationCreated={
          setConversationId
        }
        onMessageSent={loadMessages}
      />

    </main>
  );
}