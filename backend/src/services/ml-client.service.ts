import axios, { AxiosInstance } from 'axios';

interface MLDetectionResult {
  context: string;
  confidence: number;
  detection_id: string;
  timestamp: string;
  method: string;
  alternative_contexts: Array<{
    context: string;
    confidence: number;
  }>;
  processing_time_ms: number;
}

/**
 * Client for ML Service communication
 */
export class MLClientService {
  private client: AxiosInstance;
  private isAvailable: boolean = false;
  private readonly ML_SERVICE_URL: string;

  constructor() {
    this.ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

    this.client = axios.create({
      baseURL: this.ML_SERVICE_URL,
      timeout: 5000, // 5 second timeout
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Check ML service availability on initialization
    this.checkAvailability();
  }

  /**
   * Check if ML service is available
   */
  private async checkAvailability(): Promise<void> {
    try {
      const response = await this.client.get('/health');
      this.isAvailable = response.status === 200;
      console.log(`ML Service is ${this.isAvailable ? 'available' : 'unavailable'}`);
    } catch (error) {
      this.isAvailable = false;
      console.log('ML Service not available, using rule-based fallback');
    }
  }

  /**
   * Detect context using ML service
   */
  async detectContext(
    text: string,
    previousContext?: string,
    useML: boolean = true
  ): Promise<MLDetectionResult | null> {
    // Re-check availability periodically
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return null; // Fallback to rule-based
    }

    try {
      const response = await this.client.post<MLDetectionResult>('/api/v1/detect', {
        text,
        previous_context: previousContext,
        use_ml: useML
      });

      return response.data;
    } catch (error) {
      console.error('ML detection failed:', error);
      this.isAvailable = false; // Mark as unavailable
      return null;
    }
  }

  /**
   * Get ML service health status
   */
  async getHealth(): Promise<any> {
    try {
      const response = await this.client.get('/health');
      return response.data;
    } catch (error) {
      return {
        status: 'unavailable',
        error: 'ML service not reachable'
      };
    }
  }

  /**
   * Get ML service metrics
   */
  async getMetrics(): Promise<any> {
    try {
      const response = await this.client.get('/api/v1/metrics');
      return response.data;
    } catch (error) {
      return null;
    }
  }

  /**
   * Check if ML service is currently available
   */
  isServiceAvailable(): boolean {
    return this.isAvailable;
  }
}
