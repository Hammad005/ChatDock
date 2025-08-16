import { useAuthStore } from "@/store/useAuthStore";
import {
  Check,
  Edit2,
  Eye,
  FolderOpen,
  Image,
  Loader2,
  Trash2,
} from "lucide-react";
import React, { useRef, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useImageOverlay } from "@/context/ImageOverlayContext";
import RemoveProfile from "./RemoveProfile";

const Profile = () => {
  const { user, updateUserLoading, update } = useAuthStore();
  const [overlayActive, setOverlayActive] = useState(false);
  const { setIsOverlayOpen, setImageData } = useImageOverlay();

  const [data, setData] = useState({
    fullName: user?.fullName,
    about: user?.about,
    profilePic: null,
  });

  const [showNameInput, setShowNameInput] = useState(false);
  const [showAboutInput, setShowAboutInput] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadRef = useRef(false);

  const [open, setOpen] = useState(false)

  const handleUpdate = async () => {
    const res = await update(data);
    if (res?.success) {
      setShowNameInput(false);
      setShowAboutInput(false);
    }
  };

  const handleImage = (e) => {
    setUploadingImage(true);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setData({ ...data, profilePic: reader.result });
        const res = await update({ ...data, profilePic: reader.result });
        if (res?.success) {
          setUploadingImage(false);
        }
        e.target.value = ""; // reset so same file can be selected again
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <>
    <RemoveProfile open={open} setOpen={setOpen} />
      <div className="flex flex-col items-center w-full gap-4 mt-10">
        <DropdownMenu onOpenChange={(open) => setOverlayActive(open)}>
          <DropdownMenuTrigger asChild disabled={updateUserLoading}>
            <div className="relative">
              {/* Profile picture */}
              <div className="size-[130px] group cursor-pointer object-contain rounded-full border-2 border-primary overflow-hidden bg-primary/50">
                {user?.profilePic?.imageUrl ? (
                  <img
                    src={user?.profilePic?.imageUrl}
                    alt="loading"
                    className="w-full h-full object-cover object-top"
                  />
                ) : (
                  <p className="flex items-center justify-center h-full text-white font-semibold text-6xl">
                    {user?.fullName?.charAt(0).toUpperCase()}
                  </p>
                )}

                {uploadingImage && (
                  <div
                    className={`absolute inset-0 size-[130px] rounded-full flex flex-col items-center justify-center 
                    bg-black/60 backdrop-blur`}
                  >
                    <Loader2 className="animate-spin text-white" />
                  </div>
                )}

                {/* Overlay */}
                {!uploadingImage && (
                  <div
                    className={`absolute inset-0 size-[130px] rounded-full flex flex-col items-center justify-center gap-2
                    bg-black/60 backdrop-blur text-white opacity-0 
                    group-hover:opacity-100 ${
                      overlayActive && "opacity-100"
                    } transition-opacity duration-300`}
                  >
                    <Image />
                    <p className="text-center font-semibold text-xs w-1/2">
                      {user?.profilePic?.imageUrl
                        ? "Change Profile Photo"
                        : "Add Profile Photo"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem
              disabled={!user?.profilePic?.imageUrl}
              onClick={() => {
                setIsOverlayOpen(true);
                setImageData({
                  name: user?.fullName,
                  image: user?.profilePic?.imageUrl,
                });
              }}
            >
              <Eye /> View photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => uploadRef.current?.click()}>
              <FolderOpen /> Uplaod photo
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive" onClick={() => setOpen(true)}>
              <Trash2 /> Remove photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <input
          type="file"
          className="hidden"
          accept=".jpeg,.jpg,.png,.webp"
          ref={uploadRef}
          onChange={handleImage}
        />
        <div className="mt-8 flex flex-col gap-10 w-full">
          <div className="flex flex-col gap-6">
            <p className="text-sm text-muted-foreground">Full Name</p>
            <div className="flex items-center justify-between">
              {showNameInput ? (
                <div className="flex items-center justify-between border-b-[1.8px]  border-b-primary w-full">
                  <input
                    type="text"
                    className="text-lg w-full focus:outline-none"
                    value={data.fullName}
                    onChange={(e) =>
                      setData({ ...data, fullName: e.target.value })
                    }
                  />
                  <button onClick={handleUpdate} disabled={updateUserLoading}>
                    {updateUserLoading ? (
                      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-primary cursor-pointer" />
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-base">{user?.fullName}</p>
                  <Edit2
                    className="w-5 h-5 text-primary cursor-pointer"
                    onClick={() => setShowNameInput(true)}
                  />
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              This is not your username or PIN. This name will be visible to
              your ChatDock account.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            <p className="text-sm text-muted-foreground">About</p>
            <div className="flex items-center justify-between">
              {showAboutInput ? (
                <div className="flex items-end justify-between border-b-[1.8px]  border-b-primary w-full">
                  <textarea
                    className="text-lg w-full focus:outline-none resize-none overflow-hidden"
                    rows={1}
                    value={data?.about}
                    onChange={(e) => {
                      e.target.style.height = "auto"; // reset height
                      e.target.style.height = e.target.scrollHeight + "px"; // adjust height
                      setData({ ...data, about: e.target.value });
                    }}
                  />

                  <button onClick={handleUpdate} disabled={updateUserLoading}>
                    {updateUserLoading ? (
                      <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
                    ) : (
                      <Check className="w-5 h-5 text-primary cursor-pointer" />
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-base">
                    {user?.about
                      ? user?.about
                      : "Hey there! I am using ChatDock."}
                  </p>
                  <Edit2
                    className="w-5 h-5 text-primary cursor-pointer"
                    onClick={() => setShowAboutInput(true)}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
