import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Files, Images, Plus, Send } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ChatArea = () => {
  const [data, setData] = useState({
    text: "",
    images: [],
    files: [],
  });
  const textareaRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust to content
    }
  };

  const [open, setOpen] = useState(false);

  return (
    <div className="w-full p-3">
      <div className="flex items-end gap-2 w-full rounded-4xl bg-muted border dark:border-border border-muted-foreground/50 px-3 py-2">
      <input type="file" accept="image/*" hidden multiple/>
      <input type="file" hidden multiple />

        {/* Attach button */}
        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger>
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full hover:bg-muted-foreground/30 transition-all ease-in-out duration-300 ${
                open && "rotate-225"
              }`}
            >
              <Plus />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem><Files className="text-purple-500"/>Documents</DropdownMenuItem>
            <DropdownMenuItem><Images className="text-blue-500"/>Photos</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
          value={data.text}
          onChange={(e) => setData({ ...data, text: e.target.value })}
        />

        {/* Send button */}
        {(data.text || data.images.length > 0 || data.files.length > 0) && <Button size="icon" className="rounded-full">
          <Send className="h-5 w-5" />
        </Button>}
      </div>
    </div>
  );
};

export default ChatArea;
