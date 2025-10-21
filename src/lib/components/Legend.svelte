<script lang="ts">
  let isOpen = $state(false);

  function toggleModal() {
    isOpen = !isOpen;
  }

  function closeModal() {
    isOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") {
      closeModal();
    }
  }
</script>

<!-- Toggle Button -->
<button
  class="legend-toggle"
  onclick={toggleModal}
  aria-label="Open map legend"
>
  <span>Legend</span>
</button>

<!-- Modal Overlay -->
{#if isOpen}
  <div
    class="modal-overlay"
    onclick={closeModal}
    onkeydown={handleKeydown}
    role="dialog"
    aria-modal="true"
    aria-labelledby="legend-title"
    tabindex="-1"
  >
    <div class="modal-content" role="document">
      <div class="modal-header">
        <h3 id="legend-title">Map Legend</h3>
        <button
          class="modal-close"
          onclick={closeModal}
          aria-label="Close legend"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="modal-body">
        <div class="legend-section">
          <h4>Weather Balloons</h4>
          <div class="legend-item">
            <div class="marker balloon-marker bright"></div>
            <span>Recent balloon positions (brighter = newer)</span>
          </div>
          <div class="legend-item">
            <div class="marker balloon-marker faded"></div>
            <span>Older positions (up to 23 hours ago)</span>
          </div>
        </div>

        <div class="legend-section">
          <h4>Active Wildfires</h4>
          <div class="legend-item">
            <div class="marker fire-marker high"></div>
            <span>High confidence (&ge;80%)</span>
          </div>
          <div class="legend-item">
            <div class="marker fire-marker medium"></div>
            <span>Medium confidence (&lt;80%)</span>
          </div>
        </div>

        <div class="legend-info">
          <p>
            <strong>Why this matters:</strong> WindBorne's atmospheric monitoring
            network provides critical data near active fires, helping understand
            fire behavior, smoke dispersion, and air quality for disaster response.
          </p>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  /* Toggle Button */
  .legend-toggle {
    position: absolute;
    bottom: 30px;
    right: 20px;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    z-index: 1001;
    transition: all 0.2s ease;
  }

  .legend-toggle:hover {
    background: #f9fafb;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
  }

  .legend-toggle:active {
    transform: translateY(0);
  }

  .legend-toggle svg {
    width: 20px;
    height: 20px;
    color: #6b7280;
  }

  /* Modal Overlay */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    backdrop-filter: blur(4px);
  }

  /* Modal Content */
  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 100%;
    max-height: 80vh;
    overflow-y: auto;
    animation: modalSlideIn 0.3s ease-out;
  }

  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  /* Modal Header */
  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 0 24px;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 20px;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #111827;
  }

  .modal-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    color: #6b7280;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    background: #f3f4f6;
    color: #374151;
  }

  .modal-close svg {
    width: 20px;
    height: 20px;
  }

  /* Modal Body */
  .modal-body {
    padding: 0 24px 24px 24px;
  }

  .legend-section {
    margin-bottom: 24px;
  }

  .legend-section h4 {
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }

  .legend-item {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
  }

  .marker {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 1px solid;
    flex-shrink: 0;
  }

  .balloon-marker.bright {
    background-color: #3b82f6;
    border-color: #1e40af;
    opacity: 1;
  }

  .balloon-marker.faded {
    background-color: #3b82f6;
    border-color: #1e40af;
    opacity: 0.3;
  }

  .fire-marker.high {
    background-color: #dc2626;
    border-color: #7f1d1d;
  }

  .fire-marker.medium {
    background-color: #f97316;
    border-color: #7f1d1d;
  }

  .legend-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 1px solid #e5e7eb;
  }

  .legend-info p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: #4b5563;
  }

  /* Mobile Responsive */
  @media (max-width: 768px) {
    .legend-toggle {
      position: fixed;
      bottom: 20px;
      right: 20px;
    }

    .modal-overlay {
      padding: 10px;
    }

    .modal-content {
      max-height: 90vh;
    }

    .modal-header {
      padding: 20px 20px 0 20px;
    }

    .modal-body {
      padding: 0 20px 20px 20px;
    }
  }

  /* Focus styles for accessibility */
  .legend-toggle:focus,
  .modal-close:focus {
    outline: 2px solid #3b82f6;
    outline-offset: 2px;
  }

  /* High contrast mode support */
  @media (prefers-contrast: high) {
    .modal-content {
      border: 2px solid #000;
    }

    .legend-toggle {
      border: 2px solid #000;
    }
  }

  /* Reduced motion support */
  @media (prefers-reduced-motion: reduce) {
    .modal-content {
      animation: none;
    }

    .legend-toggle {
      transition: none;
    }
  }
</style>
