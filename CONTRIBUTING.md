# Contributing to TMSA

Thank you for your interest in contributing to TMSA! 🚛

## Code of Conduct

Be respectful, professional, and collaborative.

## Development Setup

See [README.md](README.md#quick-start) for setup instructions.

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style (formatting, missing semicolons, etc)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding tests
- `chore`: Build process, dependencies, etc
- `ci`: CI/CD changes

### Examples
```
feat(tracking): add real-time GPS position streaming
fix(payment): resolve CinetPay webhook signature validation
docs(api): update swagger documentation for missions endpoint
```

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Write tests
4. Run linting: `pnpm lint`
5. Run tests: `pnpm test`
6. Commit with conventional commits
7. Push to your fork
8. Create Pull Request

## Code Style

- TypeScript strict mode
- ESLint + Prettier
- 100 characters line length
- Use meaningful variable names

## Testing Requirements

- Unit tests for business logic
- Integration tests for APIs
- E2E tests for critical flows
- Minimum 80% code coverage

## Questions?

Contact: dev@tmsa.africa
