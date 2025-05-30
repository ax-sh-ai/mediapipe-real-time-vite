import { FillScreen } from './ui/fill-screen.tsx';
import { MediaViewer } from './ui/media-viewer.tsx';
import UploadZone from './ui/upload-zone.tsx';
import { HolisticApp } from './holistic/holistic-app.tsx';

function App() {
  return <HolisticApp/>
  return (
    <FillScreen className={'flex'}>
      <UploadZone>
        <MediaViewer />
      </UploadZone>
    </FillScreen>
  );
}

export default App;
