export type Message = {
  id: string;

  role: "USER" | "ASSISTANT";
  
  content: string;

  sources: {
    filename: string;
    page: number;
    excerpt: string;
  }[];

  liked: boolean | null;

  regenerated_from?: string | null;

  created_at: string;
};