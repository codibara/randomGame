export interface GameAttributes {
    Difficulty: number;
    NoiseLevel: number;
    RiskLevel: number;
    Required: string;
  }

  export interface HowToPlay {
    step01: string;
    step02: string;
    step03: string;
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