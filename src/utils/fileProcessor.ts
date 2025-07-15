import { FileUploadResult } from '../types/education';

// Define the structure of knowledge base files
interface KnowledgeBaseFile {
  id?: string | number;
  filename: string;
  content: string;
  type: string;
  size: number;
  uploadedAt: string;  // This matches FileUploadResult's extractedAt
  tags?: string[];
}

export class FileProcessor {
  private supportedTypes = {
    // PDF files
    'application/pdf': 'pdf',
    // Word documents
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'docx',
    // Images - expanded support
    'image/png': 'image',
    'image/jpeg': 'image',
    'image/jpg': 'image',
    'image/gif': 'image',
    'image/bmp': 'image',
    'image/webp': 'image',
    'image/tiff': 'image',
    'image/tif': 'image',
    'image/jfif': 'image',
    'image/pjpeg': 'image',
    'image/svg+xml': 'image',
    'image/x-icon': 'image',
    'image/vnd.microsoft.icon': 'image',
    // Text files
    'text/plain': 'text',
    'text/html': 'text',
    'text/markdown': 'text',
    'text/csv': 'text'
  } as const;

  async processFile(file: File): Promise<FileUploadResult> {
    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (!this.isSupported(file)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }

    const fileType = this.supportedTypes[file.type as keyof typeof this.supportedTypes];
    let content: string;

    try {
      switch (fileType) {
        case 'pdf':
          content = await this.extractPDFText(file);
          break;
        case 'docx':
          content = await this.extractDOCXText(file);
          break;
        case 'image':
          content = await this.extractImageText(file);
          break;
        case 'text':
          content = await this.extractPlainText(file);
          break;
        default:
          throw new Error(`Unsupported file type: ${fileType}`);
      }

      const result: FileUploadResult = {
        filename: file.name,
        content,
        type: fileType,
        size: file.size,
        extractedAt: new Date().toISOString()
      };

      // Store in knowledge base
      await this.storeInKnowledgeBase(result);

      return result;
    } catch (error) {
      console.error('File processing failed:', error);
      throw new Error(`Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private isSupported(file: File): boolean {
    return file.type in this.supportedTypes;
  }

  private async extractPDFText(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const text = await this.extractTextWithPDFJS(arrayBuffer);
      return text;
    } catch (error) {
      console.error('PDF extraction failed:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  private async extractTextWithPDFJS(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      const decoder = new TextDecoder();
      const text = decoder.decode(arrayBuffer);
      
      const lines = text.split('\n').filter(line => 
        line.trim().length > 0 && 
        !line.includes('obj') && 
        !line.includes('endobj') &&
        /[a-zA-Z]/.test(line)
      );
      
      return lines.join('\n').substring(0, 10000);
    } catch (error) {
      return 'PDF content could not be extracted. Please ensure the PDF contains searchable text.';
    }
  }

  private async extractDOCXText(file: File): Promise<string> {
    try {
      const arrayBuffer = await file.arrayBuffer();
      return await this.extractTextFromDOCX(arrayBuffer);
    } catch (error) {
      console.error('DOCX extraction failed:', error);
      throw new Error('Failed to extract text from DOCX file');
    }
  }

  private async extractTextFromDOCX(arrayBuffer: ArrayBuffer): Promise<string> {
    try {
      const decoder = new TextDecoder();
      const text = decoder.decode(arrayBuffer);
      
      const textContent = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g);
      if (textContent) {
        return textContent
          .map(match => match.replace(/<[^>]*>/g, ''))
          .join(' ')
          .substring(0, 10000);
      }
      
      return 'DOCX content could not be extracted. Please save as PDF or plain text.';
    } catch (error) {
      return 'DOCX content could not be extracted. Please save as PDF or plain text.';
    }
  }

  private async extractImageText(file: File): Promise<string> {
    try {
      return await this.performOCR(file);
    } catch (error) {
      console.error('OCR failed:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  private async performOCR(file: File): Promise<string> {
    try {
      return `OCR processing not yet implemented for ${file.name}. This image would be processed using Tesseract.js or a cloud OCR service to extract text content. The extracted text would then be available for queries.`;
    } catch (error) {
      throw new Error('OCR processing failed');
    }
  }

  private async extractPlainText(file: File): Promise<string> {
    try {
      const text = await file.text();
      return text.substring(0, 50000);
    } catch (error) {
      console.error('Plain text extraction failed:', error);
      throw new Error('Failed to read text file');
    }
  }

  private async storeInKnowledgeBase(result: FileUploadResult): Promise<void> {
    try {
      // Get existing knowledge base files
      const existingFiles: KnowledgeBaseFile[] = JSON.parse(
        localStorage.getItem('knowledge-base-files') || '[]'
      );
      
      // Find existing file index
      const existingIndex = existingFiles.findIndex(
        f => f.filename === result.filename
      );
      
      if (existingIndex >= 0) {
        // Update existing file
        existingFiles[existingIndex] = {
          ...existingFiles[existingIndex], // Preserve ID and tags
          filename: result.filename,
          content: result.content,
          type: result.type,
          size: result.size,
          uploadedAt: result.extractedAt // Map extractedAt to uploadedAt
        };
      } else {
        // Add new file
        existingFiles.push({
          filename: result.filename,
          content: result.content,
          type: result.type,
          size: result.size,
          uploadedAt: result.extractedAt, // Map extractedAt to uploadedAt
          id: Date.now() + Math.random(),
          tags: ['education-upload']
        });
      }
      
      // Save to localStorage
      localStorage.setItem('knowledge-base-files', JSON.stringify(existingFiles));
      
      console.log('File stored in knowledge base:', result.filename);
    } catch (error) {
      console.error('Failed to store in knowledge base:', error);
      throw new Error('Failed to store file in knowledge base');
    }
  }

  getSupportedFileTypes(): string[] {
    return [
      '.pdf', '.docx', '.doc',
      '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.tiff', '.tif', '.jfif', '.svg', '.ico',
      '.txt', '.html', '.md', '.csv'
    ];
  }

  getSupportedMimeTypes(): string[] {
    return Object.keys(this.supportedTypes);
  }

  getMaxFileSize(): number {
    return 10 * 1024 * 1024;
  }
}

export const fileProcessor = new FileProcessor();