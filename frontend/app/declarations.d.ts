import { DetailedHTMLProps, HTMLAttributes } from 'react';

    namespace JSX {
        interface IntrinsicElements {
            'iconify-icon': DetailedHTMLProps<HTMLAttributes<HTMLElement> & {
                icon?: string;
                'stroke-width'?: string | number;
                strokeWidth?: string | number;
                class?: string;
                className?: string;
            }, HTMLElement>;
        }
    }
