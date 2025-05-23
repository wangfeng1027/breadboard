/**
 * @license
 * Copyright 2024 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import type { GraphDescriptor } from "@google-labs/breadboard";
import { SignalWatcher } from "@lit-labs/signals";
import { LitElement, css, html, nothing } from "lit";
import { customElement, property } from "lit/decorators.js";
import type { ArtifactEntry } from "../artifacts/artifact-store.js";
import "./board-visualizer.js";
import "./markdown-viewer.js";
import "./text-viewer.js";

@customElement("bbrt-artifact-display")
export class BBRTArtifactDisplay extends SignalWatcher(LitElement) {
  @property({ attribute: false })
  accessor artifact: ArtifactEntry | undefined = undefined;

  static override styles = css`
    :host {
      display: flex;
    }
    :host > * {
      flex-grow: 1;
    }
    .text {
      padding: 24px;
      margin-top: 0;
    }
    #error {
      padding: 20px;
      min-width: 0;
    }
  `;

  override render() {
    if (this.artifact === undefined) {
      return nothing;
    }
    const task = this.artifact.blob;
    if (task.status === "error") {
      return html`<div>Internal error: ${task.error}</div>`;
    }
    if (task.status === "pending") {
      return html`<div>Loading...</div>`;
    }
    const blob = task.value;
    if (blob === undefined) {
      return html`<div>Internal error: Missing Blob</div>`;
    }
    if (blob.type === "application/vnd.breadboard.board") {
      if (this.artifact.json.status === "complete") {
        const graph = this.artifact.json.value as GraphDescriptor;
        return html`
          <bbrt-board-visualizer .graph=${graph}></bbrt-board-visualizer>
        `;
      } else if (this.artifact.json.status === "error") {
        return html`
          <div id="error">
            <bbrt-error-message
              class="error"
              .error=${this.artifact.json.error}
            ></bbrt-error-message>
          </div>
        `;
      }
    }
    if (blob.type === "text/markdown") {
      return html`
        <bbrt-markdown-viewer .markdown=${this.artifact.text.value}>
        </bbrt-markdown-viewer>
      `;
    }
    if (blob.type.startsWith("text/") || blob.type === "application/json") {
      return html`
        <bbrt-text-viewer .text=${this.artifact.text.value}></bbrt-text-viewer>
      `;
    }
    return html`<div>Unknown artifact type: ${blob.type}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "bbrt-artifact-display": BBRTArtifactDisplay;
  }
}
