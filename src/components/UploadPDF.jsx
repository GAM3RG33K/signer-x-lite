import React from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import 'filepond/dist/filepond.min.css';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondPluginImagePreview);

const UploadPDF = ({ onUpload }) => {
  return (
    <div>
      <FilePond
        onupdatefiles={onUpload}
        allowMultiple={false}
        acceptedFileTypes={['application/pdf']}
        labelIdle='Drag & Drop your PDF or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  );
};

export default UploadPDF;
