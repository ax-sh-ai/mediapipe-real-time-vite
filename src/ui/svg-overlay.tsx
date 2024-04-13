import { ComponentProps, forwardRef } from 'react';

type SvgOverlayRef = SVGSVGElement;
type SvgOverlayProps = ComponentProps<'svg'>;
export const SvgOverlay = forwardRef<SvgOverlayRef, SvgOverlayProps>((props, ref) => {
  return <svg ref={ref} {...props}></svg>;
});
