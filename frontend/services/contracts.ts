const API = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getContracts() {
    const response = await fetch(
        `${API}/contracts/`
    );

    if (!response.ok) {
        throw new Error("Failed to load contracts");
    }

    return response.json();
}

export async function uploadContract(
    file: File,
) {
    const formData = new FormData();

    formData.append(
        "title",
        file.name.replace(".pdf", ""),
    );

    formData.append("language", "EN");

    formData.append("file", file);

    const response = await fetch(
        `${API}/contracts/`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        throw new Error("Upload failed");
    }

    return response.json();
}