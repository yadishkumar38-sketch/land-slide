export type AppTab = "home" | "dashboard" | "analysis" | "map" | "weather" | "database" | "contact";

export interface HillAnalysis {
  id: string;
  imageName: string;
  imageUrl: string;
  timestamp: string;
  riskPercentage: number;
  confidenceScore: number;
  safetyLevel: "Safe" | "Moderate Risk" | "High Risk";
  detectedIssues: string[];
  explanation: string;
  isSimulated?: boolean;
}

export interface LandslideEvent {
  id: string;
  location: string;
  date: string;
  cause: string;
  severity: "Minor" | "Moderate" | "Severe" | "Extreme";
  affectedPeople: number;
  imageUrl: string;
  lat: number;
  lng: number;
}

export interface WeatherState {
  condition: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainfallLevel: number; // in mm
  weatherRiskScore: number; // 0 - 100
  prediction: string;
}

export interface MapMarker {
  id: string;
  type: "hazard" | "shelter" | "history" | "user";
  name: string;
  lat: number; // 0-100 local grid coordinates
  lng: number; // 0-100 local grid coordinates
  description: string;
  riskLevel?: "Safe" | "Moderate" | "High";
  capacity?: string;
}
