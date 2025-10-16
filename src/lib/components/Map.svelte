<script lang="ts">
	import { onMount } from 'svelte';
	import type { Map as LeafletMap, LayerGroup, CircleMarker } from 'leaflet';
	import type { BalloonDataset, WildfirePoint } from '$lib/types';

	// Props using Svelte 5 runes
	let { balloonDatasets = [], wildfires = [] }: { balloonDatasets?: BalloonDataset[]; wildfires?: WildfirePoint[] } = $props();

	let mapContainer: HTMLDivElement;
	let map: LeafletMap | null = null;
	let balloonLayer: LayerGroup | null = null;
	let wildfireLayer: LayerGroup | null = null;

	onMount(async () => {
		// Dynamic import to avoid SSR issues
		const L = await import('leaflet');

		// Initialize map centered on US
		map = L.map(mapContainer).setView([39.8283, -98.5795], 4);

		// Add OpenStreetMap tiles
		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
			maxZoom: 19
		}).addTo(map);

		// Create layer groups
		balloonLayer = L.layerGroup().addTo(map);
		wildfireLayer = L.layerGroup().addTo(map);

		return () => {
			map?.remove();
		};
	});

	// Update balloon markers when data changes
	$effect(() => {
		if (!balloonLayer) return;

		const L = (window as any).L;
		if (!L) return;

		// Clear existing markers
		balloonLayer.clearLayers();

		// Add markers for each dataset
		balloonDatasets.forEach((dataset) => {
			const age = dataset.hour;
			const opacity = 1 - age / 24; // Fade with age

			dataset.points.forEach(([lat, lon, altitude]) => {
				const marker = L.circleMarker([lat, lon], {
					radius: 3,
					fillColor: '#3b82f6',
					color: '#1e40af',
					weight: 1,
					opacity: opacity,
					fillOpacity: opacity * 0.6
				});

				marker.bindPopup(`
					<strong>Weather Balloon</strong><br/>
					Latitude: ${lat.toFixed(4)}°<br/>
					Longitude: ${lon.toFixed(4)}°<br/>
					Altitude: ${altitude.toFixed(0)}m<br/>
					Age: ${age} hour${age === 1 ? '' : 's'}
				`);

				balloonLayer!.addLayer(marker);
			});
		});
	});

	// Update wildfire markers when data changes
	$effect(() => {
		if (!wildfireLayer) return;

		const L = (window as any).L;
		if (!L) return;

		// Clear existing markers
		wildfireLayer.clearLayers();

		// Add markers for each fire
		wildfires.forEach((fire) => {
			// Size based on brightness (typical range 300-400K)
			const size = Math.min(10, Math.max(4, (fire.brightness - 300) / 10));

			// Color based on confidence
			const color = fire.confidence >= 80 ? '#dc2626' : '#f97316';

			const marker = L.circleMarker([fire.latitude, fire.longitude], {
				radius: size,
				fillColor: color,
				color: '#7f1d1d',
				weight: 1,
				opacity: 0.8,
				fillOpacity: 0.6
			});

			marker.bindPopup(`
				<strong>Active Fire</strong><br/>
				Latitude: ${fire.latitude.toFixed(4)}°<br/>
				Longitude: ${fire.longitude.toFixed(4)}°<br/>
				Brightness: ${fire.brightness.toFixed(1)}K<br/>
				Confidence: ${fire.confidence}%<br/>
				Detected: ${fire.acq_date} ${fire.acq_time}
			`);

			wildfireLayer!.addLayer(marker);
		});
	});
</script>

<div bind:this={mapContainer} class="map-container"></div>

<style>
	.map-container {
		width: 100%;
		height: 100%;
		min-height: 500px;
	}

	:global(.leaflet-container) {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, sans-serif;
	}
</style>
