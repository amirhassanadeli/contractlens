const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getConversations(
    contractId: string,
) {
    const response = await fetch(
        `${API}/conversations/?contract_id=${contractId}`,
    );

    if (!response.ok) {
        throw new Error(
            "Failed to load conversations",
        );
    }

    return response.json();
}

export async function createConversation(
    contractId: string,
) {
    const response = await fetch(
        `${API}/conversations/`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contract_id: contractId,
            }),
        },
    );

    if (!response.ok) {
        throw new Error(
            "Failed to create conversation",
        );
    }

    return response.json();
}