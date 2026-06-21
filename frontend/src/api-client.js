// CoolZone - API Client
// Handles all communication with Backend API

class APIClient {
    constructor(baseURL) {
        this.baseURL = baseURL;
    }

    /**
     * Fetch current weather and heat risk
     */
    async getWeather(lat, lng, profile = 'general') {
        try {
            const url = `${this.baseURL}/weather?lat=${lat}&lng=${lng}&profile=${profile}`;

            console.log(`Fetching weather: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.message);
            }

            return data.data;

        } catch (error) {
            console.error('Error fetching weather:', error);
            throw error;
        }
    }

    /**
     * Fetch weather forecast
     */
    async getForecast(lat, lng, hours = 6, profile = 'general') {
        try {
            const url = `${this.baseURL}/forecast?lat=${lat}&lng=${lng}&hours=${hours}&profile=${profile}`;

            console.log(`Fetching forecast: ${url}`);

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();

            if (data.status === 'error') {
                throw new Error(data.message);
            }

            return data.data.forecast;

        } catch (error) {
            console.error('Error fetching forecast:', error);
            throw error;
        }
    }

    /**
     * Health check
     */
    async healthCheck() {
        try {
            const response = await fetch(`${this.baseURL}/health`);
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) {
            console.error('Health check failed:', error);
            return false;
        }
    }
}

// Create singleton instance
const apiClient = new APIClient(CONFIG.API_BASE_URL);
