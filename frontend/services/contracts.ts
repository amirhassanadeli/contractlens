const API = "http://127.0.0.1:8000/api";

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
    throw new Error(
      `Upload failed (${response.status})`,
    );
  }

  return response.json();
}