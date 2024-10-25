// src/pages/sliderPage.js
import React, { useState } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa'; // Ensure this import is correct

export default function SliderPage() {
  const [isSliderOpen, setSliderOpen] = useState(true); // State to manage the slider's visibility
  const [currentSong, setCurrentSong] = useState('Default Song Title'); // State for current song title

  // Sample song titles
  const songs = [
    { title: 'Song Title 1', image: '/path/to/your/image1.jpg' },
    { title: 'Song Title 2', image: '/path/to/your/image2.jpg' },
    { title: 'Song Title 3', image: '/path/to/your/image3.jpg' },
  ];

  // Function to change the current song title when an image is clicked
  const handleImageClick = (title) => {
    setCurrentSong(title);
  };

  const toggleSlider = () => {
    setSliderOpen(!isSliderOpen);
  };

  return (
    <div>
      {/* Head */}
      <div className="h-screen bg-main_bg bg-gradient-to-bl from-main_bg via-gray-400 to-primary">
        {/* Header */}
        <div className="w-full bg-header_bg sticky p-6 flex flex-row justify-between items-center">
          <div className="text-lg font-bold">CHORDMATE</div>
          <div className="flex flex-row items-center w-1/2 gap-20 justify-end md:gap-10 sm:gap-2">
            <div className="flex flex-row gap-5">
              <div>main</div>
              <div>recommendation</div>
            </div>
            <div className="flex flex-row gap-8 md:gap-5 sm:gap-2">
              <button
                style={{
                  width: '142px',
                  height: '42px',
                  borderRadius: '25px',
                  borderWidth: '1px',
                  borderColor: '#007AFF',
                }}
                className="hover:bg-primary hover:border-white text-primary hover:text-white"
              >
                Sign Up
              </button>
              <button
                style={{
                  width: '142px',
                  height: '42px',
                  borderRadius: '25px',
                  borderWidth: '1px',
                }}
                className="bg-primary border-primary hover:border-black hover:bg-black hover:border-white text-white hover:text-primary"
              >
                Log In
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-full">
          {/* Slider Section */}
          <div
            className={`bg-gray-700 transition-all duration-300 ${
              isSliderOpen ? 'w-1/4' : 'w-0'
            } overflow-hidden`} // Darker gray
          >
            {/* Slider Content */}
            {isSliderOpen && (
              <div className="relative p-4">
                <h2 className="font-bold text-lg text-white">Image Slider</h2>
                {/* Placeholder for images */}
                <div className="mt-4">
                  {songs.map((song, index) => (
                    <img
                      key={index}
                      src={song.image}
                      alt={`Slider Image ${index + 1}`}
                      className="mb-2 cursor-pointer"
                      onClick={() => handleImageClick(song.title)} // Change the current song title when clicked
                    />
                  ))}
                </div>
                {/* Arrow Icon for Toggling Slider */}
                <div
                  onClick={toggleSlider}
                  className="absolute top-4 right-4 cursor-pointer bg-gray-900 p-2 rounded-full z-10"
                >
                  <FaArrowLeft className="text-white" size={24} /> {/* Arrow to close */}
                </div>
              </div>
            )}
          </div>

          {/* Right Content */}
          <div className="w-full"> {/* Change to w-full to make sure it takes full width */}
            <div className="bg-black flex items-center justify-center h-20 w-full"> {/* Black container */}
              <h2 className="text-xl font-bold text-white">{currentSong}</h2> {/* Dynamic song title */}
            </div>
          </div>
        </div>

        {/* Open Slider Button */}
        {!isSliderOpen && (
          <div
            onClick={toggleSlider}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 cursor-pointer bg-gray-900 p-2 rounded-full z-10"
          >
            <FaArrowRight className="text-white" size={24} /> {/* Arrow to open */}
          </div>
        )}
      </div>
    </div>
  );
}
