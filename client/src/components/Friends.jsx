import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FriendRequest from "./FriendRequest";
import MyFirends from "./MyFirends";

const Friends = () => {
  
  

  return (
    <>
      <div className="flex flex-col items-center w-full gap-4 mt-5">
        <Tabs defaultValue="Friend Requests" className="w-full ">
          <TabsList className={"w-full "}>
            <TabsTrigger value="Friend Requests">Friend Requests</TabsTrigger>
            <TabsTrigger value="My Friends">My Friends</TabsTrigger>
          </TabsList>


          <TabsContent value="Friend Requests">
           <FriendRequest/>
          </TabsContent>

          <TabsContent value="My Friends">
            <MyFirends/>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default Friends;
