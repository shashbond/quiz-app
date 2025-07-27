# Contributing to Quiz App

Thank you for your interest in contributing to the Quiz App! This document provides guidelines and instructions for contributing.

## Table of Contents
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Making Changes](#making-changes)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Issue Reporting](#issue-reporting)

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally
3. Create a new branch for your feature/fix
4. Make your changes
5. Test your changes
6. Submit a pull request

## Development Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Git

### Setup Steps
```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/quiz-app.git
cd quiz-app

# Install dependencies
npm run install-all

# Copy environment file
cp backend/.env.example backend/.env

# Edit backend/.env with your MongoDB URI and JWT secret
# Start development servers
npm run dev
```

## Making Changes

### Branch Naming
- Feature: `feature/feature-name`
- Bug fix: `fix/bug-description`
- Documentation: `docs/update-description`

### Commit Messages
Follow conventional commit format:
- `feat: add new feature`
- `fix: resolve bug in component`
- `docs: update README`
- `style: format code`
- `refactor: restructure component`
- `test: add unit tests`

## Pull Request Process

1. **Update Documentation**: Ensure README and other docs are updated
2. **Test Your Changes**: Verify all features work as expected
3. **Clean Commit History**: Squash commits if necessary
4. **Describe Changes**: Provide clear PR description
5. **Link Issues**: Reference any related issues

### PR Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] All existing tests pass
- [ ] Added new tests (if applicable)

## Screenshots (if applicable)
Add screenshots for UI changes
```

## Coding Standards

### JavaScript/React
- Use ES6+ features
- Follow ESLint configuration
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

### File Structure
```
src/
├── components/
│   ├── Auth/
│   ├── Quiz/
│   ├── Admin/
│   └── Common/
├── contexts/
├── utils/
└── styles/
```

### API Design
- RESTful endpoints
- Consistent error handling
- Input validation
- Proper HTTP status codes

## Issue Reporting

### Before Creating an Issue
1. Search existing issues
2. Check if it's already fixed
3. Verify it's reproducible

### Issue Template
```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Screenshots**
If applicable

**Environment**
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Node version: [e.g. 16.14.0]
```

## Development Guidelines

### Frontend (React)
- Use functional components with hooks
- Implement proper error boundaries
- Follow Material-UI patterns
- Ensure responsive design
- Add loading states

### Backend (Node.js)
- Use async/await for promises
- Implement proper error handling
- Add input validation
- Follow security best practices
- Document API endpoints

### Database (MongoDB)
- Use Mongoose schemas
- Add proper indexes
- Implement data validation
- Follow naming conventions

## Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

### Manual Testing Checklist
- [ ] User registration/login
- [ ] Quiz creation (admin)
- [ ] Question management
- [ ] Quiz taking experience
- [ ] Timer functionality
- [ ] Scoring system
- [ ] Leaderboard
- [ ] File uploads
- [ ] Responsive design

## Code Review Guidelines

### For Reviewers
- Check functionality
- Review code quality
- Test edge cases
- Verify documentation
- Ensure security practices

### For Contributors
- Respond to feedback promptly
- Make requested changes
- Keep discussions constructive
- Update PR description if needed

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag release
5. Deploy to production

## Community Guidelines

- Be respectful and inclusive
- Help newcomers
- Share knowledge
- Follow code of conduct
- Participate constructively

## Getting Help

- **Documentation**: Check README.md
- **Issues**: Search existing issues
- **Discussions**: Use GitHub Discussions
- **Questions**: Tag maintainers in issues

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project documentation

Thank you for contributing to Quiz App! 🎉