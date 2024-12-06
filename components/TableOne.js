import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useRouter } from "next/router";
import React from "react";

export default function TableOne({ arr, includeDateTime = false, fromLikedSongs = false }) {
  const router = useRouter();
  function getHeaderRowClassName(tag) {
    return `px-2 py-3 font-medium w-fit dark:text-white cursor-default`;
  }

  function formatTime(datetime) {
    let time = new Date(datetime).toTimeString().split(" ")[0];
    const split = time.split(":");
    let hour = split[0];
    const min = split[1];
    let timeOfDay = "AM";

    if (hour >= 12) {
      if (hour > 12) hour -= 12;
      timeOfDay = "PM";
    }

    return `${hour}:${min} ${timeOfDay}`;
  }

  function formatDate(datetime) {
    let date = new Date(datetime).toDateString();
    const split = date.split(" ");
    return `${split[1]} ${split[2]}, ${split[3]}`;
  }

  return (
    <div className={`table-container relative overflow-y-auto `}>
      <table className="w-full rounded-lg">
        <thead className="">
          <tr className="justify-between h-[50px] cursor-pointer select-none bg-black px-4 py-4 text-left text-[12px] text-white">
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
              Genre
            </th>
            {includeDateTime && (
              <>
                <th
                  className={getHeaderRowClassName("client") + " max-w-[40px]"}
                  onClick={() => console.log("this")}
                >
                  Date
                </th>
                <th
                  className={getHeaderRowClassName("client") + " max-w-[40px]"}
                  onClick={() => console.log("this")}
                >
                  Time
                </th>
              </>
            )}
            <th
              className={getHeaderRowClassName("client") + " max-w-[10px]"}
              onClick={() => console.log("this")}
            ></th>
          </tr>
        </thead>
        <tbody className="">
          {arr?.map((item, key) => {
            console.log(new Date(item.datetime).toTimeString());
            return (
              <tr
                key={key}
                className={`select-none cursor-pointer bg-white even:bg-[#fafafa] h-[50px] text-left text-[12px] text-black hover:bg-[#eaeaea]`}
                onClick={() => router.push(`/result?id=${item.id}`)}
              >
                {/* <td className="px-2 ">{item}</td> */}
                <td className="max-w-[100px] px-2 text-left">{item.title}</td>
                {/* <td className="px-2 ">{order.type}</td> */}
                <td className="px-2 ">{item.artist}</td>
                {/* <td className="px-2 ">{order.supplier}</td> */}
                <td className="px-2 ">{item.genre}</td>
                {includeDateTime && (
                  <>
                    <td className="px-2 max-w-[40px]">
                      {formatDate(item.datetime)}
                    </td>
                    <td className="px-2 max-w-[40px]">
                      {formatTime(item.datetime)}
                    </td>
                  </>
                )}
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
                  {(item.liked || fromLikedSongs) ? <Favorite /> : <FavoriteBorder />}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
