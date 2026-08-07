"use client";

import {ContractList} from "./ContractList";
import {ConversationList} from "./ConversationList";

type SidebarProps = {
    selectedContractId: string | null;

    onContractSelect: (
        id: string,
    ) => void;

    selectedConversationId: string | null;

    onConversationSelect: (
        id: string,
    ) => void;
};

export function Sidebar({
                            selectedContractId,
                            onContractSelect,
                            selectedConversationId,
                            onConversationSelect,
                        }: SidebarProps) {
    return (
        <aside className="flex w-80 flex-col border-r bg-white">

            <div className="border-b p-6">

                <h1 className="text-2xl font-bold">
                    ContractLens
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    AI Contract Assistant
                </p>

            </div>

            <div className="flex-1 overflow-y-auto">

                <ContractList
                    selectedContractId={
                        selectedContractId
                    }
                    onSelect={onContractSelect}
                />

                <ConversationList
                    contractId={
                        selectedContractId
                    }
                    selectedConversationId={
                        selectedConversationId
                    }
                    onSelect={
                        onConversationSelect
                    }
                />

            </div>

        </aside>
    );
}