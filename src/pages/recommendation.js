import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Head from "next/head";
import localFont from "next/font/local";

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
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Retrieve recommendations from localStorage
    const storedRecommendations = localStorage.getItem("recommendationsData");
    if (storedRecommendations) {
      setRecommendations(JSON.parse(storedRecommendations));
    }
  }, []);

  return (
    <>
      <Head>
        <title>Music Recommendations</title>
        <link rel="icon" href="/small_chordmate_icon.png" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-200 via-indigo-300 to-purple-400 text-white">
        <Header />

        {/* Title */}
        <div className="flex text-white font-bold text-3xl justify-center pt-16 mb-8">
          Discover New Music Based on Your Favorites
        </div>

        {/* Recommendation Table */}
        {recommendations.length > 0 ? (
          <div className="overflow-x-auto w-full pt-10 px-6">
            <table className="w-full max-w-4xl mx-auto text-sm bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-2 text-left">Track Name</th>
                  <th className="p-2 text-left">Genre</th>
                  <th className="p-2 text-left">Artist</th>
                  <th className="p-2 text-left">Popularity</th>
                  <th className="p-2 text-left">Similarity</th>
                  {/* <th className="p-2 text-left">YouTube Link</th> New Column */}
                </tr>
              </thead>
              <tbody>
                {recommendations.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="p-4 text-black">{item.track_name}</td>
                    <td className="p-4 text-black">{item.genre}</td>
                    <td className="p-4 text-black">{item.artist}</td>
                    <td className="p-4 text-black">{item.popularity}</td>
                    <td className="p-4 text-black">{item.similarity}</td>
                    {/* <td className="p-4 text-black">{item.youtube_link}</td> Full Link */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex justify-center pt-10">
            <p className="text-lg text-white">No recommendations available.</p>
          </div>
        )}
      </div>
    </>
  );
}
