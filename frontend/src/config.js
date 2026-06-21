// CoolZone - Configuration
// API Endpoints and Settings

const CONFIG = {
    // Backend API URL - Auto-detect environment
    API_BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:5000/api'  // Development
        : '/api',  // Production (Vercel - same domain)

    // Default settings
    DEFAULT_PROFILE: 'general', // 'general', 'elderly', 'outdoor_worker'

    // Update intervals (milliseconds)
    WEATHER_UPDATE_INTERVAL: 300000, // 5 minutes

    // Map settings
    DEFAULT_ZOOM: 13,
    USER_ZOOM: 15,

    // Risk colors
    RISK_COLORS: {
        LOW: {
            bg: 'bg-green-100',
            text: 'text-green-800',
            border: 'border-green-500',
            hex: '#10b981'
        },
        MEDIUM: {
            bg: 'bg-yellow-100',
            text: 'text-yellow-800',
            border: 'border-yellow-500',
            hex: '#eab308'
        },
        HIGH: {
            bg: 'bg-red-100',
            text: 'text-red-800',
            border: 'border-red-500',
            hex: '#ef4444'
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
