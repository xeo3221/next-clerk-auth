import React from "react";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

const AuthCallbackPage = async () => {
  const user = await currentUser();

  if (!user?.id || !user?.primaryEmailAddressId) {
    return redirect("/sign-in");
  }

  const dbUser = await db.user.findUnique({
    where: {
      clerkId: user.id,
    },
  });

  if (!dbUser) {
    await db.user.create({
      data: {
        id: user.id,
        clerkId: user.id,
        email: user.primaryEmailAddress?.emailAddress as string,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
    return redirect("/dashboard");
  } else {
    return redirect("/");
  }

  return <div>AuthCallbackPage</div>;
};

export default AuthCallbackPage;
