// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"
import "controllers"

import SignaturePad from 'signature_pad';

document.addEventListener('DOMContentLoaded', () => {
  const signatureCanvas = document.getElementById('signature-pad');
  if (signatureCanvas) {
    const signaturePad = new SignaturePad(signatureCanvas);

    document.getElementById('clear-signature').addEventListener('click', () => {
      signaturePad.clear();
    });

    document.getElementById('save-signature').addEventListener('click', () => {
      if (!signaturePad.isEmpty()) {
        const dataURL = signaturePad.toDataURL();
        document.getElementById('signature-input').value = dataURL;
      }
    });
  }
});
