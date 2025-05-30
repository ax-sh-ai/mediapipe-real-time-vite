// src/App.tsx
import  { useEffect, useRef, useState } from 'react';

import HolisticCanvas from './HolisticCanvas';

// Define a sample video URL. You can replace this with your own video.
// Ensure the video is CORS-enabled if it's not from your own domain.
const SAMPLE_VIDEO_URL = 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4';
// Another option for a shorter video:
// const SAMPLE_VIDEO_URL = 'https://archive.org/download/BigBuckBunny_124/Content/big_buck_bunny_720p_stereo.mp4';

export function HolisticApp() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false); // Renamed from cameraInitialized
  const [videoError, setVideoError] = useState<string | null>(null);
  const [showHolistic, setShowHolistic] = useState(true);

  // Effect to load and play the video
  useEffect(() => {
    if (videoRef.current) {
      // Set the video source
      videoRef.current.src = SAMPLE_VIDEO_URL;
      videoRef.current.loop = true; // Loop the video for continuous processing
      videoRef.current.muted = true; // Mute it for autoplay
      videoRef.current.crossOrigin = "anonymous"; // Important for canvas drawing if video is from different origin

      const handleVideoLoaded = async () => {
        console.log('Video metadata loaded.');
        try {
          await videoRef.current?.play();
          setVideoLoaded(true);
          setVideoError(null);
          console.log('Video started playing.');
        } catch (err: any) {
          console.error('Error playing video:', err);
          setVideoLoaded(false);
          setVideoError(`Failed to play video: ${err.message || 'Unknown error'}. Make sure autoplay is allowed.`);
        }
      };

      const handleError = (e: Event) => {
        console.error('Video error:', e);
        setVideoLoaded(false);
        setVideoError('Video loading failed. Check the URL and network.');
      };

      // Listen for when the video is ready to play
      videoRef.current.addEventListener('loadeddata', handleVideoLoaded);
      videoRef.current.addEventListener('error', handleError);

      // Cleanup event listeners
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadeddata', handleVideoLoaded);
          videoRef.current.removeEventListener('error', handleError);
        }
      };
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className={'bg-black'} style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>MediaPipe Singleton Hook Demo (Video URL)</h1>

      <button onClick={() => setShowHolistic(!showHolistic)}>
        {showHolistic ? 'Hide Holistic Viewer' : 'Show Holistic Viewer'}
      </button>

      {videoError && <p style={{ color: 'red' }}>{videoError}</p>}

      <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
        <video
          ref={videoRef}
          style={{ width: '640px', height: '480px', background: 'black' }}
          hidden={!videoLoaded} // Hide video until it's ready
          playsInline // Important for mobile devices
        />
        {videoLoaded && showHolistic && (
          <HolisticCanvas videoRef={videoRef} />
        )}
        {!videoLoaded && !videoError && <p>Loading video...</p>}
      </div>

      <p style={{ marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>
        Open your browser's developer console. Observe the "Holistic: Starting up..." and "Holistic: Last person leaving..." messages.
        <br/>
        The MediaPipe model is now processing frames from the loaded video URL instead of your webcam.
      </p>
    </div>
  );
}
//
// export function HolisticApp() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const [cameraInitialized, setCameraInitialized] = useState(false);
//   const [showHolistic, setShowHolistic] = useState(true); // To demonstrate mounting/unmounting
//
//   // Initialize camera
//   useEffect(() => {
//     const enableCamera = async () => {
//       if (videoRef.current) {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//           videoRef.current.srcObject = stream;
//           await videoRef.current.play();
//           setCameraInitialized(true);
//         } catch (err) {
//           console.error('Error accessing camera:', err);
//           alert('Could not access camera. Please allow camera permissions.');
//         }
//       }
//     };
//
//     enableCamera();
//
//     // Cleanup: Stop camera stream when component unmounts
//     return () => {
//       if (videoRef.current && videoRef.current.srcObject) {
//         (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
//       }
//     };
//   }, []);
//
//   return (
//     <div style={{ textAlign: 'center', fontFamily: 'Arial, sans-serif', padding: '20px' }}>
//       <h1>Simple MediaPipe Singleton Hook Demo (Holistic)</h1>
//
//       <button onClick={() => setShowHolistic(!showHolistic)}>
//         {showHolistic ? 'Hide Holistic Viewer' : 'Show Holistic Viewer'}
//       </button>
//
//       <div style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}>
//         <video
//           ref={videoRef}
//           style={{ width: '640px', height: '480px', background: 'black' }}
//           hidden={!cameraInitialized}
//           playsInline // Important for iOS devices
//         />
//         {cameraInitialized && showHolistic && <HolisticCanvas videoRef={videoRef} />}
//         {!cameraInitialized && <p>Waiting for camera...</p>}
//       </div>
//
//       <p style={{ marginTop: '20px', maxWidth: '600px', margin: '20px auto' }}>
//         Open your browser's developer console. Observe the "Holistic: Starting up..." and "Holistic:
//         Last person leaving..." messages.
//         <br />
//         Clicking the button to hide/show the viewer will trigger the cleanup and re-initialization
//         because it's the *only* component using the `useHolisticSingleton` hook. If you had multiple
//         components simultaneously using this hook, it would only initialize the MediaPipe instance
//         once, and dispose of it only when the *last* component unmounts.
//       </p>
//     </div>
//   );
// }
