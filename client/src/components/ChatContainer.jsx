import { MailWarning } from "lucide-react";

const ChatContainer = () => {
  return (
    <>
      <div className="flex items-end pb-5 justify-center h-full">
        <span className="flex items-center text-muted-foreground bg-background p-2 rounded-lg border md:text-sm text-[10px]">
          <MailWarning className="mr-2 size-5 text-primary" />
          No Messages yet, start a conversation now.
        </span>
      </div>
    </>
  );
};

export default ChatContainer;
