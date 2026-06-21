// CoolZone - API Client
// Handles communication with Backend API

// ============================================
// Configuration
// ============================================
const API_BASE_URL = 'http://localhost:5000/api';

// Current user profile
let currentProfile = 'general'; // 'general', 'elderly', 'outdoor_worker'

// ============================================
// API Client Functions
// ============================================

/**
 * Fetch current weather and heat risk data
 */
async function fetchWeatherData(lat, lng) {
    console.log(`Fetching weather data for: ${lat}, ${lng}`);

    try {
        const url = `${API_BASE_URL}/weather?lat=${lat}&lng=${lng}&profile=${currentProfile}`;

        const response = await fetch(url);

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to fetch weather data');
        }

        const data = await response.json();
        console.log('Weather data received:', data);

        return data;

    } catch (error) {
        console.error('Error fetching weather:', error);

        // Show error to user
        showError('ไม่สามารถดึงข้อมูลสภาพอากาศได้', error.message);

        return null;
    }
}

/**
 * Fetch weather forecast
 */
async function fetchForecast(lat, lng, hours = 6) {
    console.log(`Fetching forecast for: ${lat}, ${lng}`);

    try {
        const url = `${API_BASE_URL}/forecast?lat=${lat}&lng=${lng}&hours=${hours}&profile=${currentProfile}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch forecast');
        }

        const data = await response.json();
        console.log('Forecast data received:', data);

        return data;

    } catch (error) {
        console.error('Error fetching forecast:', error);
        return null;
    }
}

/**
 * Update weather display after location is obtained
 */
async function updateWeatherDisplay(lat, lng) {
    console.log('Updating weather display...');

    // Show loading state
    updateRiskBadge({
        risk_level: 'LOADING',
        message: 'กำลังโหลดข้อมูล...'
    });

    // Fetch weather data
    const weatherData = await fetchWeatherData(lat, lng);

    if (!weatherData || weatherData.status !== 'success') {
        updateRiskBadge({
            risk_level: 'ERROR',
            message: 'ไม่สามารถโหลดข้อมูลได้'
        });
        return;
    }

    // Update risk badge
    updateRiskBadge({
        risk_level: weatherData.data.risk_level,
        heat_index: weatherData.data.heat_index,
        temperature: weatherData.data.weather.temperature,
        humidity: weatherData.data.weather.humidity,
        message: weatherData.data.risk_info.message,
        recommendations: weatherData.data.risk_info.recommendations
    });

    // Show risk badge
    document.getElementById('risk-badge').classList.remove('hidden');

    console.log('Weather display updated successfully');
}

/**
 * Update risk badge UI
 */
function updateRiskBadge(data) {
    const riskBadge = document.getElementById('risk-badge');
    const riskLevelElement = document.getElementById('risk-level');
    const heatIndexElement = document.getElementById('heat-index');
    const temperatureElement = document.getElementById('temperature');
    const humidityElement = document.getElementById('humidity');

    // Remove all risk level classes
    riskLevelElement.classList.remove(
        'bg-green-100', 'text-green-800',
        'bg-yellow-100', 'text-yellow-800',
        'bg-red-100', 'text-red-800',
        'bg-gray-100', 'text-gray-800'
    );

    // Handle different states
    if (data.risk_level === 'LOADING') {
        riskLevelElement.classList.add('bg-gray-100', 'text-gray-800');
        riskLevelElement.textContent = '⏳ กำลังโหลด...';
        return;
    }

    if (data.risk_level === 'ERROR') {
        riskLevelElement.classList.add('bg-gray-100', 'text-gray-800');
        riskLevelElement.textContent = '❌ ข้อผิดพลาด';
        return;
    }

    // Update based on risk level
    if (data.risk_level === 'LOW') {
        riskLevelElement.classList.add('bg-green-100', 'text-green-800');
        riskLevelElement.textContent = '🟢 ปลอดภัย';
    } else if (data.risk_level === 'MEDIUM') {
        riskLevelElement.classList.add('bg-yellow-100', 'text-yellow-800');
        riskLevelElement.textContent = '🟡 ระวัง';
    } else if (data.risk_level === 'HIGH') {
        riskLevelElement.classList.add('bg-red-100', 'text-red-800');
        riskLevelElement.textContent = '🔴 อันตราย';
    }

    // Update values
    heatIndexElement.textContent = data.heat_index || '--';
    temperatureElement.textContent = data.temperature || '--';
    humidityElement.textContent = data.humidity || '--';

    // Store recommendations for modal
    if (data.recommendations) {
        riskBadge.dataset.recommendations = JSON.stringify(data.recommendations);
        riskBadge.dataset.message = data.message;
    }
}

/**
 * Show error message
 */
function showError(title, message) {
    alert(`❌ ${title}\n\n${message}\n\nกรุณาตรวจสอบ:\n- Backend API กำลังรันอยู่ (localhost:5000)\n- มี API Key ของ OpenWeatherMap\n- การเชื่อมต่ออินเทอร์เน็ต`);
}

/**
 * Change user profile
 */
function changeProfile(profile) {
    currentProfile = profile;
    console.log(`Profile changed to: ${profile}`);

    // If location is available, refresh weather data
    if (userLocation.lat && userLocation.lng) {
        updateWeatherDisplay(userLocation.lat, userLocation.lng);
    }
}

/**
 * Show risk details modal
 */
function showRiskDetails() {
    const riskBadge = document.getElementById('risk-badge');
    const message = riskBadge.dataset.message;
    const recommendations = JSON.parse(riskBadge.dataset.recommendations || '[]');

    let recommendationsText = recommendations.map(r => `• ${r}`).join('\n');

    alert(`🌡️ รายละเอียดความเสี่ยง\n\n${message}\n\n📋 คำแนะนำ:\n${recommendationsText}`);
}
