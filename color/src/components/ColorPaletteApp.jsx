import { useState, useEffect } from "react";
import axios from "axios";

export default function ColorPaletteApp() {
  const [query, setQuery] = useState("green");
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPalettes();
  }, [query]);

  const fetchPalettes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          `https://colormagic.app/api/palette/search?q=${query}`
        )}`
      );
      const data = JSON.parse(response.data.contents);
      setPalettes(data);
    } catch (err) {
      setError("Failed to fetch palettes");
    }
    setLoading(false);
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied: ${color}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 items-center p-4">
        <div className="mx-auto container">

       
      <h1 className="text-2xl font-bold mb-4">Color Palette Finder</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search for colors..."
        className="border p-2 rounded-md w-64 mb-4"
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 ">
        {palettes.map((palette) => (
          <div key={palette.id} className="bg-white p-4 shadow-md rounded-lg">
            <h2 className="text-lg font-semibold mb-2">{palette.text}</h2>
            <div className="flex flex-col  rounded overflow-hidden">
              {palette.colors.map((color, index) => (
                <div
                  key={color}
                  className="h-10 flex justify-center items-center cursor-pointer relative text-white font-semibold"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                >
                  <span className="absolute inset-0 flex items-center justify-center  bg-opacity-25 text-xs px-2 py-1 rounded">{palette.tags[index] || ""}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">Likes: {palette.likesCount}</p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}