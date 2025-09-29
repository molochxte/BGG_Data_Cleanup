import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Search, Sparkles } from "lucide-react";

interface SearchPageProps {
  onSearch: (query: string) => void;
}

export function SearchPage({ onSearch }: SearchPageProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const exampleQueries = [
    "Games like Monopoly but faster",
    "Strategic games for 2 players",
    "Family games that take under 30 minutes",
    "Cooperative games for beginners",
    "Party games for large groups"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-indigo-600" />
            <h1 className="text-4xl text-indigo-900">Board Game Finder</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Describe what kind of board game you're looking for, and we'll help you find the perfect match!
          </p>
        </div>

        <Card className="border-2 border-indigo-200 shadow-lg">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., 'I want a strategy game for 3-4 players that takes about an hour'"
                  className="pl-10 h-12 text-base border-2 border-indigo-100 focus:border-indigo-300"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-indigo-600 hover:bg-indigo-700"
                disabled={!query.trim()}
              >
                Find My Perfect Game
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-center text-muted-foreground">Try these examples:</h3>
          <div className="grid gap-2">
            {exampleQueries.map((example, index) => (
              <button
                key={index}
                onClick={() => setQuery(example)}
                className="text-left p-3 rounded-lg bg-white/60 hover:bg-white/80 border border-indigo-100 hover:border-indigo-200 transition-colors"
              >
                <span className="text-indigo-700">"{example}"</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}