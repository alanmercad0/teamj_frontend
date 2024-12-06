import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Header from "../../../components/Header";
import { anonymousSignIn, logout, onAuthChange } from '../../../utils/firebaseFunctions';
import { useRouter } from 'next/router';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import TableOne from '../../../components/TableOne';

export default function UserHistory() {
  const router = useRouter()
  const [user, setUser] = useState()
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        setUser(user)
        const historyFetch = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/getHistory?id=${user.uid}`
        );
        const history = await historyFetch.json()
        setHistory(history)
      } else {
        console.log("no user");
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
      <div className="w-full h-svh bg-gradient-to-t from-[#66afff] to-primary">
        <div className="px-[5%]">
          <div className="font-bold text-[45px] font-sans mb-5">History</div>
          <TableOne arr={history} includeDateTime/>
        </div>
      </div>
    </>
  );
}
