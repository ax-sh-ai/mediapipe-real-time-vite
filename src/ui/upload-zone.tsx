import { PropsWithChildren, useCallback } from 'react';
import Dropzone from 'react-dropzone';

import { FillScreen } from './fill-screen.tsx';

export default function UploadZone({ children }: PropsWithChildren) {
  const onDrop = useCallback(
    <T extends File>(
      acceptedFiles: T[] // fileRejections: FileRejection[], event: React.DragEvent<HTMLElement>
    ) => {
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();

        reader.onabort = () => console.log('file reading was aborted');
        reader.onerror = () => console.log('file reading has failed');
        reader.onload = () => {
          // Do whatever you want with the file contents
          const binaryStr = reader.result;
          console.log(binaryStr);
        };
        reader.readAsArrayBuffer(file);
      });
    },
    []
  );
  return (
    <Dropzone onDrop={onDrop}>
      {({ getRootProps, getInputProps }) => (
        <FillScreen className={'grid place-content-center'}>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          {children}
        </FillScreen>
      )}
    </Dropzone>
  );
}
