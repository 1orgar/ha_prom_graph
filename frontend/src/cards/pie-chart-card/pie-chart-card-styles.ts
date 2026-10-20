import { css } from 'lit';

export const pieStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  /* Narrow card (card picker preview, 3-4 sections columns): legend goes below the chart */
  @container (max-width: 340px) {
    .body {
      flex-direction: column;
    }
    .body .legend {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      gap: 4px 14px;
      max-height: none;
    }
    .chart {
      width: min(var(--pie-size, 180px), 70cqw);
    }
  }
  /* fixed-height panel: the chart is limited by the available height */
  .body.fill {
    flex: 1 1 auto;
    min-height: 0;
  }
  .body.fill .chart {
    width: auto;
    height: min(100%, var(--pie-size, 180px));
    max-height: 100%;
  }
  .body {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: center;
  }
  .body.bottom {
    flex-direction: column;
  }
  .chart {
    position: relative;
    flex-shrink: 0;
    width: var(--pie-size, 180px);
    max-width: 100%;
    aspect-ratio: 1;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
    overflow: visible;
  }
  path.slice {
    stroke: var(--card-background-color, #fff);
    stroke-width: 1.5;
    transition: transform 0.15s ease, opacity 0.15s ease;
    transform-origin: 50% 50%;
    cursor: pointer;
  }
  path.slice.dim {
    opacity: 0.35;
  }
  path.slice.active {
    transform: scale(1.04);
  }
  .slice-label {
    font-size: 5px;
    fill: #fff;
    pointer-events: none;
    font-weight: 500;
  }
  .center {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    pointer-events: none;
    text-align: center;
    padding: 20%;
  }
  .center .total {
    font-size: 20px;
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
  }
  .center .caption {
    font-size: 11px;
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 100%;
  }
  .legend {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 12px;
    min-width: 0;
    max-height: var(--pie-size, 180px);
    overflow-y: auto;
  }
  .body.bottom .legend {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 4px 14px;
    max-height: none;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    min-width: 0;
  }
  .legend-item.dim {
    opacity: 0.4;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    flex-shrink: 0;
  }
  .legend-name {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .legend-value {
    font-weight: 500;
    color: var(--primary-text-color);
    white-space: nowrap;
    margin-left: auto;
    padding-left: 8px;
  }
`;
