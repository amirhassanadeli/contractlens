"use client";

import { useRef, useState } from "react";
import { Paperclip, Send } from "lucide-react";

import { uploadContract } from "@/services/contracts";
import { createConversation } from "@/services/conversations";
import { sendMessage } from "@/services/messages";

type ChatInputProps = {
  conversationId: string | null;

  onConversationCreated: (
    id: string,
  ) => void;

  onMessageSent: () => Promise<void>;
};

export function ChatInput({
  conversationId,
  onConversationCreated,
  onMessageSent,
}: ChatInputProps) {
  const [message, setMessage] =
    useState("");

  const [sending, setSending] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  async function handleSubmit(
    e: React.FormEvent,
  ) {
    e.preventDefault();

    if (!conversationId) {
      alert(
        "Please upload a contract first.",
      );
      return;
    }

    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);

      console.log(
        "Sending message...",
      );

      const response =
        await sendMessage(
          conversationId,
          message,
        );

      console.log(
        "Assistant:",
        response,
      );

      setMessage("");

      await onMessageSent();

    } catch (error) {
      console.error(
        "Send failed:",
        error,
      );
    } finally {
      setSending(false);
    }
  }

  async function handleFileSelect(
    e: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      console.log(
        "Uploading contract...",
      );

      const contract =
        await uploadContract(file);

      console.log(
        "Contract uploaded:",
        contract,
      );

      const conversation =
        await createConversation(
          contract.id,
        );

      console.log(
        "Conversation created:",
        conversation,
      );

      onConversationCreated(
        conversation.id,
      );

    } catch (error) {
      console.error(
        "Upload failed:",
        error,
      );
    } finally {
      setUploading(false);

      e.target.value = "";
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t bg-white p-4"
    >
      <div className="flex items-center gap-2 rounded-xl border px-3 py-2 shadow-sm">

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          className="rounded-md p-2 transition hover:bg-gray-100 disabled:opacity-50"
        >
          <Paperclip className="h-5 w-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          hidden
          onChange={handleFileSelect}
        />

        <input
          className="flex-1 bg-transparent outline-none"
          placeholder="Ask anything about your contract..."
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          disabled={sending}
        />

        <button
          type="submit"
          disabled={
            sending ||
            uploading ||
            !conversationId
          }
          className="rounded-lg bg-black p-2 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-5 w-5" />
        </button>

      </div>
    </form>
  );
}