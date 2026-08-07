"use client";

import {useEffect, useState} from "react";

import {FileText} from "lucide-react";

import type {Contract} from "@/types/contract";

import {getContracts} from "@/services/contracts";

type ContractListProps = {
    selectedContractId: string | null;

    onSelect: (id: string) => void;
};

export function ContractList({
                                 selectedContractId,
                                 onSelect,
                             }: ContractListProps) {
    const [contracts, setContracts] =
        useState<Contract[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        async function loadContracts() {
            try {
                const data =
                    await getContracts();

                console.log(
                    "Contracts:",
                    data,
                );

                setContracts(data);

                // اولین قرارداد را به صورت خودکار انتخاب کن
                if (
                    data.length > 0 &&
                    !selectedContractId
                ) {
                    onSelect(data[0].id);
                }

            } catch (error) {
                console.error(error);

            } finally {
                setLoading(false);
            }
        }

        loadContracts();
    }, []);

    return (
        <section className="border-b p-4">

            <h2 className="mb-3 text-sm font-semibold uppercase text-gray-500">
                Contracts
            </h2>

            {loading && (
                <p className="text-sm text-gray-400">
                    Loading...
                </p>
            )}

            <div className="space-y-2">

                {contracts.map((contract) => {

                    const active =
                        contract.id ===
                        selectedContractId;

                    return (
                        <button
                            key={contract.id}
                            onClick={() =>
                                onSelect(contract.id)
                            }
                            className={`flex w-full items-center gap-3 rounded-lg p-2 text-left transition
                ${
                                active
                                    ? "bg-black text-white"
                                    : "hover:bg-gray-100"
                            }`}
                        >
                            <FileText className="h-4 w-4"/>

                            <span className="truncate">
                {contract.title}
              </span>

                        </button>
                    );
                })}

            </div>

        </section>
    );
}