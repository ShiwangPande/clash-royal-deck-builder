"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  Flame,
  Shield as DefenseIcon,
  Zap as SpeedIcon,
  Sparkles,
  Share2,
  Download,
  BarChart3,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import OpenAI from "openai";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const API_KEY1 = process.env.NEXT_PUBLIC_API_KEY_1;
const API_KEY2 = process.env.NEXT_PUBLIC_API_KEY_2;
const API_KEY3 = process.env.NEXT_PUBLIC_API_KEY_3;
const API_KEY4 = process.env.NEXT_PUBLIC_API_KEY_4;
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const OpenAI_API_KEY_1 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_1;
const OpenAI_API_KEY_2 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_2;
const OpenAI_API_KEY_3 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_3;
const OpenAI_API_KEY_4 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_4;
const OpenAI_API_KEY_5 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_5;
const OpenAI_API_KEY_6 = process.env.NEXT_PUBLIC_API_KEY_OPEN_AI_6;




export default function DeckBuilder() {
  const [playerTag, setPlayerTag] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [playerData, setPlayerData] = useState<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cards, setCards] = useState<CardType[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  class OpenAIManager {
    private apiKeys: string[];
    private currentIndex: number;
  
    constructor() {
      this.apiKeys = [
        OpenAI_API_KEY_1,
        OpenAI_API_KEY_2,
        OpenAI_API_KEY_3,
        OpenAI_API_KEY_4,
        OpenAI_API_KEY_5,
        OpenAI_API_KEY_6,
      ].filter((key): key is string => Boolean(key));
      this.currentIndex = 0;
    }
  
    private getClient() {
      return new OpenAI({
        apiKey: this.apiKeys[this.currentIndex],
        dangerouslyAllowBrowser: true,
      });
    }
  
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createCompletion(messages: any[]) {
      let lastError;
      
      for (let attempt = 0; attempt < this.apiKeys.length; attempt++) {
        try {
          const client = this.getClient();
          return await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
            temperature: 0.7,
            max_tokens: 150,
          });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          lastError = error;
          if (error?.response?.status === 429) {
            this.currentIndex = (this.currentIndex + 1) % this.apiKeys.length;
            continue;
          }
          throw error;
        }
      }
      throw new Error(`All API keys exhausted. Last error: ${lastError?.message}`);
    }
  }
  
  const openaiManager = new OpenAIManager();

  const shareDeck = async (deck: CardType[]) => {
    const deckString = deck.map(card => card.name).join(', ');
    try {
      await navigator.clipboard.writeText(deckString);
      alert('Deck copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy deck:', err);
    }
  };

  const saveDeck = (type: string, deck: CardType[]) => {
    const deckString = JSON.stringify(deck);
    const blob = new Blob([deckString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}-deck.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
    skillLevel: "beginner" | "intermediate" | "advanced" | "expert";
    preferredArchetypes: string[];
    strengthAreas: string[];
    weaknessAreas: string[];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const analyzePlayerProfile = (playerData: any): PlayerAnalysis => {
    const winRate =
      (playerData.wins / (playerData.wins + playerData.losses)) * 100;
    const threeCrownRate = (playerData.threeCrownWins / playerData.wins) * 100;
    const challengeWinRate = playerData.challengeMaxWins / 12;

    let skillLevel: PlayerAnalysis["skillLevel"] = "intermediate";
    if (playerData.trophies > 7000) skillLevel = "expert";
    else if (playerData.trophies > 6000) skillLevel = "advanced";
    else if (playerData.trophies < 4000) skillLevel = "beginner";

    let playstyle = "";
    if (threeCrownRate > 40) {
      playstyle = "aggressive";
    } else if (winRate > 55 && threeCrownRate < 30) {
      playstyle = "control";
    } else {
      playstyle = "balanced";
    }

    const preferredArchetypes = [];
    const masteryBadges: { name: string; level: number }[] =
      playerData.badges.filter((b: { name: string }) =>
        b.name.startsWith("Mastery")
      );
    const hasMasteredLavaHound = masteryBadges.some(
      (b) => b.name === "MasteryLavaHound" && b.level > 5
    );
    const hasMasteredMiner = masteryBadges.some(
      (b) => b.name === "MasteryMiner" && b.level > 5
    );
    const hasMasteredTombstone = masteryBadges.some(
      (b) => b.name === "MasteryTombstone" && b.level > 5
    );

    if (hasMasteredLavaHound) preferredArchetypes.push("LavaLoon");
    if (hasMasteredMiner) preferredArchetypes.push("Miner Control");
    if (hasMasteredTombstone) preferredArchetypes.push("Graveyard");

    const strengthAreas = [];
    if (playerData.challengeMaxWins >= 15) strengthAreas.push("tournament");
    if (winRate > 55) strengthAreas.push("ladder");
    if (threeCrownRate > 40) strengthAreas.push("beatdown");
    if (playerData.warDayWins > 200) strengthAreas.push("war");

    const weaknessAreas = [];
    if (challengeWinRate < 0.5) weaknessAreas.push("challenges");
    if (winRate < 50) weaknessAreas.push("consistency");
    if (threeCrownRate < 20) weaknessAreas.push("closing games");

    return {
      playstyle,
      skillLevel,
      preferredArchetypes,
      strengthAreas,
      weaknessAreas,
    };
  };

  const [aggressiveDeck, setAggressiveDeck] = useState<CardType[]>([]);
  const [controlDeck, setControlDeck] = useState<CardType[]>([]);
  const [speedDeck, setSpeedDeck] = useState<CardType[]>([]);

  const generateDeckRecommendation = async (
    playerData: {
      trophies: number;
      wins: number;
      losses: number;
      threeCrownWins: number;
      challengeMaxWins: number;
      warDayWins: number;
      badges: { name: string; level: number }[];
    },
    availableCards: CardType[]
  ): Promise<void> => {
    const analysis = analyzePlayerProfile(playerData);

    const generatePrompt = (style: string) => `
    As a Clash Royale expert, generate a ${style} deck based on this player profile:
    
    Player Analysis:
    - Playstyle: ${analysis.playstyle}
    - Skill Level: ${analysis.skillLevel}
    - Preferred Archetypes: ${analysis.preferredArchetypes.join(", ")}
    - Strengths: ${analysis.strengthAreas.join(", ")}
    - Weaknesses: ${analysis.weaknessAreas.join(", ")}
  
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
    ${availableCards.map((card) => `${card.name}`).join(", ")}
    `;

    try {
      const [aggressiveResponse, controlResponse, speedResponse] = await Promise.all([
        openaiManager.createCompletion([
          {
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide aggressive deck recommendations.",
          },
          {
            role: "user",
            content: generatePrompt("aggressive"),
          },
        ]),
        openaiManager.createCompletion([
          {
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide control deck recommendations.",
          },
          {
            role: "user",
            content: generatePrompt("control"),
          },
        ]),
        openaiManager.createCompletion([
          {
            role: "system",
            content: "You are a Clash Royale expert deck builder. Provide fast cycle deck recommendations.",
          },
          {
            role: "user",
            content: generatePrompt("fast cycle"),
          },
        ]),
      ]);

      const processResponse = (response: string) => {
        const cardNames = response
          .trim()
          .split(",")
          .map((name) => name.trim());
        return cardNames
          .map((cardName) =>
            availableCards.find(
              (card) => card.name.toLowerCase() === cardName.toLowerCase()
            )
          )
          .filter(Boolean) as CardType[];
      };

      const aggressiveDeck = processResponse(
        aggressiveResponse.choices[0].message.content || ""
      );
      const controlDeck = processResponse(
        controlResponse.choices[0].message.content || ""
      );
      const speedDeck = processResponse(
        speedResponse.choices[0].message.content || ""
      );

      setAggressiveDeck(aggressiveDeck);
      setControlDeck(controlDeck);
      setSpeedDeck(speedDeck);
    } catch (error) {
      console.error("Error generating deck recommendations:", error);
      setError(error instanceof Error ? error.message : "Failed to generate decks");
      // Fallback to basic decks if AI fails
      const generateBasicDeck = () =>
        availableCards.sort(() => Math.random() - 0.5).slice(0, 8);

      setAggressiveDeck(generateBasicDeck());
      setControlDeck(generateBasicDeck());
      setSpeedDeck(generateBasicDeck());
    }
  };

  const DeckTypeGuide = ({
    type,
    description,
    tips,
  }: {
    type: string;
    description: string;
    tips: string[];
  }) => (
    <Card className="bg-gradient-to-r from-slate-500/10 to-slate-400/10">
      <CardHeader>
        <CardTitle className="text-sm sm:text-base">{type}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc ml-4 space-y-1 text-sm">
          {tips.map((tip, i) => (
            <li key={i}>{tip}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );

  const DeckDisplay = ({
    deck,
    title,
    description,
    icon: Icon,
  }: {
    deck: CardType[];
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
  }) => (
    <Card className="h-full">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Icon className="text-yellow-500 h-4 w-4 sm:h-5 sm:w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">{description}</CardDescription>
        <div className="flex items-center gap-4 mt-2 text-sm">
          <span>
            Avg Elixir:{" "}
            {(deck.reduce((sum, card) => sum + card.elixirCost, 0) / 8).toFixed(
              1
            )}
          </span>
          <span>Cards: {deck.length}/8</span>
        </div>
      </CardHeader>
      <CardContent className="p-2 sm:p-6">
        <TooltipProvider>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {deck.map((card, index) => (
              <Tooltip key={`${card.id}-${index}`}>
                <TooltipTrigger className="w-full">
                  <div className="relative group touch-none">
                    <Image
                      src={card.iconUrls.medium}
                      alt={card.name}
                      width={64}
                      height={64}
                      className="w-12 h-12 sm:w-16 sm:h-16 mx-auto transition-transform group-hover:scale-110"
                      priority
                      loading="eager"
                    />
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center text-xs">
                      {card.elixirCost}
                    </div>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-bold text-sm">{card.name}</p>
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
    const formattedTag = playerTag.startsWith("#")
      ? playerTag.substring(1)
      : playerTag; // Remove leading '#' if present

    try {
      const playerRes = await fetch(`${BASE_URL}/players/%23${formattedTag}`, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (!playerRes.ok) {
        throw new Error("Player not found");
      }

      const playerData = await playerRes.json();
      setPlayerData(playerData);

      const cardsRes = await fetch(`${BASE_URL}/cards`, {
        headers: {
          Authorization: apiKey,
        },
      });

      if (!cardsRes.ok) {
        throw new Error("Failed to fetch cards");
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
    setError("");

    const apiKeys = [API_KEY1, API_KEY2, API_KEY3, API_KEY4];

    for (let i = 0; i < apiKeys.length; i++) {
      try {
        if (apiKeys[i]) {
          await fetchWithApiKey(apiKeys[i]!);
          setLoading(false); // Add this line for success case
          setError("");
          return;
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-50 to-blue-100 dark:from-slate-900 dark:to-blue-900">

    <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-200/20 via-transparent to-transparent animate-pulse" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-200/10 via-transparent to-transparent animate-pulse delay-700" />
      </div>

      <div className="container mx-auto relative z-10 px-4 py-6 space-y-6">

      <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 shadow-lg shadow-blue-500/10">

      <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
              <Info className="text-blue-500" />
              How to Use & Deck Guides
            </CardTitle>
          </CardHeader>
          <CardContent>
          <Tabs defaultValue="instructions" className="w-full">
              <TabsList className="bg-blue-50 dark:bg-slate-700">
                <TabsTrigger value="instructions">Basic Guide</TabsTrigger>
                <TabsTrigger value="deckTypes">Deck Types</TabsTrigger>
                <TabsTrigger value="tips">Pro Tips</TabsTrigger>
              </TabsList>
              <TabsContent value="instructions">
                <ol className="list-decimal ml-4 space-y-2 text-sm sm:text-base">
                  <li>
                    Find your player tag in Clash Royale (tap profile → copy
                    tag)
                  </li>
                  <li>Enter your tag here (with or without #)</li>
                  <li>View your stats and personalized deck recommendations</li>
                  <li>Each deck is tailored to different playstyles</li>
                  <li>Hover/tap cards to see details and tips</li>
                </ol>
              </TabsContent>
              <TabsContent
                value="deckTypes"
                className="grid gap-4 sm:grid-cols-3"
              >
                <DeckTypeGuide
                  type="Aggressive Deck"
                  description="High damage output, focused on tower pressure"
                  tips={[
                    "Push opposite lanes",
                    "Build big pushes",
                    "Force opponent to spend elixir",
                  ]}
                />
                <DeckTypeGuide
                  type="Control Deck"
                  description="Defensive with counter-push potential"
                  tips={[
                    "Defend efficiently",
                    "Track opponent's elixir",
                    "Counter-push with surviving troops",
                  ]}
                />
                <DeckTypeGuide
                  type="Speed Cycle Deck"
                  description="Fast cycle for constant pressure"
                  tips={[
                    "Cycle cards quickly",
                    "Out-rotate opponent",
                    "Apply constant pressure",
                  ]}
                />
              </TabsContent>
              <TabsContent value="tips">
                <div className="space-y-4">
                  <h3 className="font-semibold text-blue-600 dark:text-blue-400">Advanced Strategies</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <BarChart3 className="text-purple-500 h-4 w-4" />
                      Track your elixir trades
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="text-yellow-500 h-4 w-4" />
                      Learn optimal card combinations
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="text-green-500 h-4 w-4" />
                      Master defensive positioning
                    </li>
                  </ul>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/90 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 shadow-lg shadow-blue-500/10">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-3 text-slate-800 dark:text-slate-100">
              <Crown className="text-blue-500 h-6 w-6" />
              Clash Royale AI Deck Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Input
                  placeholder="Enter player tag (e.g., #V0R9VUGUU)"
                  value={playerTag}
                  onChange={(e) => setPlayerTag(e.target.value)}
                  className="pl-10 h-12 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100"
                />
                <Search className="absolute left-3 top-4 h-4 w-4 text-slate-400" />
              </div>
              <Button
                onClick={fetchPlayerData}
                disabled={loading}
                className="h-12 px-6 bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Generate Decks
                  </div>
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-4 sm:space-y-6">
            <Card className="bg-gradient-to-br from-white/90 to-purple-50/90 dark:from-slate-800/90 dark:to-purple-900/90 backdrop-blur-sm border border-purple-200 dark:border-purple-500/20 shadow-lg shadow-purple-500/10">
            <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700 dark:text-purple-300">
            <Shield className="text-purple-500" />
            Player Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 dark:text-slate-300">

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
                    <div className="mt-4">
                    <h4 className="text-sm font-medium mb-2">Win Rate Progress</h4>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                      <div 
                        className="bg-purple-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ 
                          width: `${(playerData.wins / (playerData.wins + playerData.losses)) * 100}%` 
                        }}
                      />
                    </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-white/90 to-blue-50/90 dark:from-slate-800/90 dark:to-blue-900/90 backdrop-blur-sm border border-blue-200 dark:border-blue-500/20 shadow-lg shadow-blue-500/10">
              <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-100">
                    <Scroll className="text-blue-500" />
                    Battle Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-slate-600 dark:text-slate-300">

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>Win Rate</span>
                      <span className="font-semibold">
                        {(
                          (playerData.wins /
                            (playerData.wins + playerData.losses)) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Three Crown Rate</span>
                      <span className="font-semibold">
                        {(
                          (playerData.threeCrownWins / playerData.wins) *
                          100
                        ).toFixed(1)}
                        %
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Challenge Max Wins</span>
                      <span className="font-semibold">
                        {playerData.challengeMaxWins}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>War Day Wins</span>
                      <span className="font-semibold">
                        {playerData.warDayWins}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
               <Card className="bg-gradient-to-br from-white/90 to-indigo-50/90 dark:from-slate-800/90 dark:to-indigo-900/90 backdrop-blur-sm border border-indigo-200 dark:border-indigo-500/20 shadow-lg shadow-indigo-500/10">
               <CardHeader className="p-4 sm:p-6">
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-2">
    <CardTitle className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 text-sm sm:text-base">
      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-500" />
      Deck Recommendations
    </CardTitle>
    <div className="flex flex-wrap w-full sm:w-auto gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => shareDeck(aggressiveDeck)}
        className="flex-1 sm:flex-initial text-xs sm:text-sm bg-white/50 dark:bg-slate-800/50 min-h-[36px] sm:min-h-[32px]"
      >
        <Share2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Share
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => saveDeck('aggressive', aggressiveDeck)}
        className="flex-1 sm:flex-initial text-xs sm:text-sm bg-white/50 dark:bg-slate-800/50 min-h-[36px] sm:min-h-[32px]"
      >
        <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
        Save
      </Button>
    </div>
  </div>
</CardHeader>
              <CardContent>
                <Tabs defaultValue="aggressive" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4 bg-slate-100 dark:bg-slate-700">
                    <TabsTrigger value="aggressive">Aggressive</TabsTrigger>
                    <TabsTrigger value="control">Control</TabsTrigger>
                    <TabsTrigger value="speed">Speed</TabsTrigger>
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
      </div>
    </main>
  );
}
