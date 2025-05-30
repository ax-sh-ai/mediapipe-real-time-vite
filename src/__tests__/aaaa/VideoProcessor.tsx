import React from 'react';
import { useMediaPipe } from './useMediaPipe';

const VideoProcessor = () => {
  const {
    videoRef,
    canvasRef,
    processVideo,
    loading,
    error
  } = useMediaPipe();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      processVideo(e.target.files[0]);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        disabled={loading}
      />

      {error && <div className="error">{error}</div>}

      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          playsInline
          hidden
        />
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', left: 0, top: 0 }}
        />
      </div>
    </div>
  );
};

export default VideoProcessor;