# GitHub Actions Workflow for Build & Deploy

This workflow automatically:

1. **Runs on**: 
   - Direct pushes to `main` branch
   - Pull requests merged into `main` branch

2. **Process**:
   - Checks out code
   - Sets up Node.js 20
   - Installs dependencies with `npm ci`
   - Runs tests with `npm run test:run`
   - Runs linter with `npm run lint`
   - Builds production app with `npm run build` (outputs to `docs/`)
   - Commits any changes to `docs/` directory back to the repository
   - Deploys to GitHub Pages from the `docs/` directory

3. **Requirements**:
   - Repository must have GitHub Pages enabled
   - GitHub Pages must be configured to serve from `/docs` directory
   - The workflow needs `contents: write` and `pages: write` permissions

4. **Security**:
   - Uses official GitHub Actions (checkout@v4, setup-node@v4, etc.)
   - Uses built-in `GITHUB_TOKEN` for authentication
   - Only commits build artifacts, not source code changes

## Manual Build

To manually build and deploy:

```bash
npm run build          # Builds to docs/
git add docs/
git commit -m "📦 Update production build"
git push origin main
```

The GitHub Action will automatically handle this process for you when PRs are merged.
