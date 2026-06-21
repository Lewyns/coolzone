// CoolZone - Main Application
// Phase 1: Map First (Leaflet + GPS)
// Phase 2: Weather API Integration

// ============================================
// Global Variables
// ============================================
let map = null;
let userMarker = null;
var userLocation = {
    lat: null,
    lng: null
};

// Default location (Bangkok, Siam)
const DEFAULT_LOCATION = {
    lat: 13.7563,
    lng: 100.5018
};

// Phase 3: Cooling Centers & Hazard Points
// Note: coolingCenterMarkers and hazardPointMarkers are declared in markers.js
let coolingCentersVisible = false;
let hazardPointsVisible = false;
let coolingCentersData = [];
let hazardPointsData = [];

// Phase 4: Risk Profile & Filters
let currentRiskProfile = 'general';
let currentDistanceFilter = 5000; // meters

// Phase 5: Forecast
let forecastData = [];

// Phase 5: Notifications
let notificationThreshold = 500; // meters
let notifiedHazards = new Set(); // Track already notified hazards

// Phase 6: UI Enhancements
let toastTimeout = null;

// Phase 7: Navigation
let routingControl = null;
let isNavigating = false;

// ============================================
// Map Initialization
// ============================================
function initMap() {
    console.log('Initializing map...');

    // Create map centered at default location
    map = L.map('map', {
        center: [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng],
        zoom: 13,
        zoomControl: true,
        attributionControl: true
    });

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    console.log('Map initialized successfully');

    // Move zoom control to bottom right
    map.zoomControl.setPosition('bottomright');
}

// ============================================
// GPS / Geolocation
// ============================================
function getUserLocation() {
    console.log('Requesting user location...');

    // Update status
    updateGPSStatus('กำลังรับตำแหน่ง...', 'loading');

    if (!navigator.geolocation) {
        console.error('Geolocation not supported');
        updateGPSStatus('เบราว์เซอร์ไม่รองรับ GPS', 'error');
        useDefaultLocation();
        return;
    }

    // Request GPS permission
    navigator.geolocation.getCurrentPosition(
        onLocationSuccess,
        onLocationError,
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function onLocationSuccess(position) {
    console.log('GPS Success:', position.coords);

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Store user location
    userLocation.lat = lat;
    userLocation.lng = lng;

    // Update status
    updateGPSStatus('ตำแหน่งพบแล้ว', 'success');
    updateLocationText(lat, lng);

    // Add user marker on map
    addUserMarker(lat, lng);

    // Center map to user location
    centerMap(lat, lng, 15);

    // Fetch weather data (Phase 2)
    fetchWeatherData(lat, lng);

    // Fetch cooling centers and hazard points (Phase 3)
    fetchCoolingCenters(lat, lng);
    fetchHazardPoints(lat, lng);

    // Fetch forecast (Phase 5)
    fetchForecast(lat, lng);

    // Update recommendations (Phase 4)
    updateRecommendations();

    // Request notification permission (Phase 5)
    requestNotificationPermission();

    // Hide loading screen
    hideLoadingScreen();
}

function onLocationError(error) {
    console.error('GPS Error:', error.message);

    let errorMessage = 'ไม่สามารถรับตำแหน่งได้';

    switch(error.code) {
        case error.PERMISSION_DENIED:
            errorMessage = 'คุณปฏิเสธการเข้าถึง GPS';
            break;
        case error.POSITION_UNAVAILABLE:
            errorMessage = 'ไม่สามารถระบุตำแหน่งได้';
            break;
        case error.TIMEOUT:
            errorMessage = 'หมดเวลารอตำแหน่ง';
            break;
    }

    updateGPSStatus(errorMessage, 'error');

    // Fallback to default location
    useDefaultLocation();
}

function useDefaultLocation() {
    console.log('Using default location (Bangkok)...');

    userLocation.lat = DEFAULT_LOCATION.lat;
    userLocation.lng = DEFAULT_LOCATION.lng;

    // Add marker at default location
    addUserMarker(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);

    // Center map
    centerMap(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, 13);

    // Update location text
    updateLocationText(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng, true);

    // Fetch weather data (Phase 2)
    fetchWeatherData(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);

    // Fetch cooling centers and hazard points (Phase 3)
    fetchCoolingCenters(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);
    fetchHazardPoints(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);

    // Fetch forecast (Phase 5)
    fetchForecast(DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng);

    // Update recommendations (Phase 4)
    updateRecommendations();

    // Hide loading screen
    hideLoadingScreen();
}

// ============================================
// Map Markers
// ============================================
function addUserMarker(lat, lng) {
    console.log('Adding user marker at:', lat, lng);

    // Remove existing marker if any
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    // Create custom blue icon for user
    const userIcon = L.divIcon({
        className: 'custom-user-marker',
        html: `
            <div style="
                width: 40px;
                height: 40px;
                background: #3B82F6;
                border: 4px solid white;
                border-radius: 50%;
                box-shadow: 0 4px 8px rgba(0,0,0,0.3);
                position: relative;
            ">
                <div style="
                    width: 12px;
                    height: 12px;
                    background: white;
                    border-radius: 50%;
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                "></div>
            </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    // Add marker to map
    userMarker = L.marker([lat, lng], {
        icon: userIcon,
        title: 'ตำแหน่งของคุณ'
    }).addTo(map);

    // Add popup
    userMarker.bindPopup(`
        <div class="text-center">
            <p class="font-bold text-blue-600">📍 คุณอยู่ที่นี่</p>
            <p class="text-xs text-gray-600 mt-1">${lat.toFixed(4)}, ${lng.toFixed(4)}</p>
        </div>
    `);
}

function centerMap(lat, lng, zoom = 15) {
    if (map) {
        map.flyTo([lat, lng], zoom, {
            duration: 1.5,
            easeLinearity: 0.5
        });
    }
}

// ============================================
// Weather API Integration (Phase 2)
// ============================================
async function fetchWeatherData(lat, lng) {
    console.log('Fetching weather data for:', lat, lng, 'profile:', currentRiskProfile);

    try {
        // Show loading in risk badge
        showRiskBadge();
        showLoading('risk-badge');
        updateRiskBadge({
            risk_level: 'LOADING',
            heat_index: '--',
            temperature: '--',
            humidity: '--'
        });

        const url = `http://localhost:5000/api/weather?lat=${lat}&lng=${lng}&profile=${currentRiskProfile}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Weather data received:', result.data);

            // Update risk badge with real data
            updateRiskBadge({
                risk_level: result.data.risk_level,
                heat_index: result.data.heat_index,
                temperature: result.data.weather.temperature,
                humidity: result.data.weather.humidity,
                risk_info: result.data.risk_info
            });

            hideLoading('risk-badge');
            fadeInPanel('risk-badge');
        } else {
            throw new Error(result.message || 'Failed to fetch weather data');
        }

    } catch (error) {
        console.error('Error fetching weather:', error);
        hideLoading('risk-badge');
        updateRiskBadge({
            risk_level: 'ERROR',
            heat_index: '--',
            temperature: '--',
            humidity: '--'
        });

        // Show user-friendly error (Phase 6)
        showToast('ไม่สามารถเชื่อมต่อ Weather API กรุณาตรวจสอบ Backend', 'error', 5000);
    }
}

function showRiskBadge() {
    const riskBadge = document.getElementById('risk-badge');
    riskBadge.classList.remove('hidden');
    fadeInPanel('risk-badge');
}

function updateRiskBadge(data) {
    const riskLevelEl = document.getElementById('risk-level');
    const heatIndexEl = document.getElementById('heat-index');
    const temperatureEl = document.getElementById('temperature');
    const humidityEl = document.getElementById('humidity');
    const riskDescriptionEl = document.getElementById('risk-description');

    // Update values
    heatIndexEl.textContent = data.heat_index;
    temperatureEl.textContent = data.temperature;
    humidityEl.textContent = data.humidity;

    // Remove all risk classes
    riskLevelEl.classList.remove(
        'bg-green-100', 'text-green-800',
        'bg-yellow-100', 'text-yellow-800',
        'bg-red-100', 'text-red-800',
        'bg-gray-100', 'text-gray-800'
    );

    // Update risk level with colors
    if (data.risk_level === 'LOW') {
        riskLevelEl.classList.add('bg-green-100', 'text-green-800');
        riskLevelEl.textContent = '🟢 ปลอดภัย';
    } else if (data.risk_level === 'MEDIUM') {
        riskLevelEl.classList.add('bg-yellow-100', 'text-yellow-800');
        riskLevelEl.textContent = '🟡 ระวัง';
    } else if (data.risk_level === 'HIGH') {
        riskLevelEl.classList.add('bg-red-100', 'text-red-800');
        riskLevelEl.textContent = '🔴 อันตราย';
    } else if (data.risk_level === 'LOADING') {
        riskLevelEl.classList.add('bg-gray-100', 'text-gray-800');
        riskLevelEl.textContent = '⏳ กำลังโหลด...';
    } else {
        riskLevelEl.classList.add('bg-gray-100', 'text-gray-800');
        riskLevelEl.textContent = '❌ ข้อผิดพลาด';
    }

    // Show risk info if available (Phase 4)
    if (data.risk_info) {
        console.log('Risk Info:', data.risk_info.message);
        console.log('Recommendations:', data.risk_info.recommendations);

        // Update risk description panel
        riskDescriptionEl.innerHTML = `
            <p class="font-semibold text-gray-700 mb-1">${data.risk_info.message}</p>
            ${data.risk_info.recommendations && data.risk_info.recommendations.length > 0 ? `
                <ul class="list-disc list-inside space-y-1 text-gray-600">
                    ${data.risk_info.recommendations.slice(0, 2).map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            ` : ''}
        `;
    } else {
        riskDescriptionEl.innerHTML = '';
    }
}

// ============================================
// Phase 3: Cooling Centers API
// ============================================
async function fetchCoolingCenters(lat, lng) {
    console.log('Fetching cooling centers for:', lat, lng);

    try {
        const url = `http://localhost:5000/api/cooling-centers?lat=${lat}&lng=${lng}&radius=5000&limit=20`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Cooling centers received:', result.data.total);
            coolingCentersData = result.data.centers;

            // Auto-show cooling centers on load
            if (coolingCentersData.length > 0) {
                showCoolingCenters();
                showToast(`พบจุดพักร้อน ${coolingCentersData.length} จุด`, 'success');
            }

            // Update recommendations (Phase 4)
            updateRecommendations();
        }

    } catch (error) {
        console.error('Error fetching cooling centers:', error);
        showToast('ไม่สามารถโหลดจุดพักร้อนได้', 'error');
    }
}

function showCoolingCenters() {
    console.log('Showing cooling centers with filters:', {
        distance: currentDistanceFilter
    });

    // Remove existing markers
    coolingCenterMarkers.forEach(marker => map.removeLayer(marker));
    coolingCenterMarkers = [];

    // Filter data
    let filtered = coolingCentersData.filter(center => {
        // Distance filter
        if (center.distance > currentDistanceFilter) return false;

        return true;
    });

    // Add markers for each cooling center
    filtered.forEach(center => {
        // Use single icon for all cooling centers
        const iconColor = '#10B981';
        const iconEmoji = '❄️';

        const icon = L.divIcon({
            className: 'cooling-center-marker',
            html: `
                <div style="
                    width: 36px;
                    height: 36px;
                    background: ${iconColor};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                ">
                    ${iconEmoji}
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker([center.lat, center.lng], {
            icon: icon,
            title: center.name
        }).addTo(map);

        // Popup with details
        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${center.name}</h3>
                <p style="color: #6B7280; font-size: 12px; margin-bottom: 4px;">${center.address}</p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                    <p style="font-size: 12px;"><strong>ระยะทาง:</strong> ${center.distance_text}</p>
                    <p style="font-size: 12px;"><strong>เวลาเปิด:</strong> ${center.hours}</p>
                </div>
                <button
                    onclick="startNavigation(${center.lat}, ${center.lng}, '${center.name}')"
                    style="
                        width: 100%;
                        margin-top: 10px;
                        padding: 8px 12px;
                        background: #3B82F6;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 13px;
                        font-weight: 600;
                        cursor: pointer;
                    "
                    onmouseover="this.style.background='#2563EB'"
                    onmouseout="this.style.background='#3B82F6'"
                >
                    🧭 นำทางไปที่นี่
                </button>
            </div>
        `);

        coolingCenterMarkers.push(marker);
    });

    coolingCentersVisible = true;
    updateButtonState('btn-cooling-centers', true);
    console.log(`✅ Showed ${coolingCenterMarkers.length} cooling centers (filtered from ${coolingCentersData.length})`);
}

function hideCoolingCenters() {
    console.log('Hiding cooling centers...');
    coolingCenterMarkers.forEach(marker => map.removeLayer(marker));
    coolingCenterMarkers = [];
    coolingCentersVisible = false;
    updateButtonState('btn-cooling-centers', false);
}

function toggleCoolingCenters() {
    if (coolingCentersVisible) {
        hideCoolingCenters();
    } else {
        showCoolingCenters();
    }
}

// ============================================
// Phase 3: Hazard Points API
// ============================================
async function fetchHazardPoints(lat, lng) {
    console.log('Fetching hazard points for:', lat, lng);

    try {
        const url = `http://localhost:5000/api/hazard-points?lat=${lat}&lng=${lng}&radius=5000`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Hazard points received:', result.data.total);
            hazardPointsData = result.data.hazard_points;

            // Check for nearby hazards (Phase 5)
            checkNearbyHazards();
        }

    } catch (error) {
        console.error('Error fetching hazard points:', error);
        console.warn('⚠️ Cannot load hazard points data');
    }
}

function showHazardPoints() {
    console.log('Showing hazard points...');

    // Remove existing markers
    hazardPointMarkers.forEach(marker => map.removeLayer(marker));
    hazardPointMarkers = [];

    // Add markers for each hazard point
    hazardPointsData.forEach(point => {
        // Icon based on risk level
        let iconColor, iconEmoji;

        if (point.risk_level === 'high') {
            iconColor = '#EF4444';
            iconEmoji = '⚠️';
        } else if (point.risk_level === 'medium') {
            iconColor = '#F59E0B';
            iconEmoji = '⚠️';
        } else {
            iconColor = '#FCD34D';
            iconEmoji = '⚠️';
        }

        const icon = L.divIcon({
            className: 'hazard-point-marker',
            html: `
                <div style="
                    width: 36px;
                    height: 36px;
                    background: ${iconColor};
                    border: 3px solid white;
                    border-radius: 50%;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                ">
                    ${iconEmoji}
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        const marker = L.marker([point.lat, point.lng], {
            icon: icon,
            title: point.name
        }).addTo(map);

        // Popup with details
        let riskText, riskColor;
        if (point.risk_level === 'high') {
            riskText = 'อันตรายสูง';
            riskColor = 'color: #DC2626; font-weight: bold;';
        } else if (point.risk_level === 'medium') {
            riskText = 'ระวัง';
            riskColor = 'color: #D97706; font-weight: bold;';
        } else {
            riskText = 'ต่ำ';
            riskColor = 'color: #65A30D; font-weight: bold;';
        }

        marker.bindPopup(`
            <div style="min-width: 200px;">
                <h3 style="font-weight: bold; font-size: 14px; margin-bottom: 8px;">${point.name}</h3>
                <p style="color: #6B7280; font-size: 12px; margin-bottom: 4px;">${point.address}</p>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid #E5E7EB;">
                    <p style="font-size: 12px;"><strong>ระดับความเสี่ยง:</strong> <span style="${riskColor}">${riskText}</span></p>
                    <p style="font-size: 12px;"><strong>ระยะทาง:</strong> ${point.distance_text}</p>
                    <p style="font-size: 11px; color: #DC2626; margin-top: 6px;"><strong>⚠️ ${point.warning}</strong></p>
                    <p style="font-size: 11px; color: #6B7280; margin-top: 4px;">${point.description}</p>
                </div>
            </div>
        `);

        hazardPointMarkers.push(marker);
    });

    hazardPointsVisible = true;
    updateButtonState('btn-hazard-zones', true);
    console.log(`✅ Showed ${hazardPointMarkers.length} hazard points`);
}

function hideHazardPoints() {
    console.log('Hiding hazard points...');
    hazardPointMarkers.forEach(marker => map.removeLayer(marker));
    hazardPointMarkers = [];
    hazardPointsVisible = false;
    updateButtonState('btn-hazard-zones', false);
}

function toggleHazardPoints() {
    if (hazardPointsVisible) {
        hideHazardPoints();
    } else {
        showHazardPoints();
    }
}

// ============================================
// UI Helper Functions
// ============================================
function updateButtonState(buttonId, isActive) {
    const button = document.getElementById(buttonId);
    if (isActive) {
        button.classList.remove('bg-gray-100', 'text-gray-700');
        button.classList.add('bg-blue-500', 'text-white');
    } else {
        button.classList.add('bg-gray-100', 'text-gray-700');
        button.classList.remove('bg-blue-500', 'text-white');
    }
}

// ============================================
// Phase 4: Risk Profile Management
// ============================================
function getCurrentRiskProfile() {
    return currentRiskProfile;
}

function setRiskProfile(profile) {
    currentRiskProfile = profile;
    console.log('Risk profile changed to:', profile);

    // Show toast (Phase 6)
    const profileNames = {
        'general': 'ทั่วไป',
        'elderly': 'ผู้สูงอายุ',
        'outdoor_worker': 'คนทำงานกลางแจ้ง'
    };
    showToast(`เปลี่ยนเป็นกลุ่ม: ${profileNames[profile]}`, 'info');

    // Refetch weather with new profile
    if (userLocation.lat && userLocation.lng) {
        fetchWeatherData(userLocation.lat, userLocation.lng);
        // Refetch forecast with new profile (Phase 5)
        fetchForecast(userLocation.lat, userLocation.lng);
    }
}

// ============================================
// Phase 4: Recommendations Panel
// ============================================
function updateRecommendations() {
    console.log('Updating recommendations...');

    if (coolingCentersData.length === 0) {
        return;
    }

    // Filter by current filters
    let filtered = coolingCentersData.filter(center => {
        // Distance filter
        if (center.distance > currentDistanceFilter) return false;

        return true;
    });

    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);

    // Take top 3
    const top3 = filtered.slice(0, 3);

    // Update UI
    const panel = document.getElementById('recommendations-panel');
    const list = document.getElementById('recommendations-list');

    if (top3.length === 0) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    list.innerHTML = '';

    top3.forEach((center, index) => {
        const walkTime = Math.ceil(center.distance / 80); // 80 m/min walking speed

        const item = document.createElement('div');
        item.className = 'p-2 bg-gray-50 rounded border border-gray-200 hover:bg-blue-50 cursor-pointer transition';
        item.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-1">
                        <span class="text-sm font-semibold text-gray-800">${index + 1}. ${center.name}</span>
                    </div>
                    <p class="text-xs text-gray-600 mt-1">
                        📍 ${center.distance_text} (~${walkTime} นาที)
                    </p>
                    <p class="text-xs text-gray-500">⏰ ${center.hours}</p>
                </div>
                <button
                    class="ml-2 px-2 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 flex-shrink-0"
                    onclick="event.stopPropagation(); startNavigation(${center.lat}, ${center.lng}, '${center.name}');"
                    title="นำทาง"
                >
                    🧭
                </button>
            </div>
        `;

        // Click to center on map
        item.addEventListener('click', () => {
            centerMap(center.lat, center.lng, 16);
            // Find and open popup
            coolingCenterMarkers.forEach(marker => {
                if (marker.getLatLng().lat === center.lat && marker.getLatLng().lng === center.lng) {
                    marker.openPopup();
                }
            });
        });

        list.appendChild(item);
    });

    console.log(`✅ Updated recommendations: ${top3.length} centers`);
}

// ============================================
// Phase 4: Filter Management
// ============================================
function applyFilters() {
    console.log('Applying filters:', {
        distance: currentDistanceFilter
    });

    // Re-filter and show cooling centers
    if (coolingCentersVisible) {
        showCoolingCenters();
    }

    // Update recommendations
    updateRecommendations();
}

function setDistanceFilter(distance) {
    currentDistanceFilter = distance;
    applyFilters();
}

// ============================================
// Phase 5: 6-Hour Forecast
// ============================================
async function fetchForecast(lat, lng) {
    console.log('Fetching 6-hour forecast for:', lat, lng, 'profile:', currentRiskProfile);

    try {
        const url = `http://localhost:5000/api/forecast?lat=${lat}&lng=${lng}&hours=6&profile=${currentRiskProfile}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Forecast data received:', result.data.forecast.length, 'items');
            forecastData = result.data.forecast;

            // Show forecast panel
            showForecastPanel();
            fadeInPanel('forecast-panel');
        }

    } catch (error) {
        console.error('Error fetching forecast:', error);
        showToast('ไม่สามารถโหลดพยากรณ์อากาศได้', 'warning');
    }
}

function showForecastPanel() {
    const panel = document.getElementById('forecast-panel');
    const timeline = document.getElementById('forecast-timeline');

    if (forecastData.length === 0) {
        panel.classList.add('hidden');
        return;
    }

    panel.classList.remove('hidden');
    timeline.innerHTML = '';

    // Display each forecast item
    forecastData.forEach((item, index) => {
        const time = new Date(item.timestamp * 1000);
        const timeStr = time.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        // Risk color
        let riskBgColor, riskTextColor, riskIcon;
        if (item.risk_level === 'LOW') {
            riskBgColor = 'bg-green-100';
            riskTextColor = 'text-green-700';
            riskIcon = '🟢';
        } else if (item.risk_level === 'MEDIUM') {
            riskBgColor = 'bg-yellow-100';
            riskTextColor = 'text-yellow-700';
            riskIcon = '🟡';
        } else {
            riskBgColor = 'bg-red-100';
            riskTextColor = 'text-red-700';
            riskIcon = '🔴';
        }

        // Create forecast item
        const itemDiv = document.createElement('div');
        itemDiv.className = `flex items-center justify-between p-2 ${riskBgColor} rounded`;
        itemDiv.innerHTML = `
            <div class="flex-1">
                <p class="text-xs font-semibold ${riskTextColor}">${timeStr}</p>
                <p class="text-xs text-gray-600">${item.temperature}°C · ${item.humidity}%</p>
            </div>
            <div class="text-right">
                <p class="text-xs font-semibold ${riskTextColor}">${riskIcon} ${item.risk_level}</p>
                <p class="text-xs text-gray-600">${item.heat_index}°C</p>
            </div>
        `;

        timeline.appendChild(itemDiv);
    });

    console.log(`✅ Forecast panel updated with ${forecastData.length} items`);
}

function refreshForecast() {
    if (userLocation.lat && userLocation.lng) {
        fetchForecast(userLocation.lat, userLocation.lng);
    }
}

// ============================================
// Phase 5: Hazard Zone Notifications
// ============================================
function checkNearbyHazards() {
    if (!userLocation.lat || !userLocation.lng || hazardPointsData.length === 0) {
        return;
    }

    console.log('Checking nearby hazards...');

    hazardPointsData.forEach(hazard => {
        const distance = hazard.distance; // Already calculated

        // Check if within threshold and high risk
        if (distance <= notificationThreshold && hazard.risk_level === 'high') {
            // Check if not already notified
            if (!notifiedHazards.has(hazard.id)) {
                showHazardNotification(hazard);
                notifiedHazards.add(hazard.id);
            }
        } else if (distance > notificationThreshold * 2) {
            // Reset notification if moved far away
            notifiedHazards.delete(hazard.id);
        }
    });
}

function showHazardNotification(hazard) {
    console.log('⚠️ Hazard nearby:', hazard.name);

    // Show browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('⚠️ พื้นที่เสี่ยงใกล้คุณ!', {
            body: `${hazard.name} - ${hazard.warning}`,
            icon: '⚠️',
            tag: `hazard-${hazard.id}`
        });
    }

    // Show in-app alert
    const alertDiv = document.createElement('div');
    alertDiv.className = 'fixed top-20 right-20 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50 max-w-xs animate-bounce';
    alertDiv.innerHTML = `
        <div class="flex items-start">
            <span class="text-2xl mr-3">⚠️</span>
            <div class="flex-1">
                <h4 class="font-bold text-sm mb-1">พื้นที่เสี่ยงใกล้คุณ!</h4>
                <p class="text-xs mb-1">${hazard.name}</p>
                <p class="text-xs">${hazard.distance_text} จากคุณ</p>
                <p class="text-xs mt-2 font-semibold">${hazard.warning}</p>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                ✕
            </button>
        </div>
    `;

    document.body.appendChild(alertDiv);

    // Auto-remove after 10 seconds
    setTimeout(() => {
        if (alertDiv.parentElement) {
            alertDiv.remove();
        }
    }, 10000);
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            console.log('Notification permission:', permission);
        });
    }
}

// ============================================
// Phase 6: UI Enhancements
// ============================================

// Toast Notification
function showToast(message, type = 'info', duration = 3000) {
    // Remove existing toast
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Color based on type
    let bgColor, textColor, icon;
    if (type === 'success') {
        bgColor = 'bg-green-500';
        textColor = 'text-white';
        icon = '✅';
    } else if (type === 'error') {
        bgColor = 'bg-red-500';
        textColor = 'text-white';
        icon = '❌';
    } else if (type === 'warning') {
        bgColor = 'bg-yellow-500';
        textColor = 'text-white';
        icon = '⚠️';
    } else {
        bgColor = 'bg-blue-500';
        textColor = 'text-white';
        icon = 'ℹ️';
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast ${bgColor} ${textColor} px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2`;
    toast.innerHTML = `
        <span class="text-xl">${icon}</span>
        <span class="text-sm font-medium">${message}</span>
    `;

    document.body.appendChild(toast);

    // Auto remove
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
        toast.style.animation = 'slideOutRight 0.3s ease-in';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Show loading in panel
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.add('pulse');
}

function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.remove('pulse');
}

// Add fade-in animation to panels
function fadeInPanel(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    element.classList.add('fade-in');
}

// ============================================
// Phase 7: Navigation Functions
// ============================================
function startNavigation(destLat, destLng, destName) {
    if (!userLocation.lat || !userLocation.lng) {
        showToast('ไม่พบตำแหน่งของคุณ', 'error');
        return;
    }

    console.log('Starting navigation to:', destName);

    // Remove existing route if any
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    // Create routing control
    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(userLocation.lat, userLocation.lng),
            L.latLng(destLat, destLng)
        ],
        routeWhileDragging: false,
        addWaypoints: false,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        lineOptions: {
            styles: [
                {color: '#3B82F6', opacity: 0.8, weight: 6}
            ]
        },
        createMarker: function() { return null; }, // Hide default markers
        router: L.Routing.osrmv1({
            serviceUrl: 'https://router.project-osrm.org/route/v1'
        })
    }).addTo(map);

    // Listen for route found event
    routingControl.on('routesfound', function(e) {
        const route = e.routes[0];
        const distance = (route.summary.totalDistance / 1000).toFixed(2); // km
        const duration = Math.ceil(route.summary.totalTime / 60); // minutes

        showToast(`เส้นทางถึง ${destName}: ${distance} km (~${duration} นาที)`, 'success', 5000);
        console.log(`Route found: ${distance} km, ${duration} minutes`);
    });

    // Listen for routing errors
    routingControl.on('routingerror', function(e) {
        console.error('Routing error:', e);
        showToast('ไม่สามารถหาเส้นทางได้', 'error');
    });

    isNavigating = true;
    updateNavigationButton(true);
}

function stopNavigation() {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
        console.log('Navigation stopped');
        showToast('หยุดการนำทางแล้ว', 'info');
    }

    isNavigating = false;
    updateNavigationButton(false);
}

function updateNavigationButton(navigating) {
    const btnNav = document.getElementById('btn-navigation');
    if (!btnNav) return;

    if (navigating) {
        btnNav.classList.remove('bg-gray-100', 'text-gray-700');
        btnNav.classList.add('bg-red-500', 'text-white');
    } else {
        btnNav.classList.add('bg-gray-100', 'text-gray-700');
        btnNav.classList.remove('bg-red-500', 'text-white');
    }
}

// ============================================
// UI Updates
// ============================================
function updateGPSStatus(message, status) {
    const statusBadge = document.getElementById('gps-status-badge');

    // Remove all status classes
    statusBadge.classList.remove('bg-yellow-100', 'text-yellow-800', 'bg-green-100', 'text-green-800', 'bg-red-100', 'text-red-800');

    // Add appropriate class based on status
    if (status === 'loading') {
        statusBadge.classList.add('bg-yellow-100', 'text-yellow-800');
    } else if (status === 'success') {
        statusBadge.classList.add('bg-green-100', 'text-green-800');
    } else if (status === 'error') {
        statusBadge.classList.add('bg-red-100', 'text-red-800');
    }

    statusBadge.textContent = message;
}

function updateLocationText(lat, lng, isDefault = false) {
    const locationText = document.getElementById('location-text');

    if (isDefault) {
        locationText.textContent = `📍 สยาม, กรุงเทพฯ (ตำแหน่งเริ่มต้น)`;
    } else {
        locationText.textContent = `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`;
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000);
}

// ============================================
// Event Listeners
// ============================================
function setupEventListeners() {
    // Recenter button
    document.getElementById('btn-recenter').addEventListener('click', () => {
        if (userLocation.lat && userLocation.lng) {
            centerMap(userLocation.lat, userLocation.lng, 15);
        } else {
            alert('ไม่พบตำแหน่งของคุณ');
        }
    });

    // Cooling Centers button
    document.getElementById('btn-cooling-centers').addEventListener('click', () => {
        toggleCoolingCenters();
    });

    // Hazard Zones button
    document.getElementById('btn-hazard-zones').addEventListener('click', () => {
        toggleHazardPoints();
    });

    // Info button - Open Info Modal
    document.getElementById('btn-info').addEventListener('click', () => {
        document.getElementById('modal-info').classList.remove('hidden');
    });

    // Close Info Modal
    document.getElementById('close-info').addEventListener('click', () => {
        document.getElementById('modal-info').classList.add('hidden');
    });

    // Close modal on background click
    document.getElementById('modal-info').addEventListener('click', (e) => {
        if (e.target.id === 'modal-info') {
            document.getElementById('modal-info').classList.add('hidden');
        }
    });

    // Phase 4: Risk Profile Radio Buttons
    document.querySelectorAll('input[name="risk-profile"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            setRiskProfile(e.target.value);
        });
    });

    // Phase 5: Refresh Forecast Button
    document.getElementById('btn-refresh-forecast').addEventListener('click', () => {
        refreshForecast();
    });

    // Phase 6: Modal Buttons
    document.getElementById('btn-filter').addEventListener('click', () => {
        document.getElementById('modal-filter').classList.remove('hidden');
    });

    document.getElementById('close-filter').addEventListener('click', () => {
        document.getElementById('modal-filter').classList.add('hidden');
    });

    // Close modal on background click
    document.getElementById('modal-filter').addEventListener('click', (e) => {
        if (e.target.id === 'modal-filter') {
            document.getElementById('modal-filter').classList.add('hidden');
        }
    });

    // Phase 6: Modal Risk Profile Change (now in Filter Modal)
    document.querySelectorAll('input[name="risk-profile-modal"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            setRiskProfile(e.target.value);
            // Also update the main radio buttons (if any exist)
            const mainRadio = document.querySelector(`input[name="risk-profile"][value="${e.target.value}"]`);
            if (mainRadio) mainRadio.checked = true;
        });
    });

    // Phase 6: Modal Filter Buttons
    document.getElementById('modal-filter-distance').addEventListener('change', (e) => {
        setDistanceFilter(parseInt(e.target.value));
    });

    // Phase 6: Mobile Toggle Info Button
    const btnToggleInfo = document.getElementById('btn-toggle-info');
    const infoPanel = document.querySelector('.info-panel');
    let infoPanelVisible = false;

    if (btnToggleInfo) {
        btnToggleInfo.addEventListener('click', () => {
            infoPanelVisible = !infoPanelVisible;

            if (infoPanelVisible) {
                infoPanel.style.display = 'block';
                document.getElementById('risk-badge').classList.add('show-mobile');
                document.getElementById('forecast-panel').classList.add('show-mobile');
            } else {
                infoPanel.style.display = 'none';
                document.getElementById('risk-badge').classList.remove('show-mobile');
                document.getElementById('forecast-panel').classList.remove('show-mobile');
            }
        });
    }

    // Phase 7: Navigation Button
    document.getElementById('btn-navigation').addEventListener('click', () => {
        if (isNavigating) {
            stopNavigation();
        } else {
            showToast('เลือกจุดหมายบนแผนที่เพื่อเริ่มนำทาง', 'info');
        }
    });
}

// ============================================
// Initialize App
// ============================================
function initApp() {
    console.log('=== CoolZone Starting ===');
    console.log('Phase 1: Map First (Leaflet + GPS)');
    console.log('Phase 2: Weather API Integration');
    console.log('Phase 3: Cooling Centers & Hazard Points');
    console.log('Phase 4: Risk Profiles & Filters');
    console.log('Phase 5: 6-Hour Forecast');

    // Step 1: Initialize map
    initMap();

    // Step 2: Request user location
    getUserLocation();

    // Step 3: Setup event listeners
    setupEventListeners();

    console.log('=== App Initialized ===');
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
