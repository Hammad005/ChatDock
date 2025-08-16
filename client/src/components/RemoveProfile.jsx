import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useAuthStore } from "@/store/useAuthStore";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const RemoveProfile = ({ open, setOpen }) => {
  const { removeProfile } = useAuthStore();

  const [loading, setLoading] = useState(false);
  const handleRemove = async () => {
    setLoading(true);
    const res = await removeProfile();
    if (res?.success) {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <>
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className={"text-sm font-normal"}>
              Remove your profile photo?
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className={'rounded-full'} disabled={loading} onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction className={'rounded-full'} disabled={loading} onClick={handleRemove}>
              {loading ? <Loader2 className="animate-spin" /> : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RemoveProfile;
