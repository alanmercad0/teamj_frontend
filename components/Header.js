import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { onAuthChange } from "../utils/firebaseFunctions";
import Link from 'next/link';


export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user)
      } else {
        console.log("no user");
      }
    });
    return () => unsubscribe();
  }, []);

  const triggerAuthentication = () => {
    // fetch(
    //   `${process.env.NEXT_PUBLIC_API_URL}/start_auth`
    // );
    window.open( `${process.env.NEXT_PUBLIC_API_URL}/start_auth`)
  };


  return (
    <div className="w-full bg-header_bg sticky p-4 flex flex-row justify-between items-center z-50 justify-between bg-[#2E2E30]">
      <div
        className="flex items-center gap-4 cursor-pointer"
        onClick={() => router.push("/")}
      >
        <img
          src="/small_chordmate_icon.png"
          className="object-contain rounded-lg w-[15%]"
        />
        <div className="text-lg font-bold ">CHORDMATE</div>
      </div>
      <div className="flex flex-row items-center w-1/2 gap-20 justify-end md:gap-10 sm:gap-2 ">
        <div className="flex flex-row gap-5">
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            main
          </div>
          <div
            className="cursor-pointer"
            onClick={() => router.push("/recommendation")}
          >
            recommendation
          </div>
          {/* <div>
          <p>Google Authentucation is required:</p>
          <div  onClick={triggerAuthentication}>
            <a>Authenticate</a>
          </div>
        </div> */}
        </div>
        {user ? (
          <>
            <button
              className="hover:ring-2 w-[50px] h-[50px] border-2 border-[#007AFF] rounded-full"
              onClick={() => router.push("/profile/2")}
            >
              <img
                src="/small_chordmate_icon.png"
                className="object-cover rounded-full w-[48px] h-[48px]"
              />
            </button>
          </>
        ) : (
          <div
            className="flex flex-row gap-8 md:gap-5 sm:gap-2 "
            style={{ gap: 8 }}
          >
            <button
              className="transition duration-300 bg-primary hover:bg-black text-white w-[142px] h-[42px] rounded-[25px]"
              onClick={() => router.push("/sign-up")}
            >
              Sign Up
            </button>
            <button
              className="relative group overflow-hidden flex border-2 border-indigo-300 items-center justify-center w-[142px] h-[42px] rounded-[25px]"
              onClick={() => router.push("/log-in")}
            >
              <span className="absolute inset-0 bg-gradient-to-r from-blue-200 via-indigo-300 to-purple-300 transition-transform duration-[400ms] ease-in-out transform scale-x-0 group-hover:scale-x-100 origin-left"></span>
              <span className="relative z-10 ">Log In</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
