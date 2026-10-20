import { css, CSSResultGroup } from 'lit';

export const cardStyles: CSSResultGroup = css`
  :host {
    display: block;
  }
  /* Every panel: same padding, fills the height given by the layout / card_height */
  ha-card {
    border-radius: var(--ha-card-border-radius, 12px);
    overflow: hidden;
    padding: 16px;
    gap: 8px;
    height: 100%;
    background: var(--ha-card-background, var(--card-background-color, var(--paper-card-background-color, white)));
    box-shadow: var(--ha-card-box-shadow, 0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12));
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
  }

  /* Panel title: identical on every card, so panels in one row line up */
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
    height: 24px;
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--primary-text-color);
  }
  .card-header .card-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .card-header .card-extra {
    font-size: 12px;
    font-weight: 400;
    color: var(--secondary-text-color);
    white-space: nowrap;
  }

  /* Content area that takes the remaining panel height */
  .fill {
    flex: 1 1 auto;
    min-height: 0;
    position: relative;
  }

  /* "Transparent background" option: no plate, no shadow, no border */
  :host([transparent]) ha-card {
    background: none;
    box-shadow: none;
    border: none;
    --ha-card-border-width: 0;
    backdrop-filter: none;
  }

  .card-content {
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  .value-large {
    font-size: 36px;
    font-weight: 700;
    color: var(--primary-text-color);
    line-height: 1.2;
  }

  .value-unit {
    font-size: 16px;
    font-weight: 400;
    color: var(--secondary-text-color);
    margin-left: 4px;
  }

  .icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: var(--primary-color);
    opacity: 0.1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 16px;
  }

  .error-state {
    color: var(--error-color, #db4437);
    font-size: 14px;
    padding: 16px;
    text-align: center;
  }

  .placeholder-state {
    color: var(--secondary-text-color);
    font-size: 14px;
    padding: 16px;
    text-align: center;
  }

  .loading-state {
    animation: shimmer 2s infinite linear;
    background: linear-gradient(
      to right,
      rgba(130, 130, 130, 0.2) 4%,
      rgba(130, 130, 130, 0.3) 25%,
      rgba(130, 130, 130, 0.2) 36%
    );
    background-size: 1000px 100%;
    height: 40px;
    border-radius: 4px;
    width: 100%;
  }

  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
