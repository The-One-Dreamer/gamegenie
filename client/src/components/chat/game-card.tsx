import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Gamepad2 } from "lucide-react";
import type { GameRecommendation } from "@/types/chat";

interface GameCardProps {
  recommendation: GameRecommendation;
}

export function GameCard({ recommendation }: GameCardProps) {
  const getPlatformColor = (platform: string) => {
    const lowerPlatform = platform.toLowerCase();
    if (lowerPlatform.includes("pc")) return "bg-blue-900 text-blue-300";
    if (lowerPlatform.includes("mobile")) return "bg-purple-900 text-purple-300";
    if (lowerPlatform.includes("console") || lowerPlatform.includes("playstation") || lowerPlatform.includes("xbox")) return "bg-green-900 text-green-300";
    if (lowerPlatform.includes("nintendo") || lowerPlatform.includes("switch")) return "bg-red-900 text-red-300";
    return "bg-gray-700 text-gray-300";
  };

  const getGenreColor = (genre: string) => {
    const lowerGenre = genre.toLowerCase();
    if (lowerGenre.includes("racing")) return "bg-orange-900 text-orange-300";
    if (lowerGenre.includes("puzzle")) return "bg-yellow-900 text-yellow-300";
    if (lowerGenre.includes("rpg")) return "bg-red-900 text-red-300";
    if (lowerGenre.includes("horror")) return "bg-gray-800 text-gray-300";
    if (lowerGenre.includes("action")) return "bg-red-800 text-red-300";
    if (lowerGenre.includes("indie")) return "bg-purple-800 text-purple-300";
    if (lowerGenre.includes("strategy")) return "bg-blue-800 text-blue-300";
    return "bg-green-900 text-green-300";
  };

  const parseRating = (ratingStr: string) => {
    const match = ratingStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  };

  return (
    <Card className="game-card border-[var(--game-border)]">
      <CardContent className="p-5">
        <div className="flex items-start space-x-4">
          {/* Game Image Placeholder */}
          <div className="w-16 h-16 bg-gradient-to-br from-[var(--game-accent)]/20 to-[var(--game-accent)]/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-[var(--game-border)]">
            <Gamepad2 className="w-6 h-6 text-[var(--game-accent)]" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-300 text-lg mb-2">{recommendation.title}</h4>
            <p className="text-sm text-[var(--game-text-muted)] mb-4 line-clamp-2 leading-relaxed">{recommendation.description}</p>
            
            <div className="flex items-center flex-wrap gap-3">
              <div className="flex items-center space-x-1.5">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium text-gray-300">{recommendation.rating}</span>
              </div>
              
              <Badge className="text-xs px-3 py-1.5 rounded-full bg-[var(--game-accent)]/10 text-[var(--game-accent)] border border-[var(--game-accent)]/20 font-medium">
                {recommendation.platform}
              </Badge>
              
              <Badge className="text-xs px-3 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
                {recommendation.genre}
              </Badge>
              
              <Badge className="text-xs px-3 py-1.5 rounded-full bg-[var(--game-success)]/10 text-[var(--game-success)] border border-[var(--game-success)]/20 font-medium">
                {recommendation.price}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
