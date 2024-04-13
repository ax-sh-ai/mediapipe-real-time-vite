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
        <path
          id='Path_611'
          data-name='Path 611'
          d='M1,38a12.225,12.225,0,0,1,2.558-3.025L41.351,13.462A21.12,21.12,0,0,1,46.733,12.4a14.319,14.319,0,0,1,4.81.765L89.2,34.814A7.333,7.333,0,0,1,92,37a7.273,7.273,0,0,1,1,3.4v45.3A6.741,6.741,0,0,1,92,89a12.9,12.9,0,0,1-3.015,2.945L50.42,110.628a8.953,8.953,0,0,1-3.688.786,13.383,13.383,0,0,1-4.153-.992L4.2,92.012A12.105,12.105,0,0,1,1,89a7.112,7.112,0,0,1-1-3.581V41.534A9.569,9.569,0,0,1,1,38Z'
          transform='translate(1.502 -10.892)'
          fill='#000'
        />
      </mask>
      <rect
        height={'100%'}
        width={'100%'}
        className={'filter saturate-0 opacity-50'}
        mask='url(#overlayMask)'
      />

      <g className='frame-border' fill='none'>
        <path
          id='Path_611'
          stroke={'#10c020'}
          data-name='Path 611'
          d='M1,38a12.225,12.225,0,0,1,2.558-3.025L41.351,13.462A21.12,21.12,0,0,1,46.733,12.4a14.319,14.319,0,0,1,4.81.765L89.2,34.814A7.333,7.333,0,0,1,92,37a7.273,7.273,0,0,1,1,3.4v45.3A6.741,6.741,0,0,1,92,89a12.9,12.9,0,0,1-3.015,2.945L50.42,110.628a8.953,8.953,0,0,1-3.688.786,13.383,13.383,0,0,1-4.153-.992L4.2,92.012A12.105,12.105,0,0,1,1,89a7.112,7.112,0,0,1-1-3.581V41.534A9.569,9.569,0,0,1,1,38Z'
          transform='translate(1.502 -10.892)'
          strokeLinecap='round'
        />
      </g>
    </svg>
  );
});
