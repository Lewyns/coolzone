// CoolZone - Markers Module
// Handle Cooling Centers and Hazard Points markers

// ============================================
// Global Variables
// ============================================
let coolingCenterMarkers = [];
let hazardPointMarkers = [];
let markersVisible = {
    coolingCenters: false,
    hazardPoints: false
};

// ============================================
// Custom Icons
// ============================================
const icons = {
    coolingCenter: L.divIcon({
        className: 'custom-cooling-marker',
        html: `
            <div style="
                width: 32px;
                height: 32px;
                background: #10b981;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 18px;
            ">❄️</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    }),

    hazardHigh: L.divIcon({
        className: 'custom-hazard-marker',
        html: `
            <div style="
                width: 32px;
                height: 32px;
                background: #ef4444;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 18px;
            ">⚠️</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    }),

    hazardMedium: L.divIcon({
        className: 'custom-hazard-marker',
        html: `
            <div style="
                width: 32px;
                height: 32px;
                background: #eab308;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 18px;
            ">⚠️</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    }),

    hazardLow: L.divIcon({
        className: 'custom-hazard-marker',
        html: `
            <div style="
                width: 32px;
                height: 32px;
                background: #10b981;
                border: 3px solid white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                font-size: 18px;
            ">✓</div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -16]
    })
};

// ============================================
// Fetch and Display Cooling Centers
// ============================================
async function loadCoolingCenters(lat, lng) {
    console.log('Loading cooling centers...');

    try {
        const response = await fetch(`http://localhost:5000/api/cooling-centers?lat=${lat}&lng=${lng}&radius=5000`);
        const result = await response.json();

        if (result.status === 'success') {
            displayCoolingCenters(result.data.centers);
            console.log(`Loaded ${result.data.total} cooling centers`);
        } else {
            console.error('Failed to load cooling centers:', result.message);
        }
    } catch (error) {
        console.error('Error loading cooling centers:', error);
    }
}

function displayCoolingCenters(centers) {
    // Clear existing markers
    clearCoolingCenters();

    centers.forEach(center => {
        const marker = L.marker([center.lat, center.lng], {
            icon: icons.coolingCenter,
            title: center.name
        });

        // Create popup content with navigation button
        const popupContent = `
            <div style="font-family: Arial, sans-serif; max-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: #10b981; font-size: 16px;">
                    ❄️ ${center.name}
                </h3>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>ระยะทาง:</strong> ${center.distance_text}
                </p>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>เวลาเปิด:</strong> ${center.hours}
                </p>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>สิ่งอำนวยความสะดวก:</strong><br>
                    ${center.amenities.map(a => {
                        const icons = {
                            'restroom': '🚻 ห้องน้ำ',
                            'water': '💧 น้ำดื่ม',
                            'seating': '🪑 ที่นั่ง',
                            'food': '🍽️ อาหาร',
                            'wifi': '📶 WiFi'
                        };
                        return icons[a] || a;
                    }).join(', ')}
                </p>
                ${center.phone ? `<p style="margin: 5px 0; font-size: 13px; color: #666;"><strong>โทร:</strong> ${center.phone}</p>` : ''}
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
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        gap: 6px;
                    "
                    onmouseover="this.style.background='#2563EB'"
                    onmouseout="this.style.background='#3B82F6'"
                >
                    🧭 นำทางไปที่นี่
                </button>
            </div>
        `;

        marker.bindPopup(popupContent);
        coolingCenterMarkers.push(marker);
    });

    // Show markers if toggle is on
    if (markersVisible.coolingCenters) {
        coolingCenterMarkers.forEach(marker => marker.addTo(map));
    }
}

function clearCoolingCenters() {
    coolingCenterMarkers.forEach(marker => map.removeLayer(marker));
    coolingCenterMarkers = [];
}

function toggleCoolingCenters() {
    markersVisible.coolingCenters = !markersVisible.coolingCenters;

    if (markersVisible.coolingCenters) {
        // Show markers
        if (coolingCenterMarkers.length === 0 && userLocation.lat && userLocation.lng) {
            loadCoolingCenters(userLocation.lat, userLocation.lng);
        } else {
            coolingCenterMarkers.forEach(marker => marker.addTo(map));
        }
        console.log('Cooling centers shown');
    } else {
        // Hide markers
        coolingCenterMarkers.forEach(marker => map.removeLayer(marker));
        console.log('Cooling centers hidden');
    }
}

// ============================================
// Fetch and Display Hazard Points
// ============================================
async function loadHazardPoints(lat, lng) {
    console.log('Loading hazard points...');

    try {
        const response = await fetch(`http://localhost:5000/api/hazard-points?lat=${lat}&lng=${lng}&radius=5000`);
        const result = await response.json();

        if (result.status === 'success') {
            displayHazardPoints(result.data.hazard_points);
            console.log(`Loaded ${result.data.total} hazard points`);
        } else {
            console.error('Failed to load hazard points:', result.message);
        }
    } catch (error) {
        console.error('Error loading hazard points:', error);
    }
}

function displayHazardPoints(points) {
    // Clear existing markers
    clearHazardPoints();

    points.forEach(point => {
        // Choose icon based on risk level
        let icon;
        if (point.risk_level === 'high') {
            icon = icons.hazardHigh;
        } else if (point.risk_level === 'medium') {
            icon = icons.hazardMedium;
        } else {
            icon = icons.hazardLow;
        }

        const marker = L.marker([point.lat, point.lng], {
            icon: icon,
            title: point.name
        });

        // Create popup content
        const riskColors = {
            'high': '#ef4444',
            'medium': '#eab308',
            'low': '#10b981'
        };

        const riskLabels = {
            'high': '🔴 อันตรายสูง',
            'medium': '🟡 อันตรายปานกลาง',
            'low': '🟢 ความเสี่ยงต่ำ'
        };

        const popupContent = `
            <div style="font-family: Arial, sans-serif; max-width: 250px;">
                <h3 style="margin: 0 0 10px 0; color: ${riskColors[point.risk_level]}; font-size: 16px;">
                    ⚠️ ${point.name}
                </h3>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>ระดับความเสี่ยง:</strong> ${riskLabels[point.risk_level]}
                </p>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>ระยะทาง:</strong> ${point.distance_text}
                </p>
                <p style="margin: 5px 0; font-size: 13px; color: #666;">
                    <strong>คำอธิบาย:</strong> ${point.description}
                </p>
                <p style="margin: 5px 0; padding: 8px; background: #fee2e2; border-left: 3px solid #ef4444; font-size: 12px;">
                    <strong>⚠️ คำเตือน:</strong> ${point.warning}
                </p>
            </div>
        `;

        marker.bindPopup(popupContent);
        hazardPointMarkers.push(marker);
    });

    // Show markers if toggle is on
    if (markersVisible.hazardPoints) {
        hazardPointMarkers.forEach(marker => marker.addTo(map));
    }
}

function clearHazardPoints() {
    hazardPointMarkers.forEach(marker => map.removeLayer(marker));
    hazardPointMarkers = [];
}

function toggleHazardPoints() {
    markersVisible.hazardPoints = !markersVisible.hazardPoints;

    if (markersVisible.hazardPoints) {
        // Show markers
        if (hazardPointMarkers.length === 0 && userLocation.lat && userLocation.lng) {
            loadHazardPoints(userLocation.lat, userLocation.lng);
        } else {
            hazardPointMarkers.forEach(marker => marker.addTo(map));
        }
        console.log('Hazard points shown');
    } else {
        // Hide markers
        hazardPointMarkers.forEach(marker => map.removeLayer(marker));
        console.log('Hazard points hidden');
    }
}
