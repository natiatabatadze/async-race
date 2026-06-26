export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export type CarStatus = 'idle' | 'driving' | 'finished' | 'broken';

export interface CarRaceState {
  status: CarStatus;
  position: number;   // 0–100 (%)
  duration: number;   // ms
}