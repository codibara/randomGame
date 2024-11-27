export interface GameAttributes {
    Difficulty: string;
    NoiseLevel: string;
    RiskLevel: string;
    Required: string;
  }

  export interface HowToPlay {
    step01: string;
    step02: string;
    step03: string;
  }

  export interface SeeItInAction {
    Difficulty: string;
    NoiseLevel: string;
    RiskLevel: string;
    Required: string;
  }
  
  export interface Game {
    id: number;
    EngName: string;
    KorName: string;
    Pronounce: string;
    Attributes: GameAttributes;
    HowToPlay: HowToPlay; // Add this
    SeeItInAction: string[]; 
  }
  
  export interface GameData {
    games: Game[];
  }