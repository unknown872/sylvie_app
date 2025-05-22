// components/Loader.js

import Image from "next/image";
import Logos from "@/assets/logo/reine_logo.jpeg"; // Chemin vers votre logo

const Loader = () => (
  <div className="fixed inset-0 bg-white bg-opacity-50 flex justify-center items-center z-50">
    <div className="flex flex-col justify-center items-center w-24 h-24 space-y-2">
      <Image 
        src={Logos} 
        alt="Loader" 
        width={75} 
        height={75} 
        className="animate-pulse duration-[2000ms] shadow-lg rounded-lg shadow-slate-500" 
      />
      <span className="text-gray-500 text-sm font-semibold">Un instant...</span>
    </div>
  </div>
);

export default Loader;
