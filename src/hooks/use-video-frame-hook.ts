import { Detection } from '@mediapipe/tasks-vision';
import { ElementRef, useEffect, useRef } from 'react';

import { useFaceDetector } from './use-face-detector';

// async function handleSeekToNextFrame(video: HTMLVideoElement) {
//   const requestNextFrame = (callback: any) => {
//     video.addEventListener('seeked', () => callback(video.currentTime), { once: true });
//     video.seekToNextFrame();
//   };
//   await video.play();
//   await video.pause();
//   const width = video.videoWidth;
//   const height = video.videoHeight;
//   // ctx.filter = 'invert(1)';
//   const drawingLoop = (timestamp: number) => {
//     console.log(`timestamp: ${timestamp}`, 'For unsupported');
//     requestNextFrame(drawingLoop);
//   };
//   requestNextFrame(drawingLoop);
// }

export type VideoFrameHookCallbackArgs = {
  video: HTMLVideoElement;
  timestamp: number;
  metadata: VideoFrameCallbackMetadata;
};
export type VideoFrameHookCallback = (props: VideoFrameHookCallbackArgs) => void;
export type DetectionCallbackArgs = { video: HTMLVideoElement; detections: Detection[] };
export function useVideoFrameHook(callback: (props: DetectionCallbackArgs) => void) {
  const ref = useRef<ElementRef<'video'>>(null);
  const faceDetector = useFaceDetector();

  useEffect(() => {
    const video = ref.current;

    async function initDrawingLoop(video: HTMLVideoElement) {
      if (video.requestVideoFrameCallback) {
        const drawingLoop = () =>
          // timestamp: DOMHighResTimeStamp,
          // metadata: VideoFrameCallbackMetadata
          {
            const { detections } = faceDetector.detect(video);
            callback({ video, detections });
            // console.log(`timestamp: ${timestamp}`, { metadata });
            video.requestVideoFrameCallback(drawingLoop);
          };
        video.requestVideoFrameCallback(drawingLoop);
      }
      // else if (video.seekToNextFrame) {
      //   await handleSeekToNextFrame(video);
      // }
      else {
        console.error(
          "Your browser doesn't support any of these methods, we should fallback to timeupdate"
        );
      }
    }

    if (!video) return;
    void initDrawingLoop(video);
    // video.cancelVideoFrameCallback
  }, [faceDetector]);
  return ref;
}
