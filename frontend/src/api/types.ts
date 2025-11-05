//TYPES FOR THE DATA THAT IS BEING RECEIVED FROM THE BACKEND

/**
 * Generic API response wrapper
 * All API responses follow this structure
 */
export interface ApiResponse<T> {
  data: T;
  status: string;
  message?: string;
}

/**
 * Stock list item type
 */
export interface StockListType {
  price: number;
  ticker: string;
  change: number;
  name: string;
  status: string;
}

// Individual price point data
export interface PricePoint {
  date: string; // e.g., "Oct 1" or "2024-10-01" or timestamp
  price: number; // Stock price
  volume?: number; // Trading volume (optional)
  open?: number; // Opening price (optional)
  high?: number; // High price (optional)
  low?: number; // Low price (optional)
  close?: number; // Closing price (optional)
}

export interface ChartingType {
  data: PricePoint[]; // Array of price points
  status: string;
  ticker?: string; // Which stock this data is for
}

export interface SentimentType {
  sentiment: string;
  confidence: number;
  description: string;
  ticker: string;
  lastUpdated: string;
}

export interface NewsType {
  ticker: string;
  title: string;
  description: string;
  url: string;
  image: string;
  lastUpdated: string;
}

export interface WatchlistType {
  ticker: string;
  name: string;
}

/**
 * Price point data with technical indicators
 * Extends PricePoint with indicator fields
 */
export interface IndicatorDataPoint extends PricePoint {
  ema12?: number;
  ema26?: number;
  macd?: number;
  signal?: number;
  histogram?: number;
  rsi?: number;
  sma20?: number;
  upperBand?: number;
  lowerBand?: number;
}
