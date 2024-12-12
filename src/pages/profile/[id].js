import Head from 'next/head';
import Header from '../../../components/Header';
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { logout, onAuthChange } from '../../../utils/firebaseFunctions';
import { userCheckHook } from '../../../hooks/user';

export default function UserProfile() {
  const router = useRouter();
  const [user, setUser] = useState();
  
  
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/log-in')
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>User Profile</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <Header />
      <div className="h-screen bg-gradient-to-tl from-blue-400 via-indigo-400 to-purple-400 text-white">
        <div className="w-full px-[5%] h-full">
          <div className="font-bold text-[45px] font-sans mb-5">Profile</div>
          <div className="w-full h-[80%] rounded-2xl p-10 flex flex-col bg-[#f0f0f0] overlow-y-auto text-black items-center justify-self-center">
            <div className="min-w-[100px] min-h-[100px] rounded-full bg-yellow-200 border-2 border-black items-center flex justify-center">
              <img
                src="/small_chordmate_icon.png"
                className="object-cover rounded-full w-[99px] h-[99px]"
              />
            </div>
            <div className="font-bold text-[25px]">
              {user?.displayName.split(";")[0]}
            </div>
            <div className="italic text-[12px] text-gray-400">
              {user?.displayName.split(";")[1]}
            </div>
            <div className="mt-[30px] flex flex-col w-full items-center gap-[10px]">
              <button
                className=" rounded-lg bg-primary py-[8px] px-[20px] w-1/4 text-white font-bold transition duration-300 hover:bg-black"
                onClick={() => router.push("/profile/history")}
              >
                History
              </button>
              <button
                className=" rounded-lg bg-primary py-[8px] px-[20px] w-1/4 text-white font-bold transition duration-300 hover:bg-black"
                onClick={() => router.push("/profile/liked_songs")}
              >
                Liked songs
              </button>
            </div>
            <button
              className="mt-28 rounded-lg bg-red-500 py-[8px] px-[20px] w-1/4 text-white font-bold transition duration-300 hover:bg-red-400"
              onClick={async () => {
                logout();
                router.push("/");
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
