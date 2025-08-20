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
import { toast } from "sonner";

const ChatArea = () => {
  const [data, setData] = useState({
    text: "",
    images: [],
    files: [],
  });
  const textareaRef = useRef(null);
  const filesUploadRef = useRef(null);
  const imagesUploadRef = useRef(null);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // reset height
      textarea.style.height = textarea.scrollHeight + "px"; // adjust to content
    }
  };

  const [open, setOpen] = useState(false);

  const handleImage = async (e) => {
    const files = Array.from(e.target.files);

    // Restrict maximum number of files
    if (files.length > 6) {
      toast.warning("You can only upload a maximum of 6 photos.");
      return;
    }

    // Calculate total size of all files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      toast.warning("Total size of photos must be less than or equal to 200MB.");
      return;
    }

    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setData((prev) => ({ ...prev, images }));
    e.target.value = "";
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    // Restrict maximum number of files
    if (files.length > 6) {
      toast.warning("You can only upload a maximum of 6 photos.");
      return;
    }

    // Calculate total size of all files
    const totalSize = files.reduce((acc, file) => acc + file.size, 0);
    if (totalSize > 200 * 1024 * 1024) {
      toast.warning("Total size of photos must be less than or equal to 200MB.");
      return;
    }

    const images = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setData((prev) => ({ ...prev, images }));
    e.target.value = "";
  };

  return (
    <div className="w-full p-3">
      <div className="flex items-end gap-2 w-full rounded-4xl bg-muted border dark:border-border border-muted-foreground/50 px-3 py-2">
        <input onChange={handleFiles} ref={filesUploadRef} type="file" hidden multiple />
        <input
          onChange={handleImage}
          ref={imagesUploadRef}
          type="file"
          accept="image/*"
          hidden
          multiple
        />

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
          <DropdownMenuContent className={"w-38"}>
            <DropdownMenuItem
              className={"text-base cursor-pointer"}
              onClick={() => filesUploadRef.current.click()}
            >
              <Files className="text-purple-500" />
              Documents
            </DropdownMenuItem>
            <DropdownMenuItem
              className={"text-base cursor-pointer"}
              onClick={() => imagesUploadRef.current.click()}
            >
              <Images className="text-blue-500" />
              Photos
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Message box */}
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          rows={1}
          className="w-full bg-transparent resize-none outline-none text-sm min-h-[40px] max-h-30 leading-relaxed pt-2"
          placeholder="Type a message..."
          style={{
            scrollbarColor: "var(--muted-foreground) transparent",
          }}
          value={data.text}
          onChange={(e) => setData({ ...data, text: e.target.value })}
        />

        {/* Send button */}
        {(data.text || data.images.length > 0 || data.files.length > 0) && (
          <Button size="icon" className="rounded-full">
            <Send className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ChatArea;
