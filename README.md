# WindBorne Weather Balloon & Wildfire Tracker

A real-time visualization tool that displays WindBorne Systems' weather balloon constellation data alongside active wildfire locations from NASA FIRMS.

## Live Demo

[WindBorne Weather Balloon & Wildfire Tracker](https://windborne-wildfires.vercel.app/)

## What It Does

This application visualizes two critical datasets:

1. **WindBorne Weather Balloons**: Live positions from WindBorne's 24-hour rolling constellation of atmospheric monitoring balloons
2. **Active Wildfires**: Real-time wildfire detections from NASA's Fire Information for Resource Management System (FIRMS)

## Why Wildfires?

This combination tells an important story about WindBorne's atmospheric monitoring mission. Weather balloons provide crucial atmospheric data near active fires, which helps with:

- **Fire behavior prediction** - Understanding wind patterns and atmospheric conditions
- **Smoke dispersion modeling** - Tracking how wildfire smoke moves through the atmosphere
- **Air quality monitoring** - Measuring the atmospheric impact of active fires
- **Disaster response** - Supporting firefighting efforts with real-time atmospheric data

By visualizing both datasets together, this app demonstrates how WindBorne's network could support climate science and disaster response efforts.

## Tech Stack

- **SvelteKit**
- **TypeScript**
- **Leaflet**
- **Standard CSS**
- **Vite**

## Data Sources

- **Balloon Data**: [WindBorne Systems Treasure Hunt API](https://a.windbornesystems.com/treasure/)

  - 24 hourly endpoints (00.json through 23.json)
  - Each contains ~1000 balloon positions [lat, lon, altitude]
  - Robust validation filters corrupted entries

- **Wildfire Data**: [NASA FIRMS](https://firms.modaps.eosdis.nasa.gov/)
  - MODIS Near Real-Time (NRT) active fire detections
  - Last 24 hours of global wildfire activity
  - Includes brightness, confidence, and timestamp data

## Features

- **Robust Data Validation**: Filters invalid balloon data points based on strict validation rules
- **Live Updates**: Polls every 5 minutes for balloons, 10 minutes for wildfires
- **Performance Optimized**: Uses ~294 requests/hour (well under 1000 limit)
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Statistics**: Shows active data counts and error tracking
- **Interactive Map**: Click markers for detailed information about each point

\`\`\`
src/
├── routes/
│ └── +page.svelte # Main page with map and stats
├── lib/
│ ├── stores/
│ │ ├── balloonData.ts # Balloon fetching + polling
│ │ └── wildfireData.ts # Wildfire fetching + polling
│ ├── components/
│ │ ├── Map.svelte # Leaflet map with markers
│ │ └── Legend.svelte # Map legend and explanation
│ ├── utils/
│ │ └── parseBalloons.ts # Data validation logic
│ └── types/
│ └── index.ts # TypeScript types
└── app.css # Global styles
\`\`\`

## Data Validation

The application implements strict validation for balloon data to handle potential corruption:

- Must be an array with exactly 3 elements
- All values must be valid numbers (not NaN, not null)
- Latitude: -90 to 90
- Longitude: -180 to 180
- Altitude: 0 to 50,000 meters

Invalid entries are filtered out and counted to demonstrate robust error handling.

## Deployment

Deployed on Vercel with automatic deployments from the main branch.

## Author

Brett Eastman

- Portfolio: [bretteastman.dev](https://www.bretteastman.dev/)

## License

Built as a coding challenge for WindBorne Systems.
