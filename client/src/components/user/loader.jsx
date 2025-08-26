// src/components/Loader.jsx
export default function Loader() {
  return (
    <div className="flex items-center justify-center h-screen bg-white">
      {/* <img
        src="/logo.png"
        alt="Loading..."
        className="w-20 h-20 animate-spin"
      /> */}
      <img src="../../../public/vite.svg" alt="Loading..." className="w-20 h-20 animate-pulse" />

    </div>
  );
}
