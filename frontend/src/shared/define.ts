/**
 * `@customElement` that does nothing when the tag is already defined.
 *
 * Two copies of the bundle on one page (the resource registered by the integration and the
 * former separate "ha_prom_graph_cards" plugin, or a resource added twice) would otherwise
 * stop the second copy with "the name has already been used with this registry" errors.
 * The first copy wins; the second one is inert.
 */
export const customElement =
  (tagName: string) =>
  (cls: CustomElementConstructor): void => {
    if (!customElements.get(tagName)) customElements.define(tagName, cls);
  };
