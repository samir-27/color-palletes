import { useState, useEffect } from "react";
import axios from "axios";

export default function ColorPaletteApp() {
  const [query, setQuery] = useState("");
  const [palettes, setPalettes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [defaultPalettes, setDefaultPalettes] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchPalettes();
  }, [query]);

  useEffect(() => {
    fetchDefaultPalettes();
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchPalettes = async () => {
    if (!query.trim()) {
      setPalettes(defaultPalettes);
      return;
    }

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

  const fetchDefaultPalettes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.allorigins.win/get?url=${encodeURIComponent(
          "https://colormagic.app/api/palette/search?q=popular"
        )}`
      );
      const data = JSON.parse(response.data.contents);
      setDefaultPalettes(data);
      setPalettes(data);
    } catch (err) {
      setError("Failed to load default palettes");
    }
    setLoading(false);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(tag === selectedTag ? null : tag);
  };

  const toggleFavorite = (palette) => {
    const isFavorite = favorites.some((fav) => fav.id === palette.id);
    if (isFavorite) {
      setFavorites(favorites.filter((fav) => fav.id !== palette.id));
    } else {
      setFavorites([...favorites, palette]);
    }
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color);
    alert(`Copied: ${color}`);
  };

  const displayedPalettes = showFavorites ? favorites : selectedTag
    ? palettes.filter((palette) => palette.tags.includes(selectedTag))
    : palettes;

  const allTags = Array.from(new Set((palettes.length ? palettes : defaultPalettes).flatMap((p) => p.tags)));

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 font-sans">
      <div className="container mx-auto">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">🎨 Discover Colors</h1>
          <p className="text-gray-600 text-center max-w-md">Search and explore beautiful color palettes for your next project.</p>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-center gap-4 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for colors..."
            className="border p-3 rounded-md w-full md:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-semibold"
          >
            {showFavorites ? "Show All Palettes" : "Show Favorites"}
          </button>
        </div>

        {loading && <p className="text-center text-gray-600">Loading...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="mb-6 space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">Filter by Tag</h3>
            <div className="hidden md:flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                    selectedTag === tag ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => handleTagClick(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
            <div className="md:hidden">
              <select
                className="w-full p-2 border rounded-md"
                onChange={(e) => handleTagClick(e.target.value)}
                value={selectedTag || ""}
              >
                <option value="">Select a Tag</option>
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {displayedPalettes.map((palette) => (
            <div key={palette.id} className="bg-white p-5 shadow-md rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
              <h2 className="text-lg font-semibold mb-3 text-gray-800">{palette.text}</h2>
              <div className="rounded-lg overflow-hidden">
                {palette.colors.map((color) => (
                  <div key={color} className="h-12 p-2 pt-5 cursor-pointer text-white text-sm text-right font-bold" style={{ backgroundColor: color }} onClick={() => copyToClipboard(color)}>
                    {color}
                  </div>
                ))}
              </div>
              <button
                onClick={() => toggleFavorite(palette)}
                className={`mt-3 px-4 py-2 rounded-md font-semibold w-full ${favorites.some((fav) => fav.id === palette.id) ? "bg-red-500 text-white" : "bg-gray-300 hover:bg-gray-400"}`}
              >
                {favorites.some((fav) => fav.id === palette.id) ? "Remove from Favorites" : "Add to Favorites"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}