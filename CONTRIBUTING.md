# Contributing to CoolZone

Thank you for your interest in contributing to CoolZone! 🎉

This document provides guidelines for contributing to the project.

## 🤝 How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Python version)

### Suggesting Features

We welcome feature suggestions! Please:
- Check existing issues first
- Describe the feature clearly
- Explain why it would be useful
- Provide examples if possible

### Code Contributions

1. **Fork the Repository**
   ```bash
   git clone https://github.com/your-username/coolzone.git
   cd coolzone
   cd coolzone
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

3. **Make Your Changes**
   - Follow existing code style
   - Add comments where necessary
   - Test your changes thoroughly

4. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: brief description of changes"
   ```

   **Commit Message Format:**
   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for changes to existing features
   - `Refactor:` for code improvements
   - `Docs:` for documentation changes

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   Then open a Pull Request on GitHub.

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use meaningful variable names
- Add docstrings to functions
- Keep functions small and focused

### JavaScript (Frontend)
- Use `const` and `let` (not `var`)
- Use meaningful variable names
- Add comments for complex logic
- Keep functions small and focused

### HTML/CSS
- Use semantic HTML5 tags
- Follow BEM naming convention
- Use Tailwind CSS classes

## 🧪 Testing

Before submitting a PR:

1. **Test Backend API**
   ```bash
   cd backend
   python app.py
   # Test endpoints manually or with curl
   ```

2. **Test Frontend**
   ```bash
   cd frontend
   python -m http.server 8000
   # Test in browser
   ```

3. **Check for Errors**
   - No console errors
   - All features work
   - Responsive on mobile
   - GPS works correctly

## 📋 Pull Request Checklist

- [ ] Code follows project style
- [ ] Changes are tested
- [ ] No console errors
- [ ] Documentation is updated (if needed)
- [ ] Commit messages are clear
- [ ] PR description explains changes

## 🌍 Localization

To add support for a new language:

1. Add translations to `frontend/src/app.js`
2. Update UI text
3. Test all features in new language

## 📊 Adding Data

### Adding Cooling Centers

Edit `data/processed/cooling_centers.json`:
```json
{
  "id": 999,
  "name": "สถานที่ใหม่",
  "type": "free",
  "lat": 13.7563,
  "lng": 100.5018,
  ...
}
```

### Adding Hazard Points

Edit `data/processed/hazard_points.json`:
```json
{
  "id": 999,
  "name": "พื้นที่เสี่ยงใหม่",
  "risk_level": "high",
  "lat": 13.7563,
  "lng": 100.5018,
  ...
}
```

## ❓ Questions?

- Open an issue for discussion
- Check existing issues and PRs
- Read the README.md

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to CoolZone! 🌡️❤️
