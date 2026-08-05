import type { Message } from "@/types/message";

import { MessageBubble } from "./MessageBubble";

type MessageListProps = {
  messages: Message[];

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

export function MessageList({
  messages,
  onLike,
  onDislike,
  onRegenerated,
}: MessageListProps) {

  console.log(
    "MessageList:",
    messages,
  );

  return (
    <div className="flex h-full flex-col overflow-y-auto p-6">

      {messages
        .filter(
          (
            message,
          ): message is Message =>
            message != null,
        )
        .map((message) => (
          <MessageBubble
            key={message.id}
            message={message}
            onLike={onLike}
            onDislike={onDislike}
            onRegenerated={
              onRegenerated
            }
          />
        ))}

    </div>
  );
}