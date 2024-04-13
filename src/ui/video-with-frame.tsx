import { forwardRef } from 'react';

import { boundingBoxToPolygonPoints } from '../libs/utils.tsx';
import { ExtendDetection } from '../types.ts';
import { VideoProps } from './video-with-overlay.tsx';

export type Ref = HTMLVideoElement;

export const VideoWithFrame = forwardRef<Ref, VideoProps>((props, ref) => {});
