import { Button } from "./ui/button";
import { GameCard } from "./GameCard";
import { ArrowLeft, Search } from "lucide-react";

export interface BoardGame {
  id: string;
  name: string;
  description: string;
  image: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: string;
  complexity: "Easy" | "Medium" | "Hard";
  category: string;
}

interface ResultsPageProps {
  query: string;
  games: BoardGame[];
  onBackToSearch: () => void;
}

export function ResultsPage({ query, games, onBackToSearch }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4 py-4">
          <Button 
            variant="ghost" 
            onClick={onBackToSearch}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Search
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Search className="h-6 w-6 text-indigo-600" />
            <h1>Results for: <span className="text-indigo-600">"{query}"</span></h1>
          </div>
          <p className="text-muted-foreground">
            Found {games.length} board game{games.length !== 1 ? 's' : ''} that match your criteria
          </p>
        </div>

        {games.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {games.map((game) => (
              <GameCard
                key={game.id}
                name={game.name}
                description={game.description}
                image={game.image}
                minPlayers={game.minPlayers}
                maxPlayers={game.maxPlayers}
                playTime={game.playTime}
                complexity={game.complexity}
                category={game.category}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3>No games found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or browse our recommendations.
            </p>
            <Button onClick={onBackToSearch}>Try Another Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}