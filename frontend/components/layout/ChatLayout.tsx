"use client";

import { useState } from "react";

import { Sidebar } from "@/components/sidebar/Sidebar";
import { ChatWindow } from "@/components/chat/ChatWindow";

export function ChatLayout() {
  const [selectedContractId, setSelectedContractId] =
    useState<string | null>(null);

  const [
    selectedConversationId,
    setSelectedConversationId,
  ] = useState<string | null>(null);

  return (
    <div className="flex h-screen">

      <Sidebar
        selectedContractId={
          selectedContractId
        }
        onContractSelect={
          setSelectedContractId
        }
        selectedConversationId={
          selectedConversationId
        }
        onConversationSelect={
          setSelectedConversationId
        }
      />

      <ChatWindow
        contractId={selectedContractId}
        conversationId={
          selectedConversationId
        }
        onConversationCreated={
          setSelectedConversationId
        }
      />

    </div>
  );
}