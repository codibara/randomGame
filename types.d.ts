export interface GameAttributes {
    Difficulty: number;
    NoiseLevel: number;
    RiskLevel: number;
    Required: string;
  }

  export interface HowToPlay {
    1: string;
    2: string;
    3: string;
  }
  
  export interface Game {
    id: number;
    EngName: string;
    KorName: string;
    Pronounce: string;
    Attributes: GameAttributes;
    HowToPlay: HowToPlay;
  }
  
  export interface GameData {
    games: Game[];
  }