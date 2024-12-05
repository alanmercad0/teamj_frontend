import { useState } from 'react';

export default function ModalExample() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false); // Tracks animation state

  const openModal = () => {
    setIsModalOpen(true); // Mount the modal
    setTimeout(() => setIsVisible(true), 10); // Trigger fade-in animation
  };

  const closeModal = () => {
    setIsVisible(false); // Trigger fade-out animation
    setTimeout(() => setIsModalOpen(false), 300); // Wait for animation to finish before unmounting
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {/* Trigger Button */}
      <button
        onClick={openModal}
        className="px-4 py-2 bg-blue-500 text-white rounded shadow hover:bg-blue-600"
      >
        Open Modal
      </button>

      {/* Modal */}
      {isModalOpen && (
        <>
          {/* Overlay */}
          <div
            className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeModal} // Close modal on clicking overlay
          ></div>

          {/* Modal Content */}
          <div
            className={`fixed inset-0 flex items-center justify-center transition-all duration-300 transform ${
              isVisible ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}
          >
            <div className="bg-white p-6 rounded shadow-lg relative">
              <h2 className="text-lg font-semibold">Modal Title</h2>
              <p className="mt-4">This is the modal content.</p>
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
