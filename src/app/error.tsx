"use client";
import Link from "next/link";
import React from "react";

const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center hc w-full">
      <h4 className=" text-center text-lg font-medium">
        It seems that you have hit a page that does not exist. Please go back to
        the{" "}
        <Link className="text-blue-500 underline" href="/">
          home page
        </Link>{" "}
        .
      </h4>
    </div>
  );
};

export default ErrorPage;
