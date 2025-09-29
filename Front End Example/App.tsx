import { useState } from "react";
import { SearchPage } from "./components/SearchPage";
import { ResultsPage, BoardGame } from "./components/ResultsPage";

const mockGames: BoardGame[] = [
  {
    id: "1",
    name: "Ticket to Ride",
    description: "A railway-themed board game where players collect train cards to claim railway routes across the map.",
    image: "https://images.unsplash.com/photo-1659480141041-c41defa79a71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxib2FyZCUyMGdhbWVzJTIwdGFibGV0b3B8ZW58MXx8fHwxNzU4NDI1OTU3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: "30-60 min",
    complexity: "Easy",
    category: "Strategy"
  },
  {
    id: "2", 
    name: "Wingspan",
    description: "A competitive bird-collection, engine-building game for 1-5 players.",
    image: "https://images.unsplash.com/photo-1677816156435-e844da620fa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdHJhdGVneSUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTgzNDk2MzV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 1,
    maxPlayers: 5,
    playTime: "40-70 min",
    complexity: "Medium",
    category: "Engine Building"
  },
  {
    id: "3",
    name: "Azul", 
    description: "A tile-placement game where players compete to create the most beautiful mosaic.",
    image: "https://images.unsplash.com/photo-1651170104468-359c1a7fd53d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW1pbHklMjBib2FyZCUyMGdhbWVzfGVufDF8fHx8MTc1ODQyNTk1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 2,
    maxPlayers: 4,
    playTime: "30-45 min",
    complexity: "Easy",
    category: "Abstract"
  },
  {
    id: "4",
    name: "Exploding Kittens",
    description: "A highly strategic, kitty-powered version of Russian Roulette that's also a card game.",
    image: "https://images.unsplash.com/photo-1756694414478-c85848991d41?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXJkJTIwZ2FtZXMlMjBwbGF5aW5nJTIwY2FyZHN8ZW58MXx8fHwxNzU4NDI1OTU4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 2,
    maxPlayers: 5,
    playTime: "15 min",
    complexity: "Easy",
    category: "Party"
  },
  {
    id: "5",
    name: "Monopoly",
    description: "The classic property trading game where players buy, sell, and develop properties.",
    image: "https://images.unsplash.com/photo-1703925153100-43afda8b6506?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb25vcG9seSUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTg0MjU5NTh8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 2,
    maxPlayers: 8,
    playTime: "60-180 min",
    complexity: "Medium",
    category: "Economic"
  },
  {
    id: "6",
    name: "Chess",
    description: "The timeless strategy game of tactical warfare between two armies on a checkered battlefield.",
    image: "https://images.unsplash.com/photo-1653510640359-cbc4c1f3a90f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGVzcyUyMGJvYXJkJTIwZ2FtZXxlbnwxfHx8fDE3NTg0MjU5NTl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    minPlayers: 2,
    maxPlayers: 2,
    playTime: "30-120 min",
    complexity: "Hard",
    category: "Abstract"
  }
];

// Simple search function that filters games based on query keywords
function searchGames(query: string): BoardGame[] {
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(" ");
  
  return mockGames.filter(game => {
    const searchableText = `
      ${game.name} 
      ${game.description} 
      ${game.category} 
      ${game.complexity} 
      ${game.playTime}
      players ${game.minPlayers} ${game.maxPlayers}
    `.toLowerCase();
    
    // Check if any keyword matches
    return keywords.some(keyword => 
      searchableText.includes(keyword) ||
      // Handle specific queries
      (keyword.includes("fast") && game.playTime.includes("15")) ||
      (keyword.includes("quick") && game.playTime.includes("15")) ||
      (keyword.includes("strategy") && game.category.toLowerCase().includes("strategy")) ||
      (keyword.includes("family") && game.complexity === "Easy") ||
      (keyword.includes("party") && game.category === "Party") ||
      (keyword.includes("2") && game.minPlayers <= 2 && game.maxPlayers >= 2)
    );
  });
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<"search" | "results">("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<BoardGame[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const results = searchGames(query);
    setSearchResults(results);
    setCurrentPage("results");
  };

  const handleBackToSearch = () => {
    setCurrentPage("search");
  };

  return (
    <div className="min-h-screen">
      {currentPage === "search" ? (
        <SearchPage onSearch={handleSearch} />
      ) : (
        <ResultsPage 
          query={searchQuery}
          games={searchResults}
          onBackToSearch={handleBackToSearch}
        />
      )}
    </div>
  );
}