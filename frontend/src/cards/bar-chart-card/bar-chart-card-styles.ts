import { css } from 'lit';

export const barChartStyles = css`
  .body {
    display: flex;
    flex-direction: column;
  }
  /* ---- horizontal ---- */
  .bars-horizontal {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  /* auto bar height: rows share the panel height (fixed-height panel), 24px otherwise */
  .body.fill .bars-horizontal.auto {
    flex: 1 1 auto;
    min-height: 0;
  }
  .body.fill .bars-horizontal.auto .bar-row {
    flex: 1 1 0;
    min-height: 8px;
  }
  .bar-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bar-label {
    width: 80px;
    flex-shrink: 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-size: 14px;
  }
  .track {
    position: relative;
    border-radius: 4px;
    background: var(--secondary-background-color, rgba(100, 100, 100, 0.2));
  }
  .track.clear {
    background: transparent;
  }
  .row-track {
    flex-grow: 1;
    height: var(--bar-h, 24px);
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .body.fill .bars-horizontal.auto .row-track {
    height: 100%;
    max-height: 64px;
  }
  .row-track.with-end {
    --end-w: 76px;
    overflow: visible;
  }
  .row-track .bar-fill {
    height: 100%;
    flex-shrink: 0;
    transition: width 0.3s ease-out;
  }
  .bar-fill {
    border-radius: 4px;
  }
  .end-value {
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
  }
  .bar-value {
    min-width: 60px;
    flex-shrink: 0;
    text-align: right;
    font-size: 14px;
    font-weight: 500;
  }
  /* ---- vertical ---- */
  .bars-vertical {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    height: 200px;
    justify-content: space-around;
  }
  .body.fill .bars-vertical {
    flex: 1 1 auto;
    height: auto;
    min-height: 0;
  }
  .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    flex: 1;
    height: 100%;
    min-width: 0;
  }
  .bar-col-value {
    font-size: 12px;
    font-weight: 500;
  }
  .col-track {
    width: 100%;
    max-width: 40px;
    flex-grow: 1;
    display: flex;
    align-items: flex-end;
  }
  .col-track .bar-fill {
    width: 100%;
    transition: height 0.3s ease-out;
  }
  .col-track .end-value {
    position: absolute;
    left: 50%;
    transform: translate(-50%, -4px);
    font-size: 12px;
  }
  .bar-col-label {
    font-size: 12px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 100%;
  }
`;
