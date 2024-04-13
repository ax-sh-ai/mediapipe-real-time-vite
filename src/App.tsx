import { useFaceDetector } from './hooks/use-face-detector';
import UploadZone from './ui/upload-zone.tsx';

function App() {
  const faceDetector = useFaceDetector();
  console.log(faceDetector);

  // faceDetector.detect()
  return (
    <>
      <UploadZone>hooo</UploadZone>
    </>
  );
}

export default App;
