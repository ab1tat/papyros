export interface TelemetryResponseDTO {
  id: number;
  agentId: string;
  sessionId: string;
  targetFilePath: string;
  entropyValue: number;
  analysisTimestamp: string;
  processingTimeMs: number;
  riskLevel: string;
  createdAt: string;
}
