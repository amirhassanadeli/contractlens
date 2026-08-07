"use client";

import {useEffect, useState} from "react";

import {MessageSquare} from "lucide-react";

import type {Conversation} from "@/types/conversation";

import {getConversations} from "@/services/conversations";

type ConversationListProps = {
    contractId: string | null;
    selectedConversationId: string | null;
    onSelect: (id: string) => void;
};

export function ConversationList({
                                     contractId,
                                     selectedConversationId,
                                     onSelect,
                                 }: ConversationListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // اگر contractId وجود نداشت، لیست را خالی کن و از ادامه کار جلوگیری کن
        if (!contractId) {
            setConversations([]);
            return;
        }

        async function loadConversations() {
            try {
                setLoading(true);

                // استفاده از ! چون مطمئن هستیم contractId در این نقطه null نیست
                const data = await getConversations(contractId!);

                console.log("Conversations:", data);

                setConversations(data);

                // اگر لیست خالی نبود و هیچ گفتگویی انتخاب نشده بود، اولین مورد را انتخاب کن
                if (data.length > 0 && !selectedConversationId) {
                    onSelect(data[0].id);
                }
            } catch (error) {
                console.error("خطا در بارگذاری گفتگوها:", error);
            } finally {
                setLoading(false);
            }
        }

        loadConversations();
    }, [contractId, selectedConversationId, onSelect]);

    return (
        <section className="p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                گفتگوها
            </h2>

            {!contractId && (
                <p className="text-sm text-gray-400">
                    لطفاً یک قرارداد انتخاب کنید
                </p>
            )}

            {loading && (
                <p className="text-sm text-gray-400">
                    در حال بارگذاری...
                </p>
            )}

            {!loading && conversations.length === 0 && contractId && (
                <p className="text-sm text-gray-400">
                    هیچ گفتگویی وجود ندارد
                </p>
            )}

            <div className="space-y-2">
                {conversations.map((conversation) => {
                    const active = conversation.id === selectedConversationId;

                    return (
                        <button
                            key={conversation.id}
                            onClick={() => onSelect(conversation.id)}
                            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition
                            ${
                                active
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <MessageSquare className="h-4 w-4"/>

                            <span className="truncate">
                                {conversation.title || "گفتگوی جدید"}
                            </span>
                        </button>
                    );
                })}
            </div>
        </section>
    );
}