export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  garage: `${API_BASE_URL}/garage`,
  engine: `${API_BASE_URL}/engine`,
  winners: `${API_BASE_URL}/winners`,
} as const;

export const CARS_PER_PAGE = 7;
export const WINNERS_PER_PAGE = 10;
