import { useFaceDetector } from './hooks/use-face-detector';
import { FillScreen } from './ui/fill-screen.tsx';
import UploadZone from './ui/upload-zone.tsx';

function MediaViewer() {
  const faceDetector = useFaceDetector();
  console.log(faceDetector);
  return <div>viewer</div>;
}

function App() {
  return (
    <>
      <FillScreen className={'bg-blue-400'}>
        <UploadZone>
          <MediaViewer />
        </UploadZone>
      </FillScreen>
    </>
  );
}

export default App;
