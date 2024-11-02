class DocumentsController < ApplicationController
    def index
      @documents = Document.all
    end
  
    def new
      @document = Document.new
    end
  
    def create
      @document = Document.new(document_params)
      if @document.save
        redirect_to edit_document_path(@document)
      else
        render :new
      end
    end
  
    def show
      @document = Document.find(params[:id])
    end
  
    def edit
      @document = Document.find(params[:id])
    end
  
    def update
      @document = Document.find(params[:id])
      if annotate_pdf(@document, params[:text], params[:signature])
        redirect_to @document
      else
        render :edit
      end
    end
  
    private
  
    def document_params
      params.require(:document).permit(:pdf)
    end
  
    def annotate_pdf(document, text, signature_path)
      annotated_pdf_path = Rails.root.join("public", "uploads", "annotated_#{document.pdf.filename}")
  
      Prawn::Document.generate(annotated_pdf_path) do |pdf|
        # Import existing PDF
        pdf.start_new_page(template: document.pdf.path)
  
        # Add text if provided
        pdf.draw_text text, at: [100, 500] if text.present?
  
        # Add signature image if provided
        if signature_path.present?
          pdf.image signature_path.path, at: [100, 450], width: 100
        end
      end
  
      # Replace the old PDF with the new annotated one
      document.pdf = File.open(annotated_pdf_path)
      document.save
    end
  end
  