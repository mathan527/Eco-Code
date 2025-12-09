# Contributing to EcoCode 🌿

First off, thank you for considering contributing to EcoCode! It's people like you that make EcoCode such a great tool for sustainable software development.

## 🌟 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

* **Use a clear and descriptive title**
* **Describe the exact steps to reproduce the problem**
* **Provide specific examples**
* **Describe the behavior you observed and what you expected**
* **Include screenshots if possible**
* **Include your environment details** (OS, Python version, browser, etc.)

### Suggesting Enhancements ✨

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

* **Use a clear and descriptive title**
* **Provide a step-by-step description of the suggested enhancement**
* **Provide specific examples to demonstrate the steps**
* **Describe the current behavior and explain the expected behavior**
* **Explain why this enhancement would be useful**

### Pull Requests 🚀

* Fill in the required template
* Do not include issue numbers in the PR title
* Follow the Python and JavaScript style guides
* Include thoughtful comments in your code
* Write clear commit messages
* Update documentation as needed
* Add tests if applicable

## 💻 Development Setup

### Prerequisites
- Python 3.9+
- Node.js 16+
- Git

### Setting Up Your Development Environment

1. **Fork the repository**
   ```bash
   # Click the 'Fork' button at the top right of the page
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/EcoCode.git
   cd EcoCode
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/ORIGINAL-OWNER/EcoCode.git
   ```

4. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

5. **Set up backend**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your API keys
   ```

6. **Set up frontend**
   ```bash
   cd ../frontend
   # Edit js/config.js with your settings
   ```

7. **Make your changes**
   - Write your code
   - Test thoroughly
   - Follow coding standards

8. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   ```

9. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Create a Pull Request**
    - Go to your fork on GitHub
    - Click "Pull Request"
    - Fill in the template

## 📝 Coding Standards

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints where possible
- Write docstrings for functions and classes
- Keep functions small and focused
- Use meaningful variable names

```python
def calculate_carbon_footprint(code: str, language: str) -> dict:
    """
    Calculate the carbon footprint of code.
    
    Args:
        code: The source code to analyze
        language: Programming language (python, javascript, etc.)
        
    Returns:
        Dictionary containing metrics and scores
    """
    # Implementation
```

### JavaScript (Frontend)
- Use ES6+ features
- Use `const` and `let`, never `var`
- Write clear comments
- Use meaningful function and variable names
- Keep functions pure when possible

```javascript
/**
 * Analyze code and calculate carbon footprint
 * @param {string} code - Source code to analyze
 * @param {string} language - Programming language
 * @returns {Promise<Object>} Analysis results
 */
async function analyzeCode(code, language) {
    // Implementation
}
```

### Git Commit Messages

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add hosting carbon calculator
fix: resolve Monaco editor keyboard error
docs: update API documentation
```

## 🧪 Testing

Before submitting a PR, make sure:

1. **Backend tests pass**
   ```bash
   cd backend
   pytest
   ```

2. **Manual testing**
   - Test all modified features
   - Test on different browsers (Chrome, Firefox, Safari)
   - Test responsive design on mobile

3. **API endpoint testing**
   ```bash
   # Test health endpoint
   curl http://localhost:8000/health
   
   # Test code analysis
   curl -X POST http://localhost:8000/analyze-code \
     -H "Content-Type: application/json" \
     -d '{"code": "print('hello')", "language": "python"}'
   ```

## 📚 Documentation

- Update README.md if you change functionality
- Update API documentation for endpoint changes
- Add inline comments for complex logic
- Update DEPLOYMENT.md for infrastructure changes

## 🎯 Areas We Need Help With

- 🌍 **New Language Support**: Add support for more programming languages
- 🔌 **Integrations**: VS Code extension, GitHub Actions, CI/CD plugins
- 📊 **Better Metrics**: Improve carbon calculation accuracy
- 🎨 **UI/UX**: Design improvements and animations
- 🧪 **Testing**: Add more test coverage
- 📖 **Documentation**: Improve guides and tutorials
- 🌐 **Translations**: Internationalization support

## 💬 Community

- Join our [Discord](https://discord.gg/ecocode) for discussions
- Follow us on [Twitter](https://twitter.com/EcoCodeApp)
- Read our [Blog](https://blog.ecocode.app)

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Our website's contributors page

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

## ❓ Questions?

Feel free to open an issue with the `question` label or reach out on Discord!

---

**Thank you for contributing to a more sustainable future! 🌱**
