# A Collection of Cycling calculators

## w/kg

This simple app will calculate power for serveral _watts / kg zones_ based on your current body weight (in lbs).

The original code was hastily thrown together in [this codepen](https://codepen.io/bkmontgomery/pen/dyXWeMJ).

## fueling calculator

Given a time period and expected amount of work, this calculator will suggest a feeding strategy.

## Demo

To see it in action, visit [bradmontgomery.net/w-kg/](https://bradmontgomery.net/w-kg/).

## Development & Deployment

This project uses GitHub Actions for automated building and deployment to GitHub Pages.

### Local Development
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run test         # Run tests
npm run lint         # Run linter
npm run build        # Build for production (outputs to docs/)
```

### Deployment
The site is automatically deployed to GitHub Pages when changes are merged into the `main` branch:

1. **Automated Build**: GitHub Actions runs tests, linting, and builds the production version
2. **Commit Build**: The built files in `docs/` directory are automatically committed back to the repository
3. **Deploy**: The `docs/` directory is deployed to GitHub Pages

The workflow is defined in `.github/workflows/build-and-deploy.yml` and triggers on:
- Direct pushes to `main` branch
- Pull requests merged into `main` branch

**Note**: Make sure GitHub Pages is configured to serve from the `docs/` directory in your repository settings.


## License

This is freely available under the terms of the MIT license.
