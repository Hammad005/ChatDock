import { useImageOverlay } from "@/context/ImageOverlayContext";
import { useAuthStore } from "@/store/useAuthStore";
import { useRequestStore } from "@/store/useRequestStore";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const FriendRequest = () => {
  const { allUsers, userLoading } = useAuthStore();
  const { receivedRequests, rejectRequest, acceptRequest, requestsLoading } =
    useRequestStore();

  const { setIsOverlayOpen, setImageData } = useImageOverlay();

  const [filteredRequest, setfilteredRequest] = useState(
    allUsers?.filter((u) =>
      receivedRequests?.some((req) => req?.requestSender === u._id)
    )
  );

  useEffect(() => {
    setfilteredRequest(
      allUsers?.filter((u) =>
        receivedRequests?.some((req) => req?.requestSender === u._id)
      )
    );
  }, [allUsers, receivedRequests]);
  return (
    <div className="flex flex-col gap-6 mt-5">
      {userLoading ? (
        <Loader2 className="animate-spin text-center w-full" />
      ) : filteredRequest?.length > 0 ? (
        filteredRequest?.map((user) => (
          <div className="flex  flex-col gap-3 justify-between" key={user._id}>
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
              <div className="flex items-center justify-between w-full">
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
                <div className="flex flex-col">
                  <p></p>
                  <p className="text-xs text-muted-foreground">
                    {user.about.length > 25
                      ? `${user.about.slice(0, 25)}...`
                      : user.about}
                  </p>
                </div>
              </div>
            </div>

            <div
              className={`grid ${
                receivedRequests?.some(
                  (req) => req?.requestSender === user._id
                ) && "grid-cols-2"
              } gap-2 w-full`}
            >
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
                  "Cancel"
                )}
              </Button>
              <Button
                disabled={requestsLoading}
                className={"w-full"}
                onClick={() => {
                  const id = receivedRequests.find(
                    (req) => req?.requestSender === user._id
                  )?._id;
                  acceptRequest(id);
                }}
              >
                {requestsLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Accept Request"
                )}
              </Button>
            </div>
          </div>
        ))
      ) : (
        <h3 className="text-center font-bold">No friend requests</h3>
      )}
    </div>
  );
};

export default FriendRequest;
