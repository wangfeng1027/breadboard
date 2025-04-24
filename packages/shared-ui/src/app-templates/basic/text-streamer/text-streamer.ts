/**
 * @license
 * Copyright 2025 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
import {CSSResultGroup, html, LitElement, css, nothing} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';
import {classMap} from 'lit/directives/class-map.js';

import {BehaviorSubject, Observable, Subject, merge, of, timer} from 'rxjs';
import {concatMap, filter, takeUntil, takeWhile} from 'rxjs/operators';
import ThemeStyle from '../theme-style.js';


/** Controls min typing speed. */
const MIN_STREAMING_CHARACTERS_PER_SECOND = 300;

/**
 * Controls typing speed speed relative to how much content is left to render.
 */
const TIME_TO_RENDER_REMAINING_CONTENT_MS = 200;

/** Max characters added per streaming update. */
const MAX_STREAMING_CHARACTERS_PER_UPDATE = 50;

const TICK_INTERVAL_MS = 1000 / 60; // 60fps

/**
 * Event fired when the text rendering is complete.
 */
export const TEXT_COMPLETE_EVENT = 'gen-text-complete';


/**
 * Event fired when the text rendering is complete.
 */
export const TEXT_RENDER_COMPLETE_EVENT = 'gen-text-render-complete';

export const INTRODUCTION_RENDER_COMPLETE_EVENT = 'gen-introduction-complete';

@customElement('text-streamer')
export class TextStreamer extends LitElement {
  static styles = [];

  @property()
  set text(value: string | undefined) {
    if (value) this.text$.next(value);
  }
  get text() {
    return this.text$.value;
  }

  @property()
  accessor caller = '';

  @state() accessor isFadingIn = false;

  @state() accessor isFadingOut = false;

  @state() accessor partialDisplayedText = '';

  @state() accessor isInTextTypingMode = false;


  protected disconnected$ = new Subject<void>();
  
  private readonly text$ = new BehaviorSubject<string | undefined>(
    undefined,
  );

  private initTextTyping() {
    this.partialDisplayedText = '';
    this.isInTextTypingMode = true;

    timer(0, TICK_INTERVAL_MS)
      .pipe(
        // Stream while there is something to stream and while the answer
        // belongs to the same text that is being streamed.
        takeWhile(
          () =>
            this.isInTextTypingMode
        ),
        takeUntil(this.disconnected$),
      )
      .subscribe(() => {
        // Avoid dealing with citations during character streaming and simply
        // merge all segments into a single string.
        // Citations will be added once streaming is done.
        const availableText = this.text ?? '';

        const availableTextLength = availableText?.length ?? 0;

        const streamedTextLength = this.partialDisplayedText.length;

        // If we streamed everything we have so far:
        if (streamedTextLength >= availableTextLength) {
    
            this.isInTextTypingMode = false;

            this.#notifyIsComplete();

          // The answer is incomplete, wait for more content.
          return;
        }

        const remainingCharacterCount =
          availableTextLength - streamedTextLength;

        // - Avoid appending large blocks of text if there was nothing to
        //   stream for a while.
        // - Do not drop below certain minimum speed.
        // - Aim to render all remaining content within 200ms. In practice
        //   the text finishes streaming within 0.5s from getting full content.
        const characterDelta = Math.min(
          Math.floor(
            Math.max(
              MIN_STREAMING_CHARACTERS_PER_SECOND / 1000,
              remainingCharacterCount / TIME_TO_RENDER_REMAINING_CONTENT_MS,
            ) * TICK_INTERVAL_MS,
          ),
          MAX_STREAMING_CHARACTERS_PER_UPDATE,
        );

        // Animation frame fired too fast, nothing to update yet.
        if (characterDelta === 0) return;

        // Causes re-render.
        this.partialDisplayedText = availableText.slice(
          0,
          streamedTextLength + characterDelta,
        );
      });
  }

  async #notifyIsComplete() {
    if (this.caller === 'introduction') {
        this.dispatchEvent(new CustomEvent(INTRODUCTION_RENDER_COMPLETE_EVENT, {bubbles:true, composed: true}));
    }
    this.dispatchEvent(new CustomEvent(TEXT_COMPLETE_EVENT, {bubbles:true, composed: true}));

    await this.updateComplete;
    this.dispatchEvent(new CustomEvent(TEXT_RENDER_COMPLETE_EVENT, {bubbles:true, composed: true}));
  }

  render() {
    return this.#renderMarkdown();
  }

  #renderMarkdown() {
    let printingText = '';
    // Convert various sources of text into AnswerSegments.
    if (this.isInTextTypingMode && this.partialDisplayedText) {
    // If we are in character streaming mode render partial content without
    // citations otherwise render the full content including citations.
        printingText = this.partialDisplayedText;
    } else if (!!this.text) {
        printingText = this.text;
    }

    if (!printingText) return nothing;

    return html `${printingText}`;
  }

  connectedCallback() {
    super.connectedCallback();

    this.text$.pipe(
        takeUntil(this.disconnected$)
    ).subscribe((value) => {
   
        this.isInTextTypingMode = false;

        if (!value) {
            this.#notifyIsComplete();
            return;
        }
        this.initTextTyping();
        return;
    })

   
  }

  override disconnectedCallback(): void {
    // We do not complete the subject as the element class instance may be
    // reconnected to the DOM, for instance if the element is moved with
    // `Node.appendChild`, in which case new subscriptions will be made with
    // `takeUntil(this.disconnected$)` which should be able to emit again next
    // time it is disconnected.
    this.disconnected$.next();
  }
}
