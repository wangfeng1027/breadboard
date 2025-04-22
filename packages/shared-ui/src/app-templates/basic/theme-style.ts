import {css} from 'lit';

export const themeStyle = css `

    :host {
        display: block;
        width: 100%;
        height: 100%;
        --color-on-surface: black;
        --color-background: white;
        --color-bubble-wrapper: #e9eef6;
        --color-surface-container-high: rgb(232 231 239);
      }

      :host([dark-theme]) {
        --color-on-surface: white;
        --color-background: #201f21;
        --color-bubble-wrapper: #282a2c;
        --color-surface-container-high: rgb(40 42 47);
      }
    $magi-primary: #3367d6;
    $magi-primary-light: #dae0f1;
    $magi-primary-lighter: #f4f6fb;
    $color-outline: rgb(218, 220, 224);
    $widget-width: 650px;
    $color-surface-container-high: var(--color-surface-container-high);
    $color-primary: #3367d6;
    $vais-grey-600: rgb(128, 134, 139);
`;