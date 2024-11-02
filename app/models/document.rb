class Document < ApplicationRecord
    mount_uploader :pdf, PdfUploader
end
