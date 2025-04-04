"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GoDownload } from "react-icons/go";
import materials from "@/data/materials.json";
import Image from "next/image";
import { useSession } from "next-auth/react";


export default function Materialien() {
  const [data, setData] = useState([]);
  const [downloading, setDownloading] = useState(null); // Tracks downloading item
  const [completed, setCompleted] = useState({}); // Tracks completed downloads
  const [imageLoaded, setImageLoaded] = useState({}); // Tracks loaded images
  const { data: session } = useSession();
const userRole = session?.user?.role;
const [adminFilterRole, setAdminFilterRole] = useState("manager");



useEffect(() => {
  if (!userRole) return;

  if (userRole === "admin" || userRole === "manager") {
    setData(materials.filter((item) => item.role === adminFilterRole));
  } else {
    setData(materials.filter((item) => item.role === userRole));
  }
}, [userRole, adminFilterRole]);



  const handleDownload = (url, index) => {
    if (downloading !== null) return; // Prevent multiple clicks

    setDownloading(index);
    setCompleted((prev) => ({ ...prev, [index]: false })); // Reset checkmark

    // Simulate the file download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Delay for better UX effect
    setTimeout(() => {
      setDownloading(null);
      setCompleted((prev) => ({ ...prev, [index]: true })); // Show checkmark

      // Hide checkmark after animation
      setTimeout(() => {
        setCompleted((prev) => ({ ...prev, [index]: false }));
      }, 2000); // Adjust timing if needed
    }, 2000);
  };

  return (
    <div className="px-4 md:px-12">
      
      {/* Title */}
     {/* Titel + Admin-Filter nebeneinander */}
<motion.div
  className="flex flex-col md:flex-row md:items-center justify-between mt-8 mb-8"
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: "easeOut" }}
>
  <h1 className="text-3xl md:text-4xl font-extrabold text-base-content">
    Materialien <span className="font-normal text-xl">(Downloads)</span>
  </h1>

  {/* Admin Filter Dropdown */}
  {(userRole === "admin" || userRole === "manager") &&  (
    <div className="mt-4 md:mt-0">
      <select
        value={adminFilterRole}
        onChange={(e) => setAdminFilterRole(e.target.value)}
        className="select select-sm select-bordered rounded-full bg-indigo-100 text-sm"
      >
        <option value="manager">Nur für Manager</option>
        <option value="markenbotschafter">Nur für Markenbotschafter</option>
      </select>
    </div>
  )}
</motion.div>


      {/* Grid Container */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 30 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 },
          },
        }}
      >
        {data.map((item, index) => (
          <motion.div
            key={index}
            className="relative group bg-white shadow-xl rounded-xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            {/* Thumbnail with Skeleton Loader */}
            <div className="relative">
              {/* Skeleton - Only show while image is loading */}
              {!imageLoaded[index] && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="skeleton w-full h-full"></div>
                </div>
              )}

              {/* Image */}
              <Image
                src={item.thumbnail}
                alt={item.title}
                width={270}
                height={480}
                className="w-full h-auto aspect-[3/4] object-cover transition-opacity duration-300"
                loading="lazy"
                onLoadingComplete={() =>
                  setImageLoaded((prev) => ({ ...prev, [index]: true }))
                }
              />

              {/* Black overlay on hover */}
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>

              {/* Download Button (Centered) */}
              <motion.div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={() => handleDownload(item.downloadUrl, index)}
                  className="w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg relative"
                  disabled={downloading === index}
                >
                  {downloading === index ? (
                    <span className="loading loading-ring loading-lg text-white"></span> // DaisyUI Spinner
                  ) : completed[index] ? (
                    <motion.svg
                      className="text-white w-8 h-8"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    >
                      <path
                        d="M4 12l5 5L20 7"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  ) : (
                    <GoDownload className="text-white text-2xl" />
                  )}
                </button>
              </motion.div>
            </div>

            {/* Info Section */}
            <div className="p-4 bg-slate-50">
              <h2 className="text-lg lg:text-sm font-semibold border-b border-indigo-300">
                {item.title}
              </h2>
              <p className="text-gray-500 lg:text-xs text-sm">{item.week}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
