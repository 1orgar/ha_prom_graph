import { css } from 'lit';

export const queryEditorStyles = css`
  :host {
    display: block;
    position: relative;
  }
  .label {
    font-size: 12px;
    color: var(--secondary-text-color);
    margin: 0 0 4px 2px;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    min-height: 56px;
    resize: vertical;
    padding: 10px 12px;
    font-family: var(--code-font-family, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace);
    font-size: 13px;
    line-height: 1.45;
    color: var(--primary-text-color);
    background: var(--mdc-text-field-fill-color, var(--secondary-background-color));
    border: none;
    border-bottom: 1px solid var(--secondary-text-color);
    border-radius: 4px 4px 0 0;
    outline: none;
  }
  textarea:focus {
    border-bottom: 2px solid var(--primary-color);
  }
  .popup {
    position: absolute;
    left: 0;
    right: 0;
    z-index: 10;
    max-height: 240px;
    overflow-y: auto;
    background: var(--card-background-color, #fff);
    border-radius: 6px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.25);
    padding: 4px 0;
  }
  .item {
    display: flex;
    gap: 8px;
    align-items: baseline;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 13px;
    white-space: nowrap;
  }
  .item.active,
  .item:hover {
    background: color-mix(in srgb, var(--primary-color) 15%, transparent);
  }
  .item .value {
    font-family: var(--code-font-family, ui-monospace, monospace);
    color: var(--primary-text-color);
  }
  .item .kind {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--secondary-text-color);
    min-width: 42px;
  }
  .item .detail {
    color: var(--secondary-text-color);
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 11px;
  }
  .toolbar {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 6px;
    flex-wrap: wrap;
  }
  .test-btn {
    border: 1px solid var(--divider-color);
    background: none;
    color: var(--primary-color);
    border-radius: 16px;
    padding: 4px 12px;
    font-size: 12px;
    cursor: pointer;
  }
  .test-btn[disabled] {
    opacity: 0.5;
    cursor: default;
  }
  .hint {
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .result {
    margin-top: 6px;
    font-size: 12px;
    border-radius: 6px;
    padding: 8px 10px;
    background: var(--secondary-background-color);
    word-break: break-word;
  }
  .result.ok {
    border-left: 3px solid var(--success-color, #43a047);
  }
  .result.err {
    border-left: 3px solid var(--error-color, #db4437);
    color: var(--error-color, #db4437);
  }
  .result code {
    font-family: var(--code-font-family, ui-monospace, monospace);
    font-size: 11px;
  }
  .result ul {
    margin: 4px 0 0;
    padding-left: 16px;
  }
  .test-btn.secondary {
    color: var(--secondary-text-color);
  }
  .alert-form {
    margin-top: 8px;
    padding: 10px;
    border: 1px solid var(--divider-color);
    border-radius: 8px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 8px;
  }
  .alert-form .alert-title,
  .alert-form .wide,
  .alert-form .alert-actions {
    grid-column: 1 / -1;
  }
  .alert-title {
    font-weight: 500;
    font-size: 13px;
  }
  .alert-form label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 11px;
    color: var(--secondary-text-color);
  }
  .alert-form input,
  .alert-form select {
    font: inherit;
    font-size: 13px;
    color: var(--primary-text-color);
    background: var(--mdc-text-field-fill-color, var(--secondary-background-color));
    border: 1px solid var(--divider-color);
    border-radius: 4px;
    padding: 5px 6px;
    min-width: 0;
  }
  .alert-actions {
    display: flex;
    gap: 8px;
  }
`;
