<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import Map from "$lib/components/Map.svelte";
  import Legend from "$lib/components/Legend.svelte";
  import { balloonData } from "$lib/stores/balloonData";
  import { wildfireData } from "$lib/stores/wildfireData";

  let cleanupBalloons: (() => void) | null = null;
  let cleanupWildfires: (() => void) | null = null;

  onMount(() => {
    // Start polling for both data sources
    cleanupBalloons = balloonData.startPolling();
    cleanupWildfires = wildfireData.startPolling();
  });

  onDestroy(() => {
    // Clean up polling intervals
    cleanupBalloons?.();
    cleanupWildfires?.();
  });

  // Calculate total balloon points
  let totalBalloonPoints = $derived(
    $balloonData.datasets.reduce((sum, ds) => sum + ds.points.length, 0)
  );

  // Format last updated time
  function formatTime(date: Date | null): string {
    if (!date) return "Never";
    return date.toLocaleTimeString();
  }
</script>

<svelte:head>
  <title>WindBorne Weather Balloon & Wildfire Tracker</title>
  <meta
    name="description"
    content="Real-time visualization of WindBorne's weather balloon constellation and active wildfires"
  />
</svelte:head>

<div class="app">
  <header>
    <div class="header-content">
      <div class="header-stats">
        <div class="header-stat">
          <span class="stat-label">Balloon Points:</span>
          <span class="stat-value">{totalBalloonPoints.toLocaleString()}</span>
        </div>
        <div class="header-stat">
          <span class="stat-label">Active Fires:</span>
          <span class="stat-value"
            >{$wildfireData.fires.length.toLocaleString()}</span
          >
        </div>
      </div>
      <div class="header-title">
        <h1>WindBorne Weather Balloon & Wildfire Tracker</h1>
        <p class="subtitle">
          Visualizing atmospheric monitoring data alongside active wildfire
          locations
        </p>
      </div>
    </div>
  </header>

  {#if $balloonData.status.loading || $wildfireData.status.loading}
    <div class="loading-banner">Loading data...</div>
  {/if}

  {#if $balloonData.status.error || $wildfireData.status.error}
    <div class="error-banner">
      {$balloonData.status.error || $wildfireData.status.error}
    </div>
  {/if}

  <div class="map-wrapper">
    <Map
      balloonDatasets={$balloonData.datasets}
      wildfires={$wildfireData.fires}
    />
    <Legend />
  </div>

  <footer>
    <div class="footer-content">
      <div class="data-sources">
        <strong>Data Sources:</strong>
        <a
          href="https://windbornesystems.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          WindBorne Systems
        </a>
        •
        <a
          href="https://firms.modaps.eosdis.nasa.gov/"
          target="_blank"
          rel="noopener noreferrer"
        >
          NASA FIRMS
        </a>
      </div>
      <div class="update-info">
        Last updated: Balloons {formatTime($balloonData.status.lastUpdated)} • Fires
        {formatTime($wildfireData.status.lastUpdated)}
        <br />
        Updates every 3 min (balloons) / 2 min (fires)
      </div>
    </div>
  </footer>
</div>

<style>
  .app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    margin: 0 auto;
  }

  header {
    background: #1e3a8a;
    color: white;
    padding: 20px 20px;
  }

  .header-content {
    margin: 0 auto;
    display: flex;
    gap: 20px;
  }

  .header-stats {
    display: flex;
    gap: 24px;
    flex-shrink: 0;
  }

  .header-stat {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .header-stat .stat-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 500;
  }

  .header-stat .stat-value {
    font-size: 18px;
    font-weight: 700;
    color: white;
  }

  .header-title {
    flex: 1;
    text-align: center;
  }

  h1 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 700;
  }

  .subtitle {
    margin: 0;
    font-size: 16px;
    opacity: 0.95;
  }

  .loading-banner,
  .error-banner {
    padding: 12px 20px;
    text-align: center;
    font-weight: 500;
  }

  .loading-banner {
    background: #dbeafe;
    color: #1e40af;
  }

  .error-banner {
    background: #fee2e2;
    color: #991b1b;
  }

  .map-wrapper {
    position: relative;
    flex: 1;
    min-height: 0;
    width: 100%;
    overflow: hidden;
  }

  footer {
    background: #1f2937;
    color: #d1d5db;
    padding: 16px 20px;
    font-size: 13px;
  }

  .footer-content {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  .data-sources a {
    color: #60a5fa;
    text-decoration: none;
  }

  .data-sources a:hover {
    text-decoration: underline;
  }

  .update-info {
    text-align: right;
    line-height: 1.5;
  }

  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 16px;
      text-align: center;
    }

    .header-stats {
      order: 2;
      justify-content: center;
    }

    .header-title {
      order: 1;
    }

    h1 {
      font-size: 22px;
    }

    .subtitle {
      font-size: 14px;
    }

    .header-stat .stat-value {
      font-size: 16px;
    }

    .footer-content {
      flex-direction: column;
      text-align: center;
    }

    .update-info {
      text-align: center;
    }
  }
</style>
