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
  Zap,
  Users,
  Gift,
  Award,
  Scroll,
  Info,
  Flame, // Add this
  Shield as DefenseIcon, // Add this
  Zap as SpeedIcon // Add this
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import OpenAI from 'openai';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

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

  const [aggressiveDeck, setAggressiveDeck] = useState<CardType[]>([]);
  const [controlDeck, setControlDeck] = useState<CardType[]>([]);
  const [speedDeck, setSpeedDeck] = useState<CardType[]>([]);

  const generateDeckRecommendation = async (playerData: { trophies: number; wins: number; losses: number; threeCrownWins: number; challengeMaxWins: number; warDayWins: number; badges: { name: string; level: number }[]; }, availableCards: CardType[]): Promise<void> => {
    const analysis = analyzePlayerProfile(playerData);
  
    const generatePrompt = (style: string) => `
    As a Clash Royale expert, generate a ${style} deck based on this player profile:
    
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
    6. Consider player's skill level
    7. Optimize for ${style} playstyle
    8. Response format: Return only the card names separated by commas
  
    Available cards:
    ${availableCards.map(card => `${card.name}`).join(', ')}
    `;

    try {
      const [aggressiveResponse, controlResponse, speedResponse] = await Promise.all([
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide aggressive deck recommendations."
          }, {
            role: "user",
            content: generatePrompt("aggressive")
          }],
          temperature: 0.7,
          max_tokens: 150
        }),
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide control deck recommendations."
          }, {
            role: "user",
            content: generatePrompt("control")
          }],
          temperature: 0.7,
          max_tokens: 150
        }),
        openai.chat.completions.create({
          model: "gpt-4",
          messages: [{
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide fast cycle deck recommendations."
          }, {
            role: "user",
            content: generatePrompt("fast cycle")
          }],
          temperature: 0.7,
          max_tokens: 150
        })
      ]);

      const processResponse = (response: string) => {
        const cardNames = response.trim().split(',').map(name => name.trim());
        return cardNames.map(cardName => 
          availableCards.find(card => card.name.toLowerCase() === cardName.toLowerCase())
        ).filter(Boolean) as CardType[];
      };

      const aggressiveDeck = processResponse(aggressiveResponse.choices[0].message.content || '');
      const controlDeck = processResponse(controlResponse.choices[0].message.content || '');
      const speedDeck = processResponse(speedResponse.choices[0].message.content || '');

    
      setAggressiveDeck(aggressiveDeck);
      setControlDeck(controlDeck);
      setSpeedDeck(speedDeck);

    } catch (error) {
      console.error('Error generating deck recommendations:', error);
      // Fallback to basic decks if AI fails
      const generateBasicDeck = () => availableCards.sort(() => Math.random() - 0.5).slice(0, 8);
    
      setAggressiveDeck(generateBasicDeck());
      setControlDeck(generateBasicDeck());
      setSpeedDeck(generateBasicDeck());
    }
  };

  const DeckDisplay = ({ deck, title, description, icon: Icon }: { deck: CardType[], title: string, description: string, icon: React.ComponentType<{ className?: string }> }) => (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="text-yellow-500" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-4">
            {deck.map((card, index) => (
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
  );


  const fetchWithApiKey = async (apiKey: string) => {
    const formattedTag = playerTag.startsWith('#') ? 
      playerTag.substring(1) : playerTag; // Remove leading '#' if present
  
    try {
      const playerRes = await fetch(`${BASE_URL}/players/%23${formattedTag}`, {
        headers: {
          'Authorization': apiKey
        }
      });
  
      if (!playerRes.ok) {
        throw new Error('Player not found');
      }
  
      const playerData = await playerRes.json();
      setPlayerData(playerData);
  
      const cardsRes = await fetch(`${BASE_URL}/cards`, {
        headers: {
          'Authorization': apiKey
        }
      });
  
      if (!cardsRes.ok) {
        throw new Error('Failed to fetch cards');
      }
  
      const cardsData = await cardsRes.json();
      setCards(cardsData.items);
      await generateDeckRecommendation(playerData, cardsData.items);
    } catch (error) {
      throw error;
    }
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
            <Card className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-emerald-500" />
            How to Use
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            <AccordionItem value="instructions">
              <AccordionTrigger>View Instructions</AccordionTrigger>
              <AccordionContent>
                <ol className="list-decimal ml-4 space-y-2">
                  <li>Find your player tag in Clash Royale by tapping your profile</li>
                  <li>Enter your tag with or without the # symbol (e.g., #CCQ8UY88Q or CCQ8UY88Q)</li>
                  <li>Click &apos;Fetch Data&apos; to get your stats and deck recommendation</li>
                  <li>Hover over recommended cards to see details</li>
                  <li>The recommendation is based on your playstyle and stats</li>
                </ol>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
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
                    <div className="space-y-6">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="text-blue-500" />
                Player Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Crown className="text-yellow-500" />
                      <span className="font-semibold">{playerData.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="text-yellow-500" />
                      <span>Trophies: {playerData.trophies}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="text-purple-500" />
                      <span>Best: {playerData.bestTrophies}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="text-blue-500" />
                      <span>Level: {playerData.expLevel}</span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Swords className="text-red-500" />
                      <span>Wins: {playerData.wins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gamepad2 className="text-green-500" />
                      <span>Battles: {playerData.battleCount}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="text-amber-500" />
                      <span>3 Crown: {playerData.threeCrownWins}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Gift className="text-pink-500" />
                      <span>Donations: {playerData.totalDonations}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
          </Card>
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scroll className="text-violet-500" />
                  Battle Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Win Rate</span>
                    <span className="font-semibold">
                      {((playerData.wins / (playerData.wins + playerData.losses)) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Three Crown Rate</span>
                    <span className="font-semibold">
                      {((playerData.threeCrownWins / playerData.wins) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Challenge Max Wins</span>
                    <span className="font-semibold">{playerData.challengeMaxWins}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>War Day Wins</span>
                    <span className="font-semibold">{playerData.warDayWins}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="text-yellow-500" />
                Recommended Deck
              </CardTitle>
            </CardHeader>
            <CardContent>
            <Tabs defaultValue="aggressive" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
                  <TabsTrigger value="control">Control</TabsTrigger>
                  <TabsTrigger value="speed">Speed Cycle</TabsTrigger>
                </TabsList>
                <TabsContent value="aggressive">
                  <DeckDisplay
                    deck={aggressiveDeck}
                    title="Aggressive Deck"
                    description="High damage output, designed for quick victories"
                    icon={Flame}
                  />
                </TabsContent>
                <TabsContent value="control">
                  <DeckDisplay
                    deck={controlDeck}
                    title="Control Deck"
                    description="Defensive playstyle with counter-push potential"
                    icon={DefenseIcon}
                  />
                </TabsContent>
                <TabsContent value="speed">
                  <DeckDisplay
                    deck={speedDeck}
                    title="Speed Cycle Deck"
                    description="Fast cycle for constant pressure"
                    icon={SpeedIcon}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}