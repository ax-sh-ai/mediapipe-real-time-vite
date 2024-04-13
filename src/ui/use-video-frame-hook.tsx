import { ElementRef, useCallback, useEffect, useRef } from 'react';

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

export function useVideoFrameHook(callback: VideoFrameHookCallback) {
  const ref = useRef<ElementRef<'video'>>(null);
  const handleCallback = useCallback(callback, []);
  useEffect(() => {
    const video = ref.current;

    async function initDrawingLoop(video: HTMLVideoElement) {
      if (video.requestVideoFrameCallback) {
        const drawingLoop = (
          timestamp: DOMHighResTimeStamp,
          metadata: VideoFrameCallbackMetadata
        ) => {
          handleCallback({ video, timestamp, metadata });
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
  }, []);
  return ref;
}
