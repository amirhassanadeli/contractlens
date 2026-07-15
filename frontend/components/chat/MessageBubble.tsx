"use client";

import type { Message } from "@/types/message";

import { MessageActions } from "./MessageActions";

import { copyToClipboard } from "@/lib/clipboard";

import {
  regenerateMessage,
} from "@/services/messages";

type MessageBubbleProps = {
  message: Message;

  onLike: (
    messageId: string,
  ) => void;

  onDislike: (
    messageId: string,
  ) => void;

  onRegenerated: (
    message: Message,
  ) => void;
};

export function MessageBubble({
  message,
  onLike,
  onDislike,
  onRegenerated,
}: MessageBubbleProps) {

  const isUser =
    message.role === "USER";

  return (
    <div
      className={`mb-6 flex ${
        isUser
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div
        className={`max-w-3xl rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-black text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        <p>{message.content}</p>

        {!isUser && (
          <MessageActions

            liked={message.liked}

            onLike={() =>
              onLike(message.id)
            }

            onDislike={() =>
              onDislike(message.id)
            }

            onCopy={async () => {
              try {

                await copyToClipboard(
                  message.content,
                );

              } catch (error) {

                console.error(error);

              }
            }}

            onRegenerate={async () => {
              try {

                console.log(
                  "🔄 Regenerating:",
                  message.id,
                );

                const regenerated =
                  await regenerateMessage(
                    message.id,
                  );

                console.log(
                  "✅ Regenerated:",
                  regenerated,
                );

                onRegenerated(
                  regenerated,
                );

              } catch (error) {

                console.error(
                  "❌ Regenerate failed:",
                  error,
                );

              }
            }}
          />
        )}

      </div>
    </div>
  );
}