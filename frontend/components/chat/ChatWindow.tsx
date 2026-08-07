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
    onConversationCreated: (id: string) => void;
};

export function ChatWindow({
    contractId,
    conversationId,
    onConversationCreated,
}: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);

    // بارگذاری پیام‌ها زمانی که conversationId تغییر کند
    useEffect(() => {
        // اگر conversationId وجود نداشت، پیام‌ها را خالی کن
        if (!conversationId) {
            setMessages([]);
            return;
        }

        async function loadMessages() {
            try {
                setLoading(true);

                // استفاده از ! برای اطمینان به TypeScript که null نیست
                const data = await getMessages(conversationId!);

                console.log("Messages:", data);
                setMessages(data);
            } catch (error) {
                console.error("خطا در دریافت پیام‌ها:", error);
            } finally {
                setLoading(false);
            }
        }

        loadMessages();
    }, [conversationId]);

    // مدیریت لایک کردن پیام
    function handleLike(messageId: string) {
        setMessages((prev) =>
            prev.map((message) =>
                message.id === messageId
                    ? { ...message, liked: true }
                    : message
            )
        );
    }

    // مدیریت دیسلایک کردن پیام
    function handleDislike(messageId: string) {
        setMessages((prev) =>
            prev.map((message) =>
                message.id === messageId
                    ? { ...message, liked: false }
                    : message
            )
        );
    }

    // مدیریت بازتولید پیام
    function handleRegenerated(message: Message) {
        if (!message) return;

        setMessages((prev) => [...prev, message]);
    }

    // مدیریت پیام جدید از دستیار
    function handleAssistant(assistant: Message) {
        if (!assistant) {
            console.error("Assistant message is undefined");
            return;
        }

        console.log("Assistant:", assistant);
        setMessages((prev) => [...prev, assistant]);
    }

    return (
        <main className="flex flex-1 flex-col">
            <ChatHeader />

            <MessageList
                messages={messages}
                onLike={handleLike}
                onDislike={handleDislike}
                onRegenerated={handleRegenerated}
            />

            {loading && (
                <div className="border-t p-3 text-sm text-gray-500">
                    در حال بارگذاری...
                </div>
            )}

            <ChatInput
                contractId={contractId}
                conversationId={conversationId}
                onConversationCreated={onConversationCreated}
                onMessageSent={handleAssistant}
            />
        </main>
    );
}