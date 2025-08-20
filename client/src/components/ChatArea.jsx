import React, { useRef } from "react";
import { Button } from "./ui/button";
import { Plus, Send } from "lucide-react";

const ChatArea = () => {
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust to content
    }
  };
  return (
    <div className="w-full lg:p-3">
      <div className="flex items-end gap-2 w-full rounded-4xl bg-background border dark:border-border border-muted-foreground/50 px-3 py-2">
        {/* Attach button */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-muted-foreground/30 transition-colors ease-in-out duration-300"
        >
          <Plus />
        </Button>

        {/* Message box */}
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          rows={1}
          className="w-full bg-transparent resize-none outline-none text-sm min-h-[40px] max-h-40 leading-relaxed pt-2"
          placeholder="Type a message..."
          style={{
            scrollbarColor: "var(--muted-foreground) transparent",
          }}
        />

        {/* Send button */}
        <Button size="icon" className="rounded-full">
          <Send className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatArea;
