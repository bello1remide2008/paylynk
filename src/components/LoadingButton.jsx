import { useState } from "react";
import epay2 from "./epay2.jpeg";

export default function LogoButton() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  return (
    <button
      onClick={handleClick}
      className="relative w-16 h-16 flex items-center justify-center"
    >

      {/* Spinner Ring */}
      {loading && (
        <span className="absolute w-20 h-20 border-4 border-t-transparent border-[#361DFC] rounded-full animate-spin"></span>
      )}

      {/* Logo */}
        <img 
          src={epay2} 
          alt="Epay Logo" 
          className="w-8 h-8 object-contain"
        />

    </button>
  );
}
