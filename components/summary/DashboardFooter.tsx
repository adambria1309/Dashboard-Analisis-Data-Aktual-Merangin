import { useState } from "react";

const DashboardFooter: React.FC = () => {
  const [showModal, setShowModal] = useState(true);

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-50 px-4 py-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
      >
        Lihat User Guide!
      </button>

      {/* Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-lg shadow-xl w-[90%] max-w-4xl h-[90vh] overflow-hidden animate-slide-up">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-2 right-2 text-black text-2xl font-bold hover:text-red-500"
            >
              &times;
            </button>
            <iframe
              src="/UserGuide.pdf"
              title="User Guide"
              width="100%"
              height="100%"
              className="border-none"
            />
          </div>
        </div>
      )}
    </>
  );
  };

export default DashboardFooter;
