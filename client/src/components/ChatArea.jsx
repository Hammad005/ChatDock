import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { FileIcon, Files, Images, Loader, Plus, Send, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useChatStore } from "@/store/useChatStore";

const ChatArea = ({ chatData, setChatData, fileName, setFileName, handleSubmit }) => {

  const {messagesLoading} = useChatStore();

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
      e.target.value = "";
      return;
    } else if (chatData.images.length + files.length > 6) {
      toast.warning("You can only upload a maximum of 6 photos.");
      e.target.value = "";
      return;
    }

    // ✅ include existing images size in calculation
    const totalSize =
      chatData.images.reduce((acc, img) => acc + img.length, 0) +
      files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 200 * 1024 * 1024) {
      toast.warning(
        "Total size of photos must be less than or equal to 200MB."
      );
      e.target.value = "";
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

    setChatData((prev) => ({ ...prev, images: [...prev.images, ...images] }));

    // ✅ Clear input so re-uploads always work
    e.target.value = "";
  };

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files);

    // Restrict maximum number of files
    if (files.length > 6) {
      toast.warning("You can only upload a maximum of 6 files.");
      e.target.value = "";
      return;
    } else if (chatData.files.length + files.length > 6) {
      toast.warning("You can only upload a maximum of 6 files.");
      e.target.value = "";
      return;
    }

    // ✅ include existing images size in calculation
    const totalSize =
      chatData.files.reduce((acc, file) => acc + file.length, 0) +
      files.reduce((acc, file) => acc + file.size, 0);

    if (totalSize > 200 * 1024 * 1024) {
      toast.warning("Total size of files must be less than or equal to 200MB.");
      e.target.value = "";
      return;
    }

    const uploadedFiles = await Promise.all(
      files.map(
        (file) =>
          new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(file);
          })
      )
    );

    setChatData((prev) => ({
      ...prev,
      files: [...prev.files, ...uploadedFiles],
    }));
    setFileName([...fileName, ...files.map((file) => file.name.length > 20 ? file.name.slice(0, 20) + "..." : file.name)]);

    // ✅ Clear input so re-uploads always work
    e.target.value = "";
  };

  return (
    <div className="w-full p-3">
      <div className="flex flex-col gap-2 w-full rounded-4xl bg-muted border dark:border-border border-muted-foreground/50 px-3 py-2 overflow-y-auto max-h-[600px]">
        {chatData.images.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 w-fit">
            {chatData.images.map((image, index) => (
              <div key={index} className="relative">
                <img
                  src={image}
                  alt="loading"
                  draggable={false}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <Button
                disabled={messagesLoading}
                  size="icon"
                  className="absolute top-0 right-0"
                  onClick={() =>
                    setChatData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
        {chatData.files.length > 0 && (
          <div className="grid md:grid-cols-3  gap-2 w-full">
            {chatData.files.map((files, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-2 w-full border border-muted-foreground p-4 rounded-lg whitespace-nowrap"
              >
                <FileIcon className="w-6 h-6 text-purple-500" />
                <span className="text-sm">{fileName[index]}</span>
                <Button
                disabled={messagesLoading}
                  variant={"outline"}
                  size="icon"
                  onClick={() => {
                    setChatData((prev) => ({
                      ...prev,
                      files: prev.files.filter((_, i) => i !== index),
                    }));
                    setFileName((prev) => prev.filter((_, i) => i !== index));
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 w-full">
          <input
            onChange={handleFiles}
            ref={filesUploadRef}
            type="file"
            hidden
            multiple
          />
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
            value={chatData.text}
            onChange={(e) => setChatData({ ...chatData, text: e.target.value })}
          />

          {/* Send button */}
          {(chatData.text ||
            chatData.images.length > 0 ||
            chatData.files.length > 0) && (
            <Button size="icon" className="rounded-full" onClick={async() => {
              const res = await handleSubmit()
              if (res?.success && textareaRef.current) {
                textareaRef.current.style.height = "40px";
              }
            }} disabled={messagesLoading}>
              {messagesLoading ? <Loader className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
