import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Head from "next/head";
import localFont from "next/font/local";

// JSON data stored as a local variable
const recommendationsData = {
  "track_name": {
    "51803": "WAIT FOR U (feat. Drake & Tems)",
    "51373": "Godzilla (feat. Juice WRLD)",
    "51813": "She Knows (feat. Amber Coffman & Cults)",
    "51313": "That That (prod. & feat. SUGA of BTS)",
    "51088": "Never Fold (feat. Sunny Malton)",
    "51140": "These Days (feat. Bohemia)",
    "51220": "Ghana Kasoota (feat. Surbhi Jyoti)",
    "51343": "Brown Shortie (feat. Sonam Bajwa)",
    "51569": "B-Town (feat. Sunny Malton)",
    "51724": "Forget About It (feat. Sunny Malton)",
    "51721": "Chandra (Featuring. Shreya Ghoshal)"
  },
  "track_genre": {
    "51803": "hip-hop",
    "51373": "hip-hop",
    "51813": "hip-hop",
    "51313": "hip-hop",
    "51088": "hip-hop",
    "51140": "hip-hop",
    "51220": "hip-hop",
    "51343": "hip-hop",
    "51569": "hip-hop",
    "51724": "hip-hop",
    "51721": "hip-hop"
  },
  "artists": {
    "51803": "Future;Drake;Tems",
    "51373": "Eminem;Juice WRLD",
    "51813": "J. Cole;Cults;Amber Coffman",
    "51313": "PSY;SUGA",
    "51088": "Sidhu Moose Wala;Sunny Malton",
    "51140": "Sidhu Moose Wala;Bohemia",
    "51220": "Raftaar;Rashmeet Kaur;Surbhi Jyoti",
    "51343": "Sidhu Moose Wala;Sonam Bajwa",
    "51569": "Sidhu Moose Wala;Sunny Malton",
    "51724": "Sidhu Moose Wala;Sunny Malton",
    "51721": "Ajay-Atul;Shreya Ghoshal"
  },
  "popularity": {
    "51803": 89,
    "51373": 83,
    "51813": 82,
    "51313": 81,
    "51088": 74,
    "51140": 70,
    "51220": 64,
    "51343": 63,
    "51569": 60,
    "51724": 58,
    "51721": 58
  },
  "similarity": {
    "51803": 3,
    "51373": 3,
    "51813": 3,
    "51313": 3,
    "51088": 3,
    "51140": 3,
    "51220": 3,
    "51343": 3,
    "51569": 3,
    "51724": 3,
    "51721": 3
  }
};

export default function RecommendationPage() {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Format the JSON data into an array of recommendation objects
    const formattedRecommendations = Object.keys(recommendationsData.track_name).map((key) => ({
      track_name: recommendationsData.track_name[key],
      genre: recommendationsData.track_genre[key],
      artist: recommendationsData.artists[key],
      popularity: recommendationsData.popularity[key],
      similarity: recommendationsData.similarity[key],
    }));
    setRecommendations(formattedRecommendations);
  }, []);

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
          Discover New Music Based on Your Favorites
        </div>

        {/* Recommendation Table */}
        {recommendations.length > 0 ? (
          <div className="overflow-x-auto w-full pt-10 px-6 pb-[100px]">
            <table className="w-full max-w-4xl mx-auto text-sm bg-white rounded-xl shadow-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="p-2 text-left">Track Name</th>
                  <th className="p-2 text-left">Genre</th>
                  <th className="p-2 text-left">Artist</th>
                  <th className="p-2 text-left">Popularity</th>
                  <th className="p-2 text-left">Similarity</th>
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
