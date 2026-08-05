"use client";

import { useEffect, useState } from "react";

import { MessageSquare } from "lucide-react";

import type { Conversation } from "@/types/conversation";

import { getConversations } from "@/services/conversations";

type ConversationListProps = {
  contractId: string | null;

  selectedConversationId: string | null;

  onSelect: (
    id: string,
  ) => void;
};

export function ConversationList({
  contractId,
  selectedConversationId,
  onSelect,
}: ConversationListProps) {
  const [conversations, setConversations] =
    useState<Conversation[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    if (!contractId) {
      setConversations([]);
      return;
    }

    async function loadConversations() {
      try {
        setLoading(true);

        const data =
          await getConversations(
            contractId,
          );

        console.log(
          "Conversations:",
          data,
        );

        setConversations(data);

        if (
          data.length > 0 &&
          !selectedConversationId
        ) {
          onSelect(data[0].id);
        }

      } catch (error) {
        console.error(error);

      } finally {
        setLoading(false);
      }
    }

    loadConversations();
  }, [contractId]);

  return (
    <section className="p-4">

      <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">
        Conversations
      </h2>

      {!contractId && (
        <p className="text-sm text-gray-400">
          Select a contract
        </p>
      )}

      {loading && (
        <p className="text-sm text-gray-400">
          Loading...
        </p>
      )}

      <div className="space-y-2">

        {conversations.map(
          (conversation) => {

            const active =
              conversation.id ===
              selectedConversationId;

            return (
              <button
                key={conversation.id}
                onClick={() =>
                  onSelect(
                    conversation.id,
                  )
                }
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition
                ${
                  active
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >

                <MessageSquare className="h-4 w-4" />

                <span className="truncate">
                  {conversation.title}
                </span>

              </button>
            );
          },
        )}

      </div>

    </section>
  );
}