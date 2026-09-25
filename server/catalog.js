import { loadData, saveData } from './payments.js';

export const TOOLS = [
  // GROUP 1: ORGANIZE & STRUCTURE (15 TOOLS)
  {
    id: 'merge-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single organized document in your chosen order.',
    category: 'organize',
    icon: 'Layers',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'split-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    category: 'organize',
    icon: 'Scissors',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'rotate-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Rotate PDF',
    description: 'Rotate individual pages or entire documents 90°, 180°, or 270° degrees.',
    category: 'organize',
    icon: 'RotateCw',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'remove-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Delete Pages',
    description: 'Remove unwanted pages, blank sheets, or specific page numbers from your PDF.',
    category: 'organize',
    icon: 'Trash2',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'extract-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Extract Pages',
    description: 'Extract specific pages or page intervals and save them as a separate PDF.',
    category: 'organize',
    icon: 'FileCheck',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'organize-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Organize Pages',
    description: 'Sort, reorder, and shuffle individual pages visually with intuitive drag and drop.',
    category: 'organize',
    icon: 'Sliders',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'sort-pdf-nup',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'N-Up Pages',
    description: 'Print multiple PDF pages per sheet (2-up, 4-up) to save paper and condense layout.',
    category: 'organize',
    icon: 'Columns2',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'crop-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Crop PDF',
    description: 'Trim page margins, custom crop bounding boxes, and adjust printable areas effortlessly.',
    category: 'organize',
    icon: 'Crop',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'compare-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Compare PDF',
    description: 'Inspect two versions of a PDF side-by-side with visual change highlights and diff tracking.',
    category: 'organize',
    icon: 'Columns2',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'AI Diff'
  },
  {
    id: 'alternate-mix',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Alternate & Mix',
    description: 'Merge pages alternating between two documents (e.g. odd and even scanner passes).',
    category: 'organize',
    icon: 'Layers2',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'split-in-half',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split in Half',
    description: 'Divide double-page book scans or two-column spreads into single vertical pages.',
    category: 'organize',
    icon: 'Scissors',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'reverse-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Reverse Pages',
    description: 'Invert document page order from last to first in one click.',
    category: 'organize',
    icon: 'RotateCcw',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'deskew-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Deskew PDF',
    description: 'Automatically detect tilted scans and straighten pages with computer vision.',
    category: 'organize',
    icon: 'Wrench',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'Auto Fix'
  },
  {
    id: 'duplicate-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Duplicate Pages',
    description: 'Duplicate selected pages or insert repeatable templates within your PDF.',
    category: 'organize',
    icon: 'Copy',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'split-by-size',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split by Size',
    description: 'Break down oversized PDF archives into smaller files under a specific MB target.',
    category: 'organize',
    icon: 'Archive',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },

  // GROUP 2: CONVERT TO PDF (13 TOOLS)
  {
    id: 'word-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to clean PDF format.',
    category: 'convert',
    icon: 'FileType',
    popular: true,
    acceptedTypes: ['.doc', '.docx'],
    proOnly: false
  },
  {
    id: 'jpg-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'JPG to PDF',
    description: 'Convert JPG, PNG, WEBP and BMP images into a unified, cleanly aligned PDF.',
    category: 'convert',
    icon: 'Images',
    popular: true,
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp'],
    proOnly: false
  },
  {
    id: 'png-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'PNG to PDF',
    description: 'Convert transparent PNG images and graphics into crystal-clear PDF documents.',
    category: 'convert',
    icon: 'Image',
    popular: false,
    acceptedTypes: ['.png'],
    proOnly: false
  },
  {
    id: 'excel-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets (XLSX, XLS) into professional, shareable PDF documents.',
    category: 'convert',
    icon: 'Sheet',
    popular: false,
    acceptedTypes: ['.xlsx', '.xls', '.csv'],
    proOnly: false
  },
  {
    id: 'ppt-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'PowerPoint to PDF',
    description: 'Convert PPT and PPTX presentation slides into high-fidelity, universally readable PDFs.',
    category: 'convert',
    icon: 'Presentation',
    popular: false,
    acceptedTypes: ['.pptx', '.ppt'],
    proOnly: false
  },
  {
    id: 'html-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'HTML to PDF',
    description: 'Convert live web URLs or custom raw HTML/CSS code directly into crisp PDF documents.',
    category: 'convert',
    icon: 'Code',
    popular: false,
    acceptedTypes: ['.html', '.htm', '.txt'],
    proOnly: false
  },
  {
    id: 'text-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Text to PDF',
    description: 'Convert plain text files (.txt) into standardized, formatted PDF files.',
    category: 'convert',
    icon: 'FileText',
    popular: false,
    acceptedTypes: ['.txt'],
    proOnly: false
  },
  {
    id: 'csv-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'CSV to PDF',
    description: 'Transform comma-separated CSV spreadsheets into styled, tabular PDF reports.',
    category: 'convert',
    icon: 'Table',
    popular: false,
    acceptedTypes: ['.csv'],
    proOnly: false
  },
  {
    id: 'markdown-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Markdown to PDF',
    description: 'Compile GitHub-flavored Markdown (.md) documents with syntax highlighting to PDF.',
    category: 'convert',
    icon: 'FileEdit',
    popular: false,
    acceptedTypes: ['.md', '.markdown'],
    proOnly: false
  },
  {
    id: 'svg-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'SVG to PDF',
    description: 'Convert vector SVG illustrations and blueprints into lossless vector PDFs.',
    category: 'convert',
    icon: 'Sparkles',
    popular: false,
    acceptedTypes: ['.svg'],
    proOnly: false
  },
  {
    id: 'rtf-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'RTF to PDF',
    description: 'Convert Rich Text Format (.rtf) documents to secure portable documents.',
    category: 'convert',
    icon: 'FileText',
    popular: false,
    acceptedTypes: ['.rtf'],
    proOnly: false
  },
  {
    id: 'epub-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'EPUB to PDF',
    description: 'Convert EPUB e-books and literature into printable, formatted PDF volumes.',
    category: 'convert',
    icon: 'Layers',
    popular: false,
    acceptedTypes: ['.epub'],
    proOnly: false
  },
  {
    id: 'tiff-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'TIFF to PDF',
    description: 'Merge multi-page TIFF faxes and high-density industrial scans into a compact PDF.',
    category: 'convert',
    icon: 'Images',
    popular: false,
    acceptedTypes: ['.tiff', '.tif'],
    proOnly: false
  },

  // GROUP 3: CONVERT FROM PDF (13 TOOLS)
  {
    id: 'pdf-to-word',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Word',
    description: 'Convert PDFs to editable Microsoft Word DOC and DOCX documents with high fidelity.',
    category: 'convert',
    icon: 'FileText',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-jpg',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to JPG',
    description: 'Extract all high-resolution embedded images or convert each PDF page into JPG.',
    category: 'convert',
    icon: 'Image',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-png',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to PNG',
    description: 'Export PDF pages as transparent, lossless PNG images for design and web.',
    category: 'convert',
    icon: 'Images',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-excel',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Excel',
    description: 'Extract financial tables, spreadsheets, and columnar data directly into Microsoft Excel.',
    category: 'convert',
    icon: 'Table',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'Pro'
  },
  {
    id: 'pdf-to-ppt',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to PowerPoint',
    description: 'Turn your PDF slides and presentations into fully editable Microsoft PowerPoint (PPTX) decks.',
    category: 'convert',
    icon: 'Presentation',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-text',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Text',
    description: 'Extract all raw text content from PDF without formatting for NLP and data pipelines.',
    category: 'convert',
    icon: 'FileText',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-csv',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to CSV',
    description: 'Extract tabular financial statements and line items into standard CSV format.',
    category: 'convert',
    icon: 'Table',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-html',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to HTML',
    description: 'Decompile PDF layouts into responsive HTML5 and CSS for web publishing.',
    category: 'convert',
    icon: 'Code',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-svg',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to SVG',
    description: 'Extract embedded vector paths, logos, and illustrations into scalable SVG files.',
    category: 'convert',
    icon: 'Sparkles',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-xml',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to XML',
    description: 'Convert PDF structure and tags into hierarchical XML data models.',
    category: 'convert',
    icon: 'Code',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-json',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to JSON',
    description: 'Parse forms, key-value pairs, and tabular data into machine-readable JSON.',
    category: 'convert',
    icon: 'HardDrive',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'API Ready'
  },
  {
    id: 'pdf-to-epub',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to EPUB',
    description: 'Convert fixed-layout PDFs into reflowable EPUB e-books for mobile e-readers.',
    category: 'convert',
    icon: 'Layers',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-zip',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'Extract Images to ZIP',
    description: 'Rip all embedded bitmap photos and vectors into a zipped archive.',
    category: 'convert',
    icon: 'Archive',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },

  // GROUP 4: EDIT, ANNOTATE & FORMAT (13 TOOLS)
  {
    id: 'edit-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Edit PDF',
    description: 'Add text annotations, shapes, highlights, comments, and callouts directly onto PDF pages.',
    category: 'edit',
    icon: 'FileEdit',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'watermark-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Watermark PDF',
    description: 'Stamp customized text or image watermarks across all pages with custom transparency.',
    category: 'edit',
    icon: 'Stamp',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'page-numbers',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Page Numbers',
    description: 'Add custom page numbers with complete control over headers, footers, typography, and format.',
    category: 'edit',
    icon: 'Hash',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'header-footer',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Header & Footer',
    description: 'Add dynamic title, author, date, and project headers and footers to every sheet.',
    category: 'edit',
    icon: 'Type',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'bates-numbering',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Bates Numbering',
    description: 'Apply sequential legal indexing and Bates stamping for court and litigation filing.',
    category: 'edit',
    icon: 'Hash',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'Legal'
  },
  {
    id: 'add-shape',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Shapes & Arrows',
    description: 'Draw rectangles, circles, arrows, callout banners, and geometric highlights.',
    category: 'edit',
    icon: 'PenTool',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'highlight-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Highlight PDF',
    description: 'Mark important paragraphs with fluorescent yellow, green, or blue highlights.',
    category: 'edit',
    icon: 'FileEdit',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'freehand-draw',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Freehand Drawing',
    description: 'Sketch, annotate, and write handwritten notes with adjustable stylus or brush.',
    category: 'edit',
    icon: 'PenTool',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'add-barcode',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Barcode / QR',
    description: 'Generate and stamp dynamic QR codes or EAN/UPC barcodes onto your documents.',
    category: 'edit',
    icon: 'Sparkles',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'add-hyperlink',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Hyperlink',
    description: 'Insert clickable URL hyperlinks and cross-page anchor jumps into PDF text.',
    category: 'edit',
    icon: 'Globe',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'remove-annotations',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Remove Annotations',
    description: 'Strip all existing comments, pop-up sticky notes, and drawing markups.',
    category: 'edit',
    icon: 'Trash2',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'whiteout-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Whiteout PDF',
    description: 'Erase unwanted text, smudges, or confidential paragraphs with precision whiteout tape.',
    category: 'edit',
    icon: 'FileText',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'callout-notes',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Callout Notes',
    description: 'Place collapsible sticky notes, reviewer instructions, and feedback comments.',
    category: 'edit',
    icon: 'FileEdit',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },

  // GROUP 5: SECURITY, SIGN & COMPLIANCE (12 TOOLS)
  {
    id: 'sign-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Sign PDF',
    description: 'Sign documents digitally yourself or request certified electronic signatures.',
    category: 'security',
    icon: 'PenTool',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false,
    badge: 'Legally Valid'
  },
  {
    id: 'request-signatures',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Request Signatures',
    description: 'Send documents out for multi-party electronic signatures with audit log trail.',
    category: 'security',
    icon: 'Mail',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'Pro'
  },
  {
    id: 'protect-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with standard AES 256-bit password security.',
    category: 'security',
    icon: 'Lock',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'unlock-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Unlock PDF',
    description: 'Remove PDF password security to restore full viewing, copying, and printing.',
    category: 'security',
    icon: 'Unlock',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'redact-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Redact PDF',
    description: 'Permanently censor sensitive text, confidential legal clauses, SSNs, and credit numbers.',
    category: 'security',
    icon: 'EyeOff',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'PII Safe'
  },
  {
    id: 'verify-signature',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Verify Signatures',
    description: 'Inspect cryptographic X.509 digital certificates and check signature integrity.',
    category: 'security',
    icon: 'ShieldCheck',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'pdf-to-pdfa',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'PDF to PDF/A',
    description: 'Transform standard PDFs into ISO 19005 compliant archivable format for enterprise storage.',
    category: 'security',
    icon: 'Archive',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'ISO Compliant'
  },
  {
    id: 'remove-metadata',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Remove Metadata',
    description: 'Scrub author name, GPS tags, editing software, and document revision history.',
    category: 'security',
    icon: 'Shield',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'edit-metadata',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Edit Metadata',
    description: 'Update PDF Title, Author, Subject, Keywords, and Copyright metadata fields.',
    category: 'security',
    icon: 'FileText',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'lock-printing',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Lock Permissions',
    description: 'Set permissions to prohibit printing, text copying, and form extraction.',
    category: 'security',
    icon: 'KeyRound',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'time-stamp-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Timestamp PDF',
    description: 'Apply trusted RFC 3161 cryptographic timestamp to prove document existence time.',
    category: 'security',
    icon: 'Lock',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true
  },
  {
    id: 'sanitize-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Sanitize PDF',
    description: 'Deep cleanse malicious embedded JavaScript, external link exploits, and launch actions.',
    category: 'security',
    icon: 'Shield',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'SecOps'
  },

  // GROUP 6: OPTIMIZE, REPAIR & ADVANCED AI (12 TOOLS)
  {
    id: 'compress-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality and resolution.',
    category: 'optimize',
    icon: 'Minimize2',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'ocr-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Neural OCR',
    description: 'Turn scanned documents and images into searchable, selectable, and editable text.',
    category: 'optimize',
    icon: 'Search',
    popular: true,
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg'],
    proOnly: true,
    badge: 'AI Neural'
  },
  {
    id: 'flatten-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Flatten PDF',
    description: 'Flatten interactive form fields and transparent annotations into non-editable raster content.',
    category: 'optimize',
    icon: 'Layers2',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'repair-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Repair PDF',
    description: 'Analyze, rebuild broken cross-reference tables, and recover corrupted or unreadable PDFs.',
    category: 'optimize',
    icon: 'Wrench',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'Auto Repair'
  },
  {
    id: 'grayscale-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Grayscale PDF',
    description: 'Convert full-color documents to clean black-and-white to drastically cut toner and size.',
    category: 'optimize',
    icon: 'Sliders',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'resize-page',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Resize Page Size',
    description: 'Change paper dimensions to standard A4, US Letter, A3, Legal, or custom dimensions.',
    category: 'optimize',
    icon: 'Crop',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'ai-summarize',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Summarize PDF',
    description: 'Generate concise executive summaries, key bullet points, and actionable takeaways.',
    category: 'optimize',
    icon: 'Sparkles',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'AI Pro'
  },
  {
    id: 'ai-translate',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Translate PDF',
    description: 'Translate entire PDF documents into 50+ languages while preserving layout and style.',
    category: 'optimize',
    icon: 'Globe',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'AI Pro'
  },
  {
    id: 'ai-chat-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Chat with PDF',
    description: 'Ask questions, query tables, and extract insights interactively from your document.',
    category: 'optimize',
    icon: 'Sparkles',
    popular: true,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'AI Pro'
  },
  {
    id: 'extract-tables',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Table Extractor',
    description: 'Automatically detect table borders, cell grids, and numerical datasets into Excel/CSV.',
    category: 'optimize',
    icon: 'Table',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: true,
    badge: 'AI Pro'
  },
  {
    id: 'invert-colors',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Dark Mode Invert',
    description: 'Invert colors for night reading and reduce eye fatigue for high-contrast accessibility.',
    category: 'optimize',
    icon: 'Eye',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false
  },
  {
    id: 'optimize-web',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Linearize for Web',
    description: 'Fast Web View optimization for instantaneous streaming and viewing in web browsers.',
    category: 'optimize',
    icon: 'Zap',
    popular: false,
    acceptedTypes: ['.pdf'],
    proOnly: false,
    badge: 'Fast Stream'
  }
];

export function logToolUsage(toolId, userId, success = true) {
  const data = loadData();
  if (!data.toolUsage) data.toolUsage = [];
  const tool = data.toolUsage.find(t => t.toolId === toolId);
  if (tool) {
    tool.count = (tool.count || 0) + 1;
  } else {
    data.toolUsage.push({
      toolId,
      name: toolId,
      count: 1,
      category: 'general',
      successRate: 99.0
    });
  }

  // Update user usage
  if (userId) {
    const user = data.users.find(u => u.id === userId);
    if (user) {
      if (!user.usage) user.usage = { totalJobs: 0, todayJobs: 0, storageUsedMB: 0 };
      user.usage.totalJobs = (user.usage.totalJobs || 0) + 1;
      user.usage.todayJobs = (user.usage.todayJobs || 0) + 1;
    }
  }

  // Update today dailyStats
  const todayStr = new Date().toISOString().split('T')[0];
  let todayStat = (data.dailyStats || []).find(d => d.date === todayStr);
  if (!todayStat) {
    todayStat = {
      date: todayStr,
      users: 1,
      jobs: 1,
      failedJobs: success ? 0 : 1,
      revenue: 0,
      payments: 0
    };
    data.dailyStats.push(todayStat);
  } else {
    todayStat.jobs += 1;
    if (!success) todayStat.failedJobs += 1;
  }

  saveData(data);
}
