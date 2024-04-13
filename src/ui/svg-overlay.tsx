import { ComponentProps, forwardRef } from 'react';

type SvgOverlayRef = SVGSVGElement;
type SvgOverlayProps = ComponentProps<'svg'>;
export const SvgOverlay = forwardRef<SvgOverlayRef, SvgOverlayProps>((props, ref) => {
  return (
    <svg
      viewBox='0 0'
      className='overlay absolute inset-0 pointer-events-none'
      ref={ref}
      {...props}
    >
      <mask id='overlayMask'>
        <rect x='0' y='0' width='100%' height='100%' fill='white' />
        {props.children}
      </mask>
      <rect
        height={'100%'}
        width={'100%'}
        className={'filter saturate-0 opacity-50'}
        mask='url(#overlayMask)'
      />
    </svg>
  );
});
