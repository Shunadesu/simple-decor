# 🔒 Git Security Guidelines for Zuna Simple Decor

## 🚨 Critical Files to NEVER Commit

### Environment Variables

```
.env
.env.local
.env.production
server/.env
client/.env
admin-cms/.env
```

### Security Keys & Certificates

```
*.pem
*.key
*.cert
*.crt
*.p12
*.pfx
```

### Database Files

```
*.sqlite
*.sqlite3
*.db
*.dump
database.json
```

### Configuration Files with Secrets

```
config/production.json
config/secrets.json
cloudinary-config.json
aws-credentials.json
```

## ✅ Safe to Commit

### Configuration Templates

```
.env.example
.env.template
config.example.json
```

### Documentation

```
README.md
DEPLOYMENT.md
API_DOCS.md
```

### Source Code

```
src/
components/
pages/
utils/
```

## 🛠️ Pre-commit Checklist

Before every commit, ensure:

- [ ] No `.env` files are staged
- [ ] No API keys in source code
- [ ] No database files included
- [ ] No personal information in comments
- [ ] No hardcoded URLs or credentials
- [ ] All secrets use environment variables

## 🔧 Git Commands for Security

### Check what you're about to commit:

```bash
git diff --cached
```

### Remove sensitive file from staging:

```bash
git reset HEAD .env
```

### Remove file from git history (DANGEROUS):

```bash
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch .env' \
--prune-empty --tag-name-filter cat -- --all
```

### Add file to .gitignore after committing by mistake:

```bash
echo ".env" >> .gitignore
git rm --cached .env
git commit -m "Remove .env from tracking"
```

## 🚫 Common Mistakes to Avoid

1. **Committing .env files**

   - Always check `.env` is in `.gitignore`
   - Use `.env.example` for templates

2. **Hardcoding API keys**

   ```javascript
   // ❌ WRONG
   const API_KEY = "abc123def456";

   // ✅ CORRECT
   const API_KEY = process.env.VITE_API_KEY;
   ```

3. **Committing database dumps**

   - Use `.gitignore` to exclude `*.dump`, `*.sql`
   - Store backups separately

4. **Including node_modules**

   - Always have `node_modules/` in `.gitignore`
   - Use `package.json` for dependency management

5. **Committing build files**
   - Exclude `dist/`, `build/`, `.next/`
   - Let CI/CD handle builds

## 🔍 Security Scanning

### Check for secrets in commits:

```bash
# Install git-secrets
git secrets --scan

# Scan entire history
git secrets --scan-history
```

### Manual check for common patterns:

```bash
# Search for potential API keys
git log -p | grep -E "(api_key|API_KEY|secret|password|token)"

# Check current files
grep -r "api_key\|API_KEY\|secret\|password" . --exclude-dir=node_modules
```

## 🚨 If You Accidentally Commit Secrets

### 1. Immediate Actions

- Change all exposed credentials immediately
- Rotate API keys
- Update passwords
- Revoke tokens

### 2. Clean Git History

```bash
# Remove file from last commit
git reset --soft HEAD~1
git reset HEAD .env
git commit -m "Remove secrets"

# For older commits, use filter-branch or BFG Repo-Cleaner
```

### 3. Force Push (if safe)

```bash
git push --force-with-lease origin main
```

⚠️ **Warning**: Force pushing rewrites history and affects collaborators

## 📝 Environment Variable Best Practices

### Structure your .env files:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/zuna_simple_decor

# Authentication
JWT_SECRET=your-secret-here
JWT_EXPIRES_IN=7d

# Third-party Services
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Application URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### Create .env.example:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/your_database

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Third-party Services
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret

# Application URLs
CLIENT_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## 🔗 Additional Resources

- [GitHub Security Best Practices](https://docs.github.com/en/code-security)
- [Git Secrets Tool](https://github.com/awslabs/git-secrets)
- [BFG Repo-Cleaner](https://rtyley.github.io/bfg-repo-cleaner/)
- [GitGuardian](https://www.gitguardian.com/) for automated secret scanning

---

**Remember: Security is everyone's responsibility! 🛡️**
