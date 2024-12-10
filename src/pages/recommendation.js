import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Head from "next/head";
import localFont from "next/font/local";
import { logout, onAuthChange } from '../../utils/firebaseFunctions';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function RecommendationPage() {
  const [user, setUser] = useState();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (user) => {
      if (user) {
        console.log(user);
        setUser(user);
        try {
          const historyFetch = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/getRecommendationHistory?id=${user.uid}`
          );
          if (!historyFetch.ok) {
            throw new Error("Failed to fetch recommendations");
          }
          const history = await historyFetch.json();
          setHistory(history);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("no user");
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div>
        <Header />
        <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-400 text-white">
          <div className="flex flex-col items-center text-white font-bold text-3xl pt-8 mb-2">
            <p className="text-lg">Loading recommendations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="flex justify-center pt-10"><p className="text-lg text-white">Error: {error}</p></div>;
  }

  if (!user) {
    return (
      <div className="flex justify-center pt-10">
        <p className="text-lg text-white">Please log in to view your recommendations.</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Music Recommendations</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <div className="min-h-screen h-fit bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-400 text-white">
        <Header />

        {/* Title */}
        <div className="flex text-white font-bold text-3xl justify-center pt-8 mb-2">
          Recommendation History
        </div>

        {/* Recommendation Table */}
        {history.length > 0 ? (
          <div className="overflow-x-auto w-full pt-10 px-6 pb-[100px]">
            <table className="w-full max-w-4xl mx-auto text-sm bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-2 text-left">Track Name</th>
                  <th className="p-2 text-left">Genre</th>
                  <th className="p-2 text-left">Artist</th>
                  <th className="p-2 text-left">Popularity</th>
                  <th className="p-2 text-left">Date Recommended</th>
                </tr>
              </thead>
              <tbody>
                {history.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4 text-black">{item[1]}</td> {/* Track Name */}
                    <td className="p-4 text-black">{item[3]}</td> {/* Genre */}
                    <td className="p-4 text-black">{item[2]}</td> {/* Artist */}
                    <td className="p-4 text-black">{item[4]}</td> {/* Popularity */}
                    <td className="p-4 text-black">{item[5]}</td> {/* Date Recommended */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center pt-10">
            <img src="/images/no-history.png" alt="No history" className="w-32 h-32" />
            <p className="text-lg text-white mt-4">No recommendations available.</p>
          </div>
        )}
      </div>
    </>
  );
}
