import {CSSResultGroup, html, LitElement, css} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import "../generating-loader/generating-loader.js";
import {
  TopGraphRunResult,
} from "../../../types/types";

@customElement('runtime-summary')
export class Summary extends LitElement {
  @property()
  accessor isLoading = true;

  @property()
  accessor topGraphResult: TopGraphRunResult | null = null;

 render() {
    if (this.isLoading) {
            return html`
      <generating-loader></generating-loader>
      `;
    } else {

    }
  }

  connectedCallback() {
    super.connectedCallback();
  }
}