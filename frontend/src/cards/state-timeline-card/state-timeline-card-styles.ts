import { css } from 'lit';

export const stateTimelineStyles = css`
  .timeline {
    display: grid;
    grid-template-columns: minmax(0, max-content) 1fr;
    column-gap: 8px;
    row-gap: 4px;
    align-items: center;
  }
  /* auto row height in a fixed-height panel: rows share the height */
  .timeline.fill.auto {
    grid-auto-rows: minmax(10px, 1fr);
    align-items: stretch;
  }
  .timeline.fill.auto .row-bar {
    height: auto;
    max-height: 80px;
  }
  .timeline.fill.auto .row-label {
    align-self: center;
  }
  .timeline.fill.auto .axis {
    align-self: start;
  }
  .row-label {
    font-size: 12px;
    color: var(--secondary-text-color);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 160px;
  }
  /* no track background: transparent states and gaps without data show the card background */
  .row-bar {
    position: relative;
    height: var(--row-height, 26px);
    border-radius: 4px;
    overflow: hidden;
  }
  .segment {
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    font-size: 11px;
    color: #fff;
    text-shadow: 0 1px 1px rgba(0, 0, 0, 0.35);
    white-space: nowrap;
    box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.15);
  }
  .segment span {
    padding: 0 4px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .axis {
    grid-column: 2;
    display: flex;
    justify-content: space-between;
    font-size: 10px;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 14px;
    font-size: 12px;
    color: var(--secondary-text-color);
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .legend-color {
    width: 12px;
    height: 12px;
    border-radius: 3px;
    box-sizing: border-box;
  }
  /* transparent state: outlined square in the legend */
  .legend-color.clear {
    border: 1px dashed var(--secondary-text-color);
  }
  .segment.clear {
    color: var(--secondary-text-color);
    text-shadow: none;
    box-shadow: none;
  }
`;
