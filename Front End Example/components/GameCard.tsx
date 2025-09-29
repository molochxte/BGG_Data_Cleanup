import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ImageWithFallback } from './figma/ImageWithFallback';

interface GameCardProps {
  name: string;
  description: string;
  image: string;
  minPlayers: number;
  maxPlayers: number;
  playTime: string;
  complexity: "Easy" | "Medium" | "Hard";
  category: string;
}

export function GameCard({ 
  name, 
  description, 
  image, 
  minPlayers, 
  maxPlayers, 
  playTime, 
  complexity, 
  category 
}: GameCardProps) {
  const complexityColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800", 
    Hard: "bg-red-100 text-red-800"
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video w-full overflow-hidden">
        <ImageWithFallback 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="leading-tight">{name}</CardTitle>
          <Badge variant="secondary" className={complexityColor[complexity]}>
            {complexity}
          </Badge>
        </div>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Players:</span>
            <span>{minPlayers === maxPlayers ? minPlayers : `${minPlayers}-${maxPlayers}`}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Play Time:</span>
            <span>{playTime}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Category:</span>
            <Badge variant="outline">{category}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}