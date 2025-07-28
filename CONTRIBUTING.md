# Contributing to Universal Controller

Thank you for your interest in contributing to Universal Controller! 🎉

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Python 3.9+
- Home Assistant development environment
- Git

### Development Setup

1. **Fork and clone the repository**
```bash
git clone https://github.com/Nogg-aholic/universal-controller.git
cd universal-controller
```

2. **Set up the frontend development environment**
```bash
cd www/universal-controller
npm install
npm run dev
```

3. **Install the integration in your HA development environment**
```bash
# Copy to your Home Assistant config
cp -r custom_components/universal_controller /path/to/ha/custom_components/
```

## 🏗️ Project Structure

```
├── custom_components/universal_controller/  # Python integration
│   ├── __init__.py                         # Main integration setup
│   ├── config_flow.py                      # Configuration UI
│   ├── sensor.py                           # Sensor entity
│   ├── const.py                            # Constants
│   ├── manifest.json                       # Integration metadata
│   └── services.yaml                       # Service definitions
├── www/universal-controller/               # TypeScript frontend
│   ├── src/                               # Source files
│   ├── dist/                              # Built files
│   ├── package.json                       # Node.js dependencies
│   ├── rollup.config.js                   # Build configuration
│   └── tsconfig.json                      # TypeScript configuration
└── .github/                               # GitHub workflows and templates
```

## 🎯 Areas for Contribution

### 🐛 Bug Fixes
- Check the [Issues](https://github.com/Nogg-aholic/universal-controller/issues) for bugs
- Add tests for your fixes
- Update documentation if needed

### ✨ New Features
- **Code Execution Engine**: Improve JavaScript/TypeScript execution
- **Template System**: Enhance HTML template capabilities  
- **Security**: Implement sandboxed code execution
- **UI/UX**: Improve the card interface
- **Performance**: Optimize code execution and rendering

### 📚 Documentation
- Improve README with more examples
- Add code comments
- Create video tutorials
- Translate documentation

### 🧪 Testing
- Add unit tests for Python components
- Add frontend tests
- Integration testing
- Performance testing

## 📝 Development Guidelines

### Python Code Style
- Follow [PEP 8](https://pep8.org/)
- Use type hints
- Add docstrings for all functions
- Use async/await patterns for Home Assistant compatibility

```python
async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up Universal Controller from a config entry."""
    # Implementation here
```

### TypeScript Code Style
- Follow [TypeScript ESLint](https://typescript-eslint.io/) rules
- Use proper types, avoid `any`
- Comment complex logic
- Follow Lit component patterns

```typescript
@customElement('universal-controller-card')
export class UniversalControllerCard extends LitElement {
    @property({ attribute: false }) public hass!: HomeAssistant;
    
    // Implementation here
}
```

### Commit Messages
Use conventional commits:
```
feat: add new template variable support
fix: resolve code execution timeout issue
docs: update installation instructions
style: improve card CSS styling
test: add unit tests for config flow
```

## 🔧 Testing

### Backend Testing
```bash
# Run Python tests
python -m pytest tests/

# Type checking
mypy custom_components/universal_controller/
```

### Frontend Testing  
```bash
cd www/universal-controller
npm test
npm run lint
npm run build
```

## 📋 Pull Request Process

1. **Create a feature branch**
```bash
git checkout -b feature/amazing-new-feature
```

2. **Make your changes**
- Write code
- Add tests
- Update documentation

3. **Test your changes**
- Test locally with Home Assistant
- Run automated tests
- Check for linting errors

4. **Submit pull request**
- Use a clear title and description
- Reference related issues
- Include screenshots if UI changes
- Add testing instructions

### PR Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Tests added for new functionality
- [ ] Documentation updated
- [ ] No breaking changes (or clearly documented)
- [ ] Tested with Home Assistant

## 🎨 Design Principles

### Security First
- User code should run in a controlled environment
- Validate all inputs
- Handle errors gracefully
- Follow Home Assistant security guidelines

### Performance
- Minimize impact on Home Assistant
- Efficient code execution
- Responsive UI
- Optimize bundle size

### User Experience
- Intuitive interface
- Clear error messages
- Helpful documentation
- Accessibility support

## 📞 Getting Help

- **Issues**: [GitHub Issues](https://github.com/Nogg-aholic/universal-controller/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Nogg-aholic/universal-controller/discussions)
- **Discord**: Join our community server
- **Documentation**: See README.md

## 🎉 Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Given credit in documentation

Thank you for helping make Universal Controller better! 🚀
