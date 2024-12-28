"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Trophy,
  Swords,
  Crown,
  Gamepad2,
  Search,
  Loader2,
  Shield,
  Zap
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import OpenAI from 'openai';

const API_KEY1 = process.env.NEXT_PUBLIC_API_KEY_1;
const API_KEY2 = process.env.NEXT_PUBLIC_API_KEY_2;
const API_KEY3 = process.env.NEXT_PUBLIC_API_KEY_3;
const API_KEY4 = process.env.NEXT_PUBLIC_API_KEY_4;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;


const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_API_KEY,
  dangerouslyAllowBrowser: true // Only for development
});

export default function DeckBuilder() {
  const [playerTag, setPlayerTag] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playerData, setPlayerData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cards, setCards] = useState<CardType[]>([]);
  const [recommendedDeck, setRecommendedDeck] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  type CardType = {
    id: string;
    name: string;
    elixirCost: number;
    rarity: string;
    iconUrls: {
      medium: string;
    };
  };

  interface PlayerAnalysis {
    playstyle: string;
    skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    preferredArchetypes: string[];
    strengthAreas: string[];
    weaknessAreas: string[];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyzePlayerProfile = (playerData: any): PlayerAnalysis => {
    const winRate = (playerData.wins / (playerData.wins + playerData.losses)) * 100;
    const threeCrownRate = (playerData.threeCrownWins / playerData.wins) * 100;
    const challengeWinRate = playerData.challengeMaxWins / 12;

    let skillLevel: PlayerAnalysis['skillLevel'] = 'intermediate';
    if (playerData.trophies > 7000) skillLevel = 'expert';
    else if (playerData.trophies > 6000) skillLevel = 'advanced';
    else if (playerData.trophies < 4000) skillLevel = 'beginner';

    let playstyle = '';
    if (threeCrownRate > 40) {
      playstyle = 'aggressive';
    } else if (winRate > 55 && threeCrownRate < 30) {
      playstyle = 'control';
    } else {
      playstyle = 'balanced';
    }

    const preferredArchetypes = [];
    const masteryBadges: { name: string; level: number }[] = playerData.badges.filter((b: { name: string }) => b.name.startsWith('Mastery'));
    const hasMasteredLavaHound = masteryBadges.some(b => b.name === 'MasteryLavaHound' && b.level > 5);
    const hasMasteredMiner = masteryBadges.some(b => b.name === 'MasteryMiner' && b.level > 5);
    const hasMasteredTombstone = masteryBadges.some(b => b.name === 'MasteryTombstone' && b.level > 5);

    if (hasMasteredLavaHound) preferredArchetypes.push('LavaLoon');
    if (hasMasteredMiner) preferredArchetypes.push('Miner Control');
    if (hasMasteredTombstone) preferredArchetypes.push('Graveyard');

    const strengthAreas = [];
    if (playerData.challengeMaxWins >= 15) strengthAreas.push('tournament');
    if (winRate > 55) strengthAreas.push('ladder');
    if (threeCrownRate > 40) strengthAreas.push('beatdown');
    if (playerData.warDayWins > 200) strengthAreas.push('war');

    const weaknessAreas = [];
    if (challengeWinRate < 0.5) weaknessAreas.push('challenges');
    if (winRate < 50) weaknessAreas.push('consistency');
    if (threeCrownRate < 20) weaknessAreas.push('closing games');

    return {
      playstyle,
      skillLevel,
      preferredArchetypes,
      strengthAreas,
      weaknessAreas
    };
  };

  const generateDeckRecommendation = async (playerData: { trophies: number; wins: number; losses: number; threeCrownWins: number; challengeMaxWins: number; warDayWins: number; badges: { name: string; level: number }[]; }, availableCards: CardType[]): Promise<void> => {
    const analysis = analyzePlayerProfile(playerData);
  
    const prompt = `
    As a Clash Royale expert, generate a balanced 8-card deck based on this player profile:
    
    Player Analysis:
    - Playstyle: ${analysis.playstyle}
    - Skill Level: ${analysis.skillLevel}
    - Preferred Archetypes: ${analysis.preferredArchetypes.join(', ')}
    - Strengths: ${analysis.strengthAreas.join(', ')}
    - Weaknesses: ${analysis.weaknessAreas.join(', ')}
  
    Rules for deck building:
    1. Include at least 1 win condition
    2. Include at least 2 spells (one small, one big)
    3. Include at least 1 building
    4. Average elixir cost should be between 3.5-4.3
    5. Must have cards that synergize well together
    6. Consider player's skill level and playstyle
    7. Response format: Return only the card names separated by commas
  
    Available cards:
    ${availableCards.map(card => `${card.name}`).join(', ')}
    `;
  
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
          role: "system",
          content: "You are a Clash Royale expert deck builder. Provide deck recommendations as comma-separated card names only."
        }, {
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 150
      });
  
      const recommendedCardNames = response.choices[0].message.content?.trim().split(',').map(name => name.trim());
      
      if (!recommendedCardNames || recommendedCardNames.length !== 8) {
        throw new Error('Invalid deck recommendation received');
      }
  
      const deck = recommendedCardNames.map(cardName => 
        availableCards.find(card => card.name.toLowerCase() === cardName.toLowerCase())
      ).filter(Boolean) as CardType[];
  
      if (deck.length === 8) {
        setRecommendedDeck(deck);
      } else {
        throw new Error('Could not find all recommended cards in available cards');
      }
    } catch (error) {
      console.error('Error generating deck recommendation:', error);
      // Fallback to a basic deck if AI fails
      const basicDeck = availableCards
        .sort(() => Math.random() - 0.5)
        .slice(0, 8);
      setRecommendedDeck(basicDeck);
    }
  };

  const fetchWithApiKey = async (apiKey: string) => {
    const formattedTag = playerTag.replace(/^#/, ''); // Remove leading '#' if present

    const playerRes = await fetch(`${BASE_URL}/players/%${formattedTag}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!playerRes.ok) {
      throw new Error('Player not found');
    }

    const playerData = await playerRes.json();
    setPlayerData(playerData);

    const cardsRes = await fetch(`${BASE_URL}/cards`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!cardsRes.ok) {
      throw new Error('Failed to fetch cards');
    }

    const cardsData = await cardsRes.json();
    setCards(cardsData.items);
    await generateDeckRecommendation(playerData, cardsData.items);
  };

  const fetchPlayerData = async () => {
    setLoading(true);
    setError('');
    
    const apiKeys = [API_KEY1, API_KEY2, API_KEY3, API_KEY4];
  
    for (let i = 0; i < apiKeys.length; i++) {
      try {
        if (apiKeys[i]) {
          await fetchWithApiKey(apiKeys[i]!);
        }
        setError(''); 
        return; 
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message); 
        } else {
          setError('An unknown error occurred');
        }
      }
    }
    
   
    setLoading(false);
  };
  

  return (
    <main className="container mx-auto p-4 space-y-6">
      <Card className="bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="text-yellow-500" />
            Clash Royale Deck Builder
          </CardTitle>
          <CardDescription>
            Enter your player tag to get personalized deck recommendations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Input
                placeholder="Enter player tag (e.g., #V0R9VUGUU)"
                value={playerTag}
                onChange={(e) => setPlayerTag(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>
            <Button onClick={fetchPlayerData} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading
                </>
              ) : (
                'Fetch Data'
              )}
            </Button>
          </div>
          
          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {playerData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-blue-500" />
                Player Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-500" />
                  <span>Trophies: {playerData.trophies}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Crown className="text-purple-500" />
                  <span>Level: {playerData.expLevel}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Swords className="text-red-500" />
                  <span>Wins: {playerData.wins}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Gamepad2 className="text-green-500" />
                  <span>Arena: {playerData.arena?.name}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Recommended Deck
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TooltipProvider>
                <div className="grid grid-cols-4 gap-4">
                  {recommendedDeck.map((card, index) => (
                    <Tooltip key={`${card.id}-${index}`}>
                      <TooltipTrigger>
                        <div className="relative group">
                          <Image
                            src={card.iconUrls.medium}
                            alt={card.name}
                            width={64}
                            height={64}
                            className="w-16 h-16 mx-auto transition-transform group-hover:scale-110"
                          />
                          <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                            {card.elixirCost}
                          </div>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-bold">{card.name}</p>
                        <p className="text-xs">Rarity: {card.rarity}</p>
                      </TooltipContent>
                    </Tooltip>
                  ))}
                </div>
              </TooltipProvider>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}