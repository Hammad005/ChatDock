import React, { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "./ui/button";
import { Loader2, UserMinus, UserPlus } from "lucide-react";
import { useImageOverlay } from "@/context/ImageOverlayContext";
import { toast } from "sonner";
import { useRequestStore } from "@/store/useRequestStore";

const Suggestions = () => {
  const { allUsers, userLoading } = useAuthStore();

  const {
    sendRequest,
    requestsLoading,
    sendedRequests,
    receivedRequests,
    rejectRequest,
  } = useRequestStore();

  const { setIsOverlayOpen, setImageData } = useImageOverlay();

  const [filteredUser, setfilteredUser] = useState(allUsers);

  useEffect(() => {
    setfilteredUser(allUsers);
  }, [allUsers]);

  const handleRequest = (id) => {
    sendRequest(id);
  };
  return (
    <>
      <div className="flex flex-col items-center w-full gap-4 mt-5">
        <Input
          type="text"
          placeholder="Search for a user"
          className="rounded-full focus-visible:ring-[1px]"
          onChange={(e) => {
            const filtered = allUsers.filter((user) => {
              return user?.fullName
                ?.toLowerCase()
                .includes(e.target.value.toLowerCase());
            });
            setfilteredUser(filtered);
          }}
        />

        <div className="flex flex-col  w-full gap-6">
          <div>
            <h3 className="text-2xl font-semibold tracking-wider">
              Suggestions
            </h3>
            <p className="text-xs text-muted-foreground">People you may know</p>
          </div>

          {userLoading ? (
            <Loader2 className="animate-spin text-center w-full" />
          ) : (
            filteredUser?.map((user) => (
              <div
                className="flex  flex-col gap-3 justify-between "
                key={user._id}
              >
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => {
                      if (user?.profilePic?.imageUrl) {
                        setIsOverlayOpen(true);
                        setImageData({
                          image: user?.profilePic?.imageUrl,
                          name: user?.fullName,
                        });
                      } else {
                        toast.error("No profile photo");
                      }
                    }}
                    className="size-12 object-contain cursor-pointer rounded-full overflow-hidden border-2 border-primary bg-primary/50"
                  >
                    {user?.profilePic?.imageUrl ? (
                      <img
                        src={user?.profilePic?.imageUrl}
                        alt="loading"
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <p className="flex items-center justify-center h-full w-full text-white font-semibold text-base">
                        {user?.fullName?.charAt(0).toUpperCase()}
                      </p>
                    )}
                  </button>
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold">
                      {user.fullName.length > 25
                        ? `${user.fullName.slice(0, 25)}...`
                        : user.fullName}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {user.about.length > 25
                        ? `${user.about.slice(0, 25)}...`
                        : user.about}
                    </p>
                  </div>
                </div>

                <div
                  className={`grid ${
                    receivedRequests?.some(
                      (req) => req?.requestSender === user._id
                    ) && "grid-cols-2"
                  } gap-2 w-full`}
                >
                  {receivedRequests?.some(
                    (req) => req?.requestSender=== user._id
                  ) && (
                    <Button
                      variant={"outline"}
                      className={"w-full"}
                      onClick={() => {
                        const id = receivedRequests.find(
                          (req) => req?.requestSender === user._id
                        )?._id;
                        rejectRequest(id);
                      }}
                    >
                      {requestsLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Reject Request"
                      )}
                    </Button>
                  )}
                  <Button
                    disabled={requestsLoading}
                    className={"w-full"}
                    variant={
                      sendedRequests?.some(
                        (req) => req?.requestReceiver === user._id
                      )
                        ? "secondary"
                        : receivedRequests?.some(
                            (req) => req?.requestSender === user._id
                          )
                        ? "default"
                        : "default"
                    }
                    onClick={() => {

                      if (
                        sendedRequests?.some(
                          (req) => req?.requestReceiver === user._id
                        )
                      ) {
                        // Cancel request → pass requestId
                        return rejectRequest(
                          sendedRequests.find(
                            (req) => req?.requestReceiver === user._id
                          )?._id
                        )
                      } else if (
                        receivedRequests?.some(
                          (req) => req?.requestSender === user._id
                        )
                      ) {
                        // Accept request → you probably want to pass requestId here too
                        const id = receivedRequests.find(
                          (req) => req?.requestSender === user._id
                        )?._id;
                        console.log(id);
                        
                      } else {
                        // Send request → pass userId
                        handleRequest(user._id);
                      }

                    }}
                  >
                    {requestsLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : sendedRequests?.some(
                        (req) => req?.requestReceiver === user._id
                      ) ? (
                      <>
                        <UserMinus /> Cancel Request
                      </>
                    ) : receivedRequests?.some(
                        (req) => req?.requestSender === user._id
                      ) ? (
                      <>Accept Request</>
                    ) : (
                      <>
                        <UserPlus /> Add Friend
                      </>
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Suggestions;
