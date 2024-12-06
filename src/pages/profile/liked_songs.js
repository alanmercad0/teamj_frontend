import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Header from "../../../components/Header";
import { onAuthChange } from '../../../utils/firebaseFunctions';
import { useRouter } from 'next/router'
import TableOne from '../../../components/TableOne';


export default function UserLikedSongs() {
  const router = useRouter()
  const [user, setUser] = useState()
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setUser(user)
        const likedSongsFetch = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getLikedSongs?id=${user.uid}`
        );
        const likedSongs = await likedSongsFetch.json()
        setLikedSongs(likedSongs)
      } else {
        router.push("/log-in");
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <>
      <Head>
        <title>User History</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <Header />
      {/* <button onClick={async () => await anonymousSignIn()}>
        {" "}
        CLick MEEREaadw
      </button>
      <button onClick={async () => await logout()}>NOOO</button> */}
      <div className="w-full h-svh bg-gradient-to-tl from-purple-200 via-blue-200 to-indigo-300">
        <div className="px-[5%]">
          <div className="font-bold text-[45px] font-sans mb-5">Liked Songs</div>
          <TableOne arr={likedSongs} fromLikedSongs/>
        </div>
      </div>
    </>
  );
}
