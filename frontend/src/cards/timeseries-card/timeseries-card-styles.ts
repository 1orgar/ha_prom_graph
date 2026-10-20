import { css } from 'lit';

export const timeseriesStyles = css`
  .chart-container {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    overflow: hidden;
  }
  .legend {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 0;
    gap: 4px 16px;
    font-size: 12px;
    max-height: var(--legend-max-height, 160px);
    overflow-y: auto;
  }
  .legend-item {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    user-select: none;
    min-width: 0;
  }
  .legend-item.hidden,
  tr.hidden {
    opacity: 0.4;
  }
  .legend-color {
    width: 14px;
    height: 4px;
    border-radius: 2px;
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
  }
  .legend-stat {
    font-weight: 400;
    color: var(--secondary-text-color);
  }
  .legend-table-wrap {
    flex-shrink: 0;
    max-height: var(--legend-max-height, 200px);
    overflow: auto;
  }
  table.legend-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }
  .legend-table th {
    text-align: right;
    font-weight: 500;
    color: var(--secondary-text-color);
    padding: 2px 6px;
    white-space: nowrap;
  }
  .legend-table th:first-child,
  .legend-table td:first-child {
    text-align: left;
  }
  .legend-table td {
    padding: 2px 6px;
    text-align: right;
    white-space: nowrap;
    border-top: 1px solid var(--divider-color);
  }
  .legend-table tr {
    cursor: pointer;
  }
  .legend-table .name-cell {
    display: flex;
    align-items: center;
    gap: 6px;
    max-width: 260px;
  }
  .legend-table .name-cell span:last-child {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .uplot {
    font-family: inherit;
  }
  .uplot .u-legend {
    display: none; /* own legend */
  }
`;
