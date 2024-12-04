import { useRouter } from "next/router";
import React from "react";

export default function Header() {
  const router = useRouter();
  return (
    <div
      className="w-full bg-header_bg sticky p-4 flex flex-row justify-between items-center"
      style={{ justifyContent: "space-between", backgroundColor: "#2E2E30" }}
    >
      <div
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        CHORDMATE
      </div>
      <div
        className="flex flex-row items-center w-1/2 gap-20 justify-end md:gap-10 sm:gap-2"
        style={{ gap: 20 }}
      >
        <div className="flex flex-row gap-5">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            main
          </div>
          <div className="cursor-pointer" onClick={() => router.push("/recommendation")}>
            recommendation
          </div>
        </div>
        <div
          className="flex flex-row gap-8 md:gap-5 sm:gap-2 "
          style={{ gap: 8 }}
        >
          <button
            style={{
              width: "142px",
              height: "42px",
              borderRadius: "25px",
              borderWidth: "1px",
            }}
            className="bg-primary border-primary hover:border-black hover:bg-black text-white hover:text-primary"
            onClick={() => router.push("/sign-up")}
          >
            Sign Up
          </button>
          <button
            className="hover:border-white text-primary hover:text-white"
            onClick={() => router.push("/log-in")}
          >
            Log In
          </button>
        </div>
      </div>
    </div>
  );
}
