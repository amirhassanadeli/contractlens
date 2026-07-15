"use client";

import {
  Copy,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";

type MessageActionsProps = {
  liked: boolean | null;

  onLike: () => void;
  onDislike: () => void;
  onCopy: () => void;
  onRegenerate: () => void;
};

export function MessageActions({
  liked,
  onLike,
  onDislike,
  onCopy,
  onRegenerate,
}: MessageActionsProps) {
  return (
    <div className="mt-3 flex items-center gap-1">

      <button
        onClick={onLike}
        className={`rounded-md p-2 hover:bg-muted ${
          liked === true ? "text-green-600" : ""
        }`}
      >
        <ThumbsUp size={18} />
      </button>

      <button
        onClick={onDislike}
        className={`rounded-md p-2 hover:bg-muted ${
          liked === false ? "text-red-600" : ""
        }`}
      >
        <ThumbsDown size={18} />
      </button>

      <button
        onClick={onCopy}
        className="rounded-md p-2 hover:bg-muted"
      >
        <Copy size={18} />
      </button>

      <button
        onClick={onRegenerate}
        className="rounded-md p-2 hover:bg-muted"
      >
        <RefreshCw size={18} />
      </button>

    </div>
  );
}