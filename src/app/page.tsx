import { Button } from "@/components/ui/button";
import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const user = await currentUser();
  return (
    <div className="hc flex flex-col items-center justify-center w-full max-w-xl mx-auto h-full">
      <h1 className="text-center w-full text-2xl font-semibold">
        Welcome to the Next.js + Clerk Starter Kit!
      </h1>
      <p className="text-muted-foreground text-balance text-center mt-4">
        {user ? (
          <>
            Welcome back,{" "}
            <span className="text-black font-bold">
              {user.emailAddresses?.[0].emailAddress}
            </span>
            !
          </>
        ) : (
          "Please sign in to continue."
        )}
      </p>
      {user ? (
        <Button asChild size="sm" className="mt-6">
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <Button asChild size="sm" className="mt-6">
          <Link href="/sign-in">Sign In</Link>
        </Button>
      )}
    </div>
  );
}
