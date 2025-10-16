//TYPES FOR THE DATA THAT IS BEING RECEIVED FROM THE BACKEND

export interface StockListType {
  price: number;
  ticker: string;
  change: number;
  name: string;
  status: string;
}

export interface ChartingType {
  data: any; //have to change this once we start getting better understanding of data from backend
  status: string;
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
  sentiment: string;
  confidence: number;
  lastUpdated: string;
}
