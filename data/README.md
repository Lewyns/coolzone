# Data Directory

This directory contains sample data for the CoolZone project.

## 📁 Structure

```
data/
├── processed/
│   ├── cooling_centers.json    # Cooling centers/shelters data
│   └── hazard_points.json      # High-risk heat zones
└── locations_extended.json     # Extended location data
```

## ⚠️ IMPORTANT - Customizable Data

**All data files in this directory are SAMPLE DATA for Bangkok, Thailand.**

You can and should modify these files to match your own city or project needs!

## 🎨 How to Customize

### 1. Cooling Centers (`cooling_centers.json`)

Replace with cooling centers in your city:
- Shopping malls
- Libraries
- Transit stations
- Parks
- Community centers
- Hospitals

**Required fields:**
```json
{
  "id": 1,
  "name": "Place Name",
  "name_en": "English Name",
  "type": "free" or "paid",
  "category": "shopping_mall",
  "lat": 13.7467,
  "lng": 100.5348,
  "address": "Full Address",
  "hours": "10:00-22:00",
  "phone": "Phone Number",
  "amenities": ["restroom", "water", "seating"],
  "capacity": "high",
  "accessibility": true
}
```

### 2. Hazard Points (`hazard_points.json`)

Replace with high-risk heat zones in your city:
- Concrete parking lots
- Highways/expressways
- Open plazas
- Crowded markets
- Areas with poor ventilation

**Required fields:**
```json
{
  "id": 1,
  "name": "Area Name",
  "name_en": "English Name",
  "risk_level": "high",
  "lat": 13.7458,
  "lng": 100.5331,
  "address": "Full Address",
  "description": "Description",
  "warning": "Warning message",
  "heat_factors": ["no_shade", "concrete"]
}
```

## 📊 Data Collection Tips

### Finding Cooling Centers
1. Government cooling center lists
2. Public libraries and community centers
3. Shopping malls with public access
4. Transit stations
5. Parks with shade

### Identifying Hazard Points
1. Large concrete/asphalt areas
2. Areas with no shade
3. Traffic-heavy zones
4. Poorly ventilated areas
5. Heat island effect zones

## 🌍 Data Sources

You can collect data from:
- **Google Maps** - Get coordinates (lat/lng)
- **OpenStreetMap** - Public place data
- **Government websites** - Official cooling centers
- **Local surveys** - Community feedback
- **Temperature sensors** - IoT data

## 📝 Data Format

### Coordinates (lat/lng)
- Use decimal degrees format
- Example: `13.7563, 100.5018`
- Get from Google Maps: Right-click → "What's here?"

### Categories
Cooling centers:
- `shopping_mall`
- `library`
- `transit`
- `park`
- `convenience_store`
- `hospital`
- `community_center`

### Risk Levels
- `high` - Red marker (dangerous)
- `medium` - Yellow marker (caution)
- `low` - Green marker (safe)

### Heat Factors
- `no_shade` - No shade coverage
- `concrete` - Concrete surfaces
- `asphalt` - Asphalt surfaces
- `heat_reflection` - Heat reflection from surfaces
- `traffic_pollution` - Air pollution from traffic
- `crowded` - Crowded areas
- `poor_ventilation` - Poor air circulation
- `open_area` - Large open spaces
- `limited_shade` - Limited shade
- `water_reflection` - Heat reflection from water

## ✅ Validation

After editing data files, validate them:

```bash
# Python validation
python -m json.tool data/processed/cooling_centers.json
python -m json.tool data/processed/hazard_points.json

# Or online
# Copy and paste to https://jsonlint.com/
```

## 🗺️ Testing

After customizing data:
1. Start the backend server
2. Open the frontend
3. Check that markers appear on the map
4. Verify coordinates are correct
5. Test filtering and distance calculations

## 📖 Example: Adapting to Another City

**For New York City:**
1. Find cooling centers (NYC has official lists)
2. Get coordinates using Google Maps
3. Replace data in `cooling_centers.json`
4. Identify heat islands (concrete areas, subways)
5. Replace data in `hazard_points.json`
6. Test the map

**For Tokyo:**
1. Use Japanese names in `name` field
2. Use English in `name_en` field
3. Update coordinates to Tokyo area
4. Add convenience stores (konbini) as cooling centers
5. Mark crowded stations as hazard points

## 🤝 Contributing Data

If you have data for a new city:
1. Create a new branch
2. Add your data
3. Test thoroughly
4. Submit a pull request
5. Include city name in PR title

## 📞 Need Help?

- Check the main [README.md](../README.md)
- Open an issue on GitHub
- See [CONTRIBUTING.md](../CONTRIBUTING.md)

---

**Remember:** This data is for demonstration purposes. For production use, collect accurate, up-to-date data for your specific location!
