import { currentUser } from "@clerk/nextjs/server";
import React from "react";

const DashboardPage = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-center hc text-center">
      <h2 className="text-lg font-medium">Hello {user?.firstName}!</h2>
    </div>
  );
};

export default DashboardPage;
