import {css} from 'lit';

export default css `

    @use 'sass:color';
    @use 'sass:math';

    $second-bar-ratio: 0.6;

    @include mixins.magi-element;

    :host {
    --_skeleton-gradient1: #{var(--magi-primary-light)};
    --_skeleton-gradient2: #{var(--magi-primary)};
    background: none;

    }

    :host([spk2]) {
    --_skeleton-gradient1: #{var(--color-surface-container-high)};
    --_skeleton-gradient2: #{var(--color-primary)};

    .main {
        background: none;
    }

    .text-container {
        color: var(--color-outline);
    }
    }

    .main {
        background: linear-gradient(
            180deg,
            rgba(244, 246, 251, 1) 0%,
            rgba(255, 255, 255, 1) 100%
        );
    }

    .skeleton-loader {
        height: 18px;
        display: block;
        background: linear-gradient(
            to right,
            var(--_skeleton-gradient1),
            var(--_skeleton-gradient2),
            var(--_skeleton-gradient1)
            ),
            var(--_skeleton-gradient1);
        border-radius: 100px;
        background-repeat: repeat-y;
        background-size: 100px 200px;
        background-position: -50px 0;
        animation: var(--_skeleton-animation, move-forward 1s infinite);
        margin-top: 16px;
    }

    .text-container {
        color: var(--vais-grey-600);
    }

    .text-container.fade-in {
    animation: fadeIn 0.25s linear forwards;
    }

    .text-container.fade-out {
    animation: fadeOut 0.25s linear;
    }

    // Add more .text-fading classes as needed

    @keyframes fadeIn {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }

    @keyframes move-forward {
        to {
            background-position: 100% 0;
        }
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    .first-line.skeleton-loader {
        width: min(var(--widget-width), 100%);
    }

    .second-line.skeleton-loader {
        width: var(--widget-width) * $second-bar-ratio;
    }

`;