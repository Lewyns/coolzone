# Changelog

All notable changes to the CoolZone project will be documented in this file.

## [1.0.0] - 2026-06-21

### 🎉 Initial Open Source Release

#### Added
- ✅ **MIT License** - Open source under permissive license
- ✅ **Interactive Map** - OpenStreetMap with real-time GPS tracking
- ✅ **Weather Integration** - OpenWeatherMap API for real-time data
- ✅ **Heat Index Calculator** - NOAA formula for accurate heat risk
- ✅ **Risk Profiles** - Support for General, Elderly, and Outdoor Workers
- ✅ **Cooling Centers** - 12 sample locations with filtering
- ✅ **Hazard Points** - 12 sample high-risk zones
- ✅ **6-Hour Forecast** - Weather prediction with heat index
- ✅ **Proximity Alerts** - Notifications when near hazard zones
- ✅ **Distance Calculator** - Find nearest cooling centers
- ✅ **Layer Toggle** - Show/hide different map layers
- ✅ **Mobile Responsive** - Works on all devices
- ✅ **Customizable Data** - JSON files with clear instructions
- ✅ **Documentation** - Comprehensive README and guides
- ✅ **Contributing Guide** - Clear contribution guidelines

#### Project Structure
- `backend/` - Flask API server
- `frontend/` - HTML/CSS/JS client
- `data/` - Sample data with customization guide
- `LICENSE` - MIT License
- `README.md` - Project documentation
- `CONTRIBUTING.md` - Contribution guidelines
- `HOW_TO_RUN.md` - Quick start guide
- `USER_GUIDE.md` - User manual
- `HEAT_MAP_GUIDE.md` - Heat map feature guide

#### Removed (for Open Source)
- ❌ Vercel deployment files
- ❌ Private documentation
- ❌ Test/debug HTML files
- ❌ Cached Python files
- ❌ Environment-specific configs

#### Technical Details
- **Backend:** Python 3.8+, Flask, Flask-CORS
- **Frontend:** Vanilla JavaScript, Tailwind CSS, Leaflet.js
- **APIs:** OpenWeatherMap, OpenStreetMap
- **License:** MIT

---

## Future Roadmap

### Planned Features
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] User accounts and saved locations
- [ ] Historical heat data analysis
- [ ] Air quality integration
- [ ] Multi-language support
- [ ] PWA (Progressive Web App)
- [ ] Docker deployment
- [ ] Admin dashboard for data management
- [ ] API rate limiting and caching
- [ ] Unit and integration tests

### Community Requests
- See [GitHub Issues](https://github.com/your-username/coolzone/issues) for feature requests

---

## Version Format

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality (backwards compatible)
- **PATCH** version for bug fixes (backwards compatible)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to suggest changes.

---

**Made with ❤️ for Hackatech 2026**
