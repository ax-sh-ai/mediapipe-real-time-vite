// src/components/HolisticCanvas.tsx

import React, { useRef, useEffect, useState } from 'react';
import { useHolisticSingleton } from './hooks/useHolisticSingleton';
import { Results } from '@mediapipe/holistic';

interface HolisticCanvasProps {
  videoRef: React.RefObject<HTMLVideoElement>;
}

const HolisticCanvas: React.FC<HolisticCanvasProps> = ({ videoRef }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [holisticResults, setHolisticResults] = useState<Results | null>(null);

  const holisticConfig = {
    selfieMode: false, // Set to false for pre-recorded videos unless you want it mirrored
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
  };

  const handleResults = (results: Results) => {
    console.log(results,3322);
    setHolisticResults(results);
    if (canvasRef.current && videoRef.current) {
      const canvasCtx = canvasRef.current.getContext('2d');
      if (canvasCtx) {
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
        console.log(3322);

        // Simple example: draw a circle on the nose (just for visualization)
        if (results.faceLandmarks && results.faceLandmarks.length > 0) {
          const nose = results.faceLandmarks[1]; // Index 1 is often the nose tip
          canvasCtx.beginPath();
          canvasCtx.arc(
            nose.x * canvasRef.current.width,
            nose.y * canvasRef.current.height,
            5, // radius
            0,
            2 * Math.PI
          );
          canvasCtx.fillStyle = 'blue';
          canvasCtx.fill();
        }
        canvasCtx.restore();
      }
    }
  };

  const { mediaPipeInstance, isLoading, error } = useHolisticSingleton(holisticConfig, handleResults);

  useEffect(() => {
    const processVideo = async () => {
      // Check if MediaPipe is ready and video is playing
      if (mediaPipeInstance && videoRef.current && !videoRef.current.paused && videoRef.current.readyState >= 2) { // readyState >=2 means HAVE_CURRENT_DATA
        // Send the video frame to MediaPipe for processing
        await mediaPipeInstance.send({ image: videoRef.current });
        // Ask to process the next frame as soon as possible
        requestAnimationFrame(processVideo);
      } else if (mediaPipeInstance && videoRef.current && videoRef.current.paused && videoRef.current.readyState >= 2) {
        // If video is paused, you might want to stop processing or handle differently.
        // For looping video, it should generally not be paused unless user pauses it.
        console.log('Video paused, pausing MediaPipe processing.');
      } else if (mediaPipeInstance && videoRef.current && videoRef.current.readyState < 2) {
        // If video isn't ready yet, wait for it to be ready.
        // In App.tsx, we wait for `loadeddata` and `play()`.
        // This `onLoadedData` here is a fallback if `mediaPipeInstance` becomes available before video is truly ready.
        videoRef.current.onloadeddata = () => requestAnimationFrame(processVideo);
        videoRef.current.oncanplay = () => requestAnimationFrame(processVideo);
      }
    };

    if (mediaPipeInstance) {
      console.log('HolisticCanvas: MediaPipe instance is ready, starting video processing.');
      processVideo();
    }
    // No specific cleanup needed here for the loop, as requestAnimationFrame doesn't hold strong references.
    // The MediaPipe instance itself is handled by the hook's cleanup.
  }, [mediaPipeInstance, videoRef]);

  // Set canvas dimensions to match video
  useEffect(() => {
    if (canvasRef.current && videoRef.current) {
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
    }
  }, [videoRef.current.videoWidth, videoRef.current.videoHeight, videoRef]);


  if (isLoading) {
    return <div>Loading MediaPipe Holistic model...</div>;
  }

  if (error) {
    return <div>Error loading MediaPipe Holistic: {error.message}</div>;
  }

  return (
    <div style={{ position: 'relative', width: '640px', height: '480px' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          // Removed: transform: 'scaleX(-1)' // Not typically needed for pre-recorded videos
        }}
      />
    </div>
  );
};

export default HolisticCanvas;
// import { Results } from '@mediapipe/holistic';
// import React, { useEffect, useRef, useState } from 'react';
//
// import { useHolisticSingleton } from './hooks/useHolisticSingleton';
//
// // For type inference
//
// interface HolisticCanvasProps {
//   videoRef: React.RefObject<HTMLVideoElement>;
// }
//
// const HolisticCanvas: React.FC<HolisticCanvasProps> = ({ videoRef }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [holisticResults, setHolisticResults] = useState<Results | null>(null);
//
//   // Configuration for Holistic (e.g., enable hands, pose, etc.)
//   const holisticConfig = {
//     selfieMode: true,
//     modelComplexity: 1,
//     smoothLandmarks: true,
//     enableSegmentation: true,
//     smoothSegmentation: true,
//     refineFaceLandmarks: true,
//     minDetectionConfidence: 0.5,
//     minTrackingConfidence: 0.5
//   };
//
//   // The callback for MediaPipe results
//   const handleResults = (results: Results) => {
//     setHolisticResults(results);
//     // Draw the results on the canvas
//     if (canvasRef.current && videoRef.current) {
//       const canvasCtx = canvasRef.current.getContext('2d');
//       if (canvasCtx) {
//         canvasCtx.save();
//         canvasCtx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
//         canvasCtx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
//
//         // Simple example: draw a circle on the nose (just for visualization)
//         if (results.faceLandmarks && results.faceLandmarks.length > 0) {
//           const nose = results.faceLandmarks[1]; // Index 1 is often the nose tip
//           canvasCtx.beginPath();
//           canvasCtx.arc(
//             nose.x * canvasRef.current.width,
//             nose.y * canvasRef.current.height,
//             5, // radius
//             0,
//             2 * Math.PI
//           );
//           canvasCtx.fillStyle = 'blue';
//           canvasCtx.fill();
//         }
//         canvasCtx.restore();
//       }
//     }
//   };
//
//   // Use our singleton hook
//   const { mediaPipeInstance, isLoading, error } = useHolisticSingleton(
//     holisticConfig,
//     handleResults
//   );
//
//   // Effect to process video frames
//   useEffect(() => {
//     const processVideo = async () => {
//       if (mediaPipeInstance && videoRef.current && videoRef.current.readyState === 4) {
//         // Send the video frame to MediaPipe for processing
//         await mediaPipeInstance.send({ image: videoRef.current });
//         // Ask to process the next frame as soon as possible
//         requestAnimationFrame(processVideo);
//       } else if (mediaPipeInstance && videoRef.current && videoRef.current.readyState < 4) {
//         // If video isn't ready yet, wait for it
//         videoRef.current.onloadeddata = () => requestAnimationFrame(processVideo);
//       }
//     };
//
//     if (mediaPipeInstance) {
//       console.log('HolisticCanvas: MediaPipe instance is ready, starting video processing.');
//       processVideo();
//     }
//   }, [mediaPipeInstance, videoRef]);
//
//   // Set canvas dimensions to match video
//   useEffect(() => {
//     if (canvasRef.current && videoRef.current) {
//       canvasRef.current.width = videoRef.current.videoWidth;
//       canvasRef.current.height = videoRef.current.videoHeight;
//     }
//   }, [videoRef.current?.videoWidth, videoRef.current?.videoHeight]);
//
//   if (isLoading) {
//     return <div>Loading MediaPipe Holistic model...</div>;
//   }
//
//   if (error) {
//     return <div>Error loading MediaPipe Holistic: {error.message}</div>;
//   }
//
//   return (
//     <div style={{ position: 'relative', width: '640px', height: '480px' }}>
//       <canvas
//         ref={canvasRef}
//         style={{
//           position: 'absolute',
//           top: 0,
//           left: 0,
//           width: '100%',
//           height: '100%',
//           transform: 'scaleX(-1)' // Mirror to match selfie mode
//         }}
//       />
//       {/* Optional: Display some results for debugging */}
//       {/* <pre style={{ position: 'absolute', bottom: 0, left: 0, color: 'white', background: 'rgba(0,0,0,0.5)' }}>
//         {JSON.stringify(holisticResults?.faceLandmarks?.slice(0, 2), null, 2)}
//       </pre> */}
//     </div>
//   );
// };
//
// export default HolisticCanvas;
