import React, { useEffect, useState } from 'react'
import Head from "next/head";
import Header from "../../../components/Header";
import { anonymousSignIn, logout, onAuthChange } from '../../../utils/firebaseFunctions';
import { useRouter } from 'next/router';
import { Favorite, FavoriteBorder } from '@mui/icons-material';

export default function UserHistory() {
  const router = useRouter()
  const [user, setUser] = useState()
  const [history, setHistory] = useState([]);
  function getHeaderRowClassName(tag) {
    return `px-2 py-3 font-medium w-fit hover:bg-gray-700 dark:text-white`;
  }

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

  function formatTime(datetime){
    let time = new Date(datetime).toTimeString().split(' ')[0]
    const split = time.split(':')
    let hour = split[0]
    const min = split[1]
    let timeOfDay = 'AM'

    if(hour >= 12){
      if(hour > 12) hour -= 12
      timeOfDay = 'PM'
    }

    return `${hour}:${min} ${timeOfDay}`
  }

  function formatDate(datetime){
    let date = new Date(datetime).toDateString()
    const split = date.split(' ')
    return `${split[1]} ${split[2]}, ${split[3]}`
  }

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
          <div className={`table-container relative overflow-y-auto `}>
            <table className="w-full">
              <thead className="sticky top-0 z-10">
                <tr className="justify-between h-[50px] cursor-pointer select-none bg-black px-4 py-4 text-left text-[12px] text-white">
                  {/* <th
                    className={getHeaderRowClassName("id") + " text-center"}
                    onClick={() => console.log("this")}
                  >
                    #
                  </th> */}
                  <th
                    className={getHeaderRowClassName("job")}
                    onClick={() => console.log("this")}
                  >
                    Song Name
                  </th>
                  <th
                    className={getHeaderRowClassName("date") + " max-w-[50px]"}
                    onClick={() => console.log("this")}
                  >
                    Artist
                  </th>
                  <th
                    className={getHeaderRowClassName("client")}
                    onClick={() => console.log("this")}
                  >
                    Date
                  </th>
                  <th
                    className={getHeaderRowClassName("client")+ " max-w-[40px]"}
                    onClick={() => console.log("this")}
                  >
                    Date
                  </th>
                  <th
                    className={getHeaderRowClassName("client")+ " max-w-[40px]"}
                    onClick={() => console.log("this")}
                  >
                    Time
                  </th>
                  <th
                    className={getHeaderRowClassName("client") + " max-w-[10px]"}
                    onClick={() => console.log("this")}
                  ></th>
                </tr>
              </thead>
              <tbody className="rounded-lg">
                {history?.map((item, key) => {
                  console.log(new Date(item.datetime).toTimeString())
                  return (
                    <tr
                      key={key}
                      className={`select-none cursor-pointer border-b border-[#eee] h-[50px] text-left text-[12px] text-black hover:bg-[#eaeaea] ${
                        key % 2 == 0 ? "bg-[#fafafa]" : "bg-white"
                      } `}
                      onClick={() => router.push(`/result?id=${item.id}`)}
                    >
                      {/* <td className="px-2 ">{item}</td> */}
                      <td className="max-w-[100px] px-2 text-left">
                        {item.title}
                      </td>
                      {/* <td className="px-2 ">{order.type}</td> */}
                      <td className="px-2 ">{item.artist}</td>
                      {/* <td className="px-2 ">{order.supplier}</td> */}
                      <td className="px-2 ">{item.genre}</td>
                      <td className="px-2 max-w-[40px]">{formatDate(item.datetime)}</td>
                      <td className="px-2 max-w-[40px]">{formatTime(item.datetime)}</td>
                      <td className="max-w-[10px]">
                        {/* <button
                          onClick={(e) => {
                            e.preventDefault();
                            console.log("like song");
                          }}
                          className="hover:text-red-500 z-[999]"
                        >
                          {"<3"}
                        </button> */}
                        {item.liked ? <Favorite /> : <FavoriteBorder />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
