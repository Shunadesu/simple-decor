# 🔄 Git Workflow for Zuna Simple Decor

## 📋 Branch Strategy

We use a simplified Git Flow strategy:

```
main (production)
├── develop (staging)
│   ├── feature/user-authentication
│   ├── feature/product-catalog
│   └── feature/admin-dashboard
├── hotfix/critical-bug-fix
└── release/v1.0.0
```

### Branch Types

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/\***: New features or enhancements
- **hotfix/\***: Critical fixes for production
- **release/\***: Prepare new production releases
- **bugfix/\***: Non-critical bug fixes

## 🚀 Workflow Steps

### 1. Starting New Feature

```bash
# Switch to develop and pull latest
git checkout develop
git pull origin develop

# Create feature branch
git checkout -b feature/consultation-modal

# Set upstream
git push -u origin feature/consultation-modal
```

### 2. Working on Feature

```bash
# Make changes and commit frequently
git add .
git commit -m "feat(client): add consultation modal component"

# Push to remote
git push origin feature/consultation-modal
```

### 3. Completing Feature

```bash
# Ensure feature is up to date with develop
git checkout develop
git pull origin develop
git checkout feature/consultation-modal
git merge develop

# If conflicts, resolve and commit
git add .
git commit -m "resolve merge conflicts with develop"

# Push final changes
git push origin feature/consultation-modal
```

### 4. Creating Pull Request

1. Go to GitHub/GitLab
2. Create PR from `feature/consultation-modal` to `develop`
3. Add description using template
4. Request review from team members
5. Ensure CI/CD checks pass

### 5. After PR Approval

```bash
# Merge via GitHub/GitLab interface
# Delete feature branch
git checkout develop
git pull origin develop
git branch -d feature/consultation-modal
git push origin --delete feature/consultation-modal
```

## 🔧 Commit Message Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Build system changes
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

### Scopes

- `client`: Frontend client app
- `admin`: Admin CMS
- `server`: Backend API
- `api`: API endpoints
- `db`: Database changes
- `config`: Configuration changes
- `deps`: Dependencies

### Examples

```bash
git commit -m "feat(client): add user registration modal"
git commit -m "fix(server): resolve CORS issue with file uploads"
git commit -m "docs(api): update product API documentation"
git commit -m "style(admin): improve dashboard responsive layout"
git commit -m "refactor(server): extract email service"
git commit -m "perf(client): optimize image lazy loading"
git commit -m "test(api): add user authentication tests"
git commit -m "build(docker): update Node.js to v18"
git commit -m "ci: add automated testing workflow"
git commit -m "chore(deps): update React to v18.2"
```

## 🛡️ Quality Gates

### Pre-commit Checks

- ✅ No `.env` files
- ✅ No secrets in code
- ✅ Linting passes
- ✅ No large files (>50MB)

### Pre-merge Checks

- ✅ All tests pass
- ✅ Code review approved
- ✅ No merge conflicts
- ✅ CI/CD pipeline green

## 📝 Pull Request Template

```markdown
## 📋 Description

Brief description of changes

## 🔧 Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## 🧪 Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## 📱 Screenshots (if applicable)

Add screenshots for UI changes

## ✅ Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is commented where necessary
- [ ] Documentation updated
- [ ] No console.log statements left
- [ ] Environment variables used for secrets
```

## 🚨 Emergency Hotfix Process

For critical production issues:

```bash
# Create hotfix from main
git checkout main
git pull origin main
git checkout -b hotfix/critical-security-fix

# Make minimal fix
git add .
git commit -m "fix(server): patch security vulnerability"

# Push and create PR to main
git push -u origin hotfix/critical-security-fix
```

After hotfix merge:

```bash
# Merge hotfix to develop as well
git checkout develop
git merge main
git push origin develop
```

## 🔄 Release Process

### 1. Prepare Release

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.2.0

# Update version numbers
# Update CHANGELOG.md
# Final testing

git commit -m "chore(release): prepare v1.2.0"
git push -u origin release/v1.2.0
```

### 2. Merge to Main

```bash
# Create PR from release/v1.2.0 to main
# After approval and merge:
git checkout main
git pull origin main
git tag v1.2.0
git push origin v1.2.0
```

### 3. Merge Back to Develop

```bash
git checkout develop
git merge main
git push origin develop
```

## 📊 Useful Git Commands

### Check Status

```bash
git status                    # Check working directory
git log --oneline -10         # Last 10 commits
git branch -a                 # All branches
git remote -v                 # Remote repositories
```

### Cleanup

```bash
git branch --merged | grep -v main | xargs -n 1 git branch -d
git remote prune origin       # Remove stale remote branches
git gc                        # Garbage collection
```

### Undo Changes

```bash
git checkout -- file.js      # Discard working changes
git reset HEAD file.js        # Unstage file
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (lose changes)
```

### View Differences

```bash
git diff                      # Working directory vs staging
git diff --cached             # Staging vs last commit
git diff HEAD~1 HEAD          # Last commit vs previous
```

## 🔍 Troubleshooting

### Merge Conflicts

```bash
# Pull latest changes
git pull origin develop

# Resolve conflicts in files
# Add resolved files
git add resolved-file.js

# Complete merge
git commit -m "resolve merge conflicts"
```

### Accidental Commit

```bash
# Undo last commit but keep changes
git reset --soft HEAD~1

# Completely remove last commit
git reset --hard HEAD~1

# Remove file from last commit
git reset --soft HEAD~1
git reset HEAD unwanted-file.js
git commit -m "remove unwanted file"
```

### Force Push Safety

```bash
# Safer force push
git push --force-with-lease origin feature-branch
```

---

**Remember: When in doubt, ask the team! 🤝**
