const API = "http://127.0.0.1:8000/api";

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
        title: "New Chat",
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