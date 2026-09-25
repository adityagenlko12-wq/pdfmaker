import {
  Layers, Scissors, Minimize2, FileText, FileType, Search, Lock, Unlock,
  RotateCw, RotateCcw, Stamp, PenTool, Image, Images, Table, Sheet,
  Presentation, FileSpreadsheet, Hash, FileEdit, Crop, EyeOff, Layers2,
  Wrench, Columns2, Code, Archive, Trash2, FileCheck, Sliders, Copy,
  Globe, HardDrive, Type, Mail, Shield, ShieldCheck, KeyRound, Sparkles,
  Zap, Eye, ScanText, ScanLine, Languages, Receipt, FileSearch, FileScan
} from 'lucide-react';

export const TOOLS_CONFIG = [
  // ==========================================
  // GROUP 1: ORGANIZE & STRUCTURE (15 TOOLS)
  // ==========================================
  {
    id: 'merge-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into a single organized document in your chosen order.',
    icon: Layers,
    color: 'from-blue-600 to-indigo-600',
    category: 'organize',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'split-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split PDF',
    description: 'Separate one page or a whole set for easy conversion into independent PDF files.',
    icon: Scissors,
    color: 'from-indigo-500 to-purple-600',
    category: 'organize',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'rotate-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Rotate PDF',
    description: 'Rotate individual pages or entire documents 90°, 180°, or 270° degrees.',
    icon: RotateCw,
    color: 'from-blue-500 to-teal-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'remove-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Delete Pages',
    description: 'Remove unwanted pages, blank sheets, or specific page numbers from your PDF.',
    icon: Trash2,
    color: 'from-rose-500 to-red-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'extract-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Extract Pages',
    description: 'Extract specific pages or page intervals and save them as a separate PDF.',
    icon: FileCheck,
    color: 'from-emerald-500 to-teal-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'organize-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Organize Pages',
    description: 'Sort, reorder, and shuffle individual pages visually with intuitive drag and drop.',
    icon: Sliders,
    color: 'from-amber-500 to-orange-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'sort-pdf-nup',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'N-Up Pages',
    description: 'Print multiple PDF pages per sheet (2-up, 4-up) to save paper and condense layout.',
    icon: Columns2,
    color: 'from-violet-500 to-purple-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'crop-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Crop PDF',
    description: 'Trim page margins, custom crop bounding boxes, and adjust printable areas effortlessly.',
    icon: Crop,
    color: 'from-cyan-500 to-blue-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'compare-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Compare PDF',
    description: 'Inspect two versions of a PDF side-by-side with visual change highlights and diff tracking.',
    icon: Columns2,
    color: 'from-purple-500 to-indigo-600',
    category: 'organize',
    badge: 'AI Diff',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'alternate-mix',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Alternate & Mix',
    description: 'Merge pages alternating between two documents (e.g. odd and even scanner passes).',
    icon: Layers2,
    color: 'from-blue-600 to-cyan-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'split-in-half',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split in Half',
    description: 'Divide double-page book scans or two-column spreads into single vertical pages.',
    icon: Scissors,
    color: 'from-pink-500 to-rose-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'reverse-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Reverse Pages',
    description: 'Invert document page order from last to first in one click.',
    icon: RotateCcw,
    color: 'from-teal-500 to-emerald-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'deskew-pdf',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Deskew PDF',
    description: 'Automatically detect tilted scans and straighten pages with computer vision.',
    icon: Wrench,
    color: 'from-amber-500 to-yellow-600',
    category: 'organize',
    badge: 'Auto Fix',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'duplicate-pages',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Duplicate Pages',
    description: 'Duplicate selected pages or insert repeatable templates within your PDF.',
    icon: Copy,
    color: 'from-indigo-500 to-blue-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'split-by-size',
    step: 1,
    stepName: 'Organize & Structure',
    name: 'Split by Size',
    description: 'Break down oversized PDF archives into smaller files under a specific MB target.',
    icon: Archive,
    color: 'from-rose-500 to-pink-600',
    category: 'organize',
    acceptedTypes: ['.pdf']
  },

  // ==========================================
  // GROUP 2: CONVERT TO PDF (13 TOOLS)
  // ==========================================
  {
    id: 'word-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Word to PDF',
    description: 'Make DOC and DOCX files easy to read by converting them to clean PDF format.',
    icon: FileType,
    color: 'from-cyan-500 to-blue-600',
    category: 'convert',
    badge: 'Popular',
    acceptedTypes: ['.doc', '.docx']
  },
  {
    id: 'jpg-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'JPG to PDF',
    description: 'Convert JPG, PNG, WEBP and BMP images into a unified, cleanly aligned PDF.',
    icon: Images,
    color: 'from-rose-500 to-orange-500',
    category: 'convert',
    badge: 'Popular',
    acceptedTypes: ['.jpg', '.jpeg', '.png', '.webp', '.bmp']
  },
  {
    id: 'png-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'PNG to PDF',
    description: 'Convert transparent PNG images and graphics into crystal-clear PDF documents.',
    icon: Image,
    color: 'from-emerald-500 to-teal-600',
    category: 'convert',
    acceptedTypes: ['.png']
  },
  {
    id: 'excel-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets (XLSX, XLS) into professional, shareable PDF documents.',
    icon: Sheet,
    color: 'from-emerald-600 to-green-600',
    category: 'convert',
    acceptedTypes: ['.xlsx', '.xls', '.csv']
  },
  {
    id: 'ppt-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'PowerPoint to PDF',
    description: 'Convert PPT and PPTX presentation slides into high-fidelity, universally readable PDFs.',
    icon: Presentation,
    color: 'from-orange-500 to-red-600',
    category: 'convert',
    acceptedTypes: ['.pptx', '.ppt']
  },
  {
    id: 'html-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'HTML to PDF',
    description: 'Convert live web URLs or custom raw HTML/CSS code directly into crisp PDF documents.',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    category: 'convert',
    badge: 'Web Render',
    acceptedTypes: ['.html', '.htm', '.txt']
  },
  {
    id: 'text-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Text to PDF',
    description: 'Convert plain text files (.txt) into standardized, formatted PDF files.',
    icon: FileText,
    color: 'from-gray-600 to-gray-800',
    category: 'convert',
    acceptedTypes: ['.txt']
  },
  {
    id: 'csv-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'CSV to PDF',
    description: 'Transform comma-separated CSV spreadsheets into styled, tabular PDF reports.',
    icon: Table,
    color: 'from-emerald-500 to-cyan-600',
    category: 'convert',
    acceptedTypes: ['.csv']
  },
  {
    id: 'markdown-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'Markdown to PDF',
    description: 'Compile GitHub-flavored Markdown (.md) documents with syntax highlighting to PDF.',
    icon: FileEdit,
    color: 'from-purple-500 to-violet-600',
    category: 'convert',
    acceptedTypes: ['.md', '.markdown']
  },
  {
    id: 'svg-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'SVG to PDF',
    description: 'Convert vector SVG illustrations and blueprints into lossless vector PDFs.',
    icon: Sparkles,
    color: 'from-amber-500 to-orange-600',
    category: 'convert',
    acceptedTypes: ['.svg']
  },
  {
    id: 'rtf-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'RTF to PDF',
    description: 'Convert Rich Text Format (.rtf) documents to secure portable documents.',
    icon: FileText,
    color: 'from-blue-500 to-indigo-500',
    category: 'convert',
    acceptedTypes: ['.rtf']
  },
  {
    id: 'epub-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'EPUB to PDF',
    description: 'Convert EPUB e-books and literature into printable, formatted PDF volumes.',
    icon: Layers,
    color: 'from-pink-500 to-purple-600',
    category: 'convert',
    acceptedTypes: ['.epub']
  },
  {
    id: 'tiff-to-pdf',
    step: 2,
    stepName: 'Convert to PDF',
    name: 'TIFF to PDF',
    description: 'Merge multi-page TIFF faxes and high-density industrial scans into a compact PDF.',
    icon: Images,
    color: 'from-teal-600 to-emerald-600',
    category: 'convert',
    acceptedTypes: ['.tiff', '.tif']
  },

  // ==========================================
  // GROUP 3: CONVERT FROM PDF (13 TOOLS)
  // ==========================================
  {
    id: 'pdf-to-word',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Word',
    description: 'Convert PDFs to editable Microsoft Word DOC and DOCX documents with high fidelity.',
    icon: FileText,
    color: 'from-blue-600 to-cyan-600',
    category: 'convert',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-jpg',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to JPG',
    description: 'Extract all high-resolution embedded images or convert each PDF page into JPG.',
    icon: Image,
    color: 'from-orange-500 to-amber-600',
    category: 'convert',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-png',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to PNG',
    description: 'Export PDF pages as transparent, lossless PNG images for design and web.',
    icon: Images,
    color: 'from-emerald-500 to-teal-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-excel',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Excel',
    description: 'Extract financial tables, spreadsheets, and columnar data directly into Microsoft Excel.',
    icon: Table,
    color: 'from-emerald-600 to-green-600',
    category: 'convert',
    badge: 'Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-ppt',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to PowerPoint',
    description: 'Turn your PDF slides and presentations into fully editable Microsoft PowerPoint (PPTX) decks.',
    icon: Presentation,
    color: 'from-orange-600 to-amber-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-text',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to Text',
    description: 'Extract all raw text content from PDF without formatting for NLP and data pipelines.',
    icon: FileText,
    color: 'from-gray-500 to-slate-700',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-csv',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to CSV',
    description: 'Extract tabular financial statements and line items into standard CSV format.',
    icon: Table,
    color: 'from-emerald-600 to-teal-700',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-html',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to HTML',
    description: 'Decompile PDF layouts into responsive HTML5 and CSS for web publishing.',
    icon: Code,
    color: 'from-blue-500 to-indigo-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-svg',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to SVG',
    description: 'Extract embedded vector paths, logos, and illustrations into scalable SVG files.',
    icon: Sparkles,
    color: 'from-purple-500 to-pink-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-xml',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to XML',
    description: 'Convert PDF structure and tags into hierarchical XML data models.',
    icon: Code,
    color: 'from-cyan-600 to-blue-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-json',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to JSON',
    description: 'Parse forms, key-value pairs, and tabular data into machine-readable JSON.',
    icon: HardDrive,
    color: 'from-amber-600 to-orange-600',
    category: 'convert',
    badge: 'API Ready',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-epub',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'PDF to EPUB',
    description: 'Convert fixed-layout PDFs into reflowable EPUB e-books for mobile e-readers.',
    icon: Layers,
    color: 'from-rose-500 to-purple-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-zip',
    step: 3,
    stepName: 'Convert from PDF',
    name: 'Extract Images to ZIP',
    description: 'Rip all embedded bitmap photos and vectors into a zipped archive.',
    icon: Archive,
    color: 'from-violet-600 to-indigo-600',
    category: 'convert',
    acceptedTypes: ['.pdf']
  },

  // ==========================================
  // GROUP 4: EDIT, ANNOTATE & FORMAT (13 TOOLS)
  // ==========================================
  {
    id: 'edit-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Edit PDF',
    description: 'Add text annotations, shapes, highlights, comments, and callouts directly onto PDF pages.',
    icon: FileEdit,
    color: 'from-indigo-500 to-purple-600',
    category: 'edit',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'watermark-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Watermark PDF',
    description: 'Stamp customized text or image watermarks across all pages with custom transparency.',
    icon: Stamp,
    color: 'from-violet-500 to-purple-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'page-numbers',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Page Numbers',
    description: 'Add custom page numbers with complete control over headers, footers, typography, and format.',
    icon: Hash,
    color: 'from-blue-500 to-indigo-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'header-footer',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Header & Footer',
    description: 'Add dynamic title, author, date, and project headers and footers to every sheet.',
    icon: Type,
    color: 'from-teal-500 to-cyan-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'bates-numbering',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Bates Numbering',
    description: 'Apply sequential legal indexing and Bates stamping for court and litigation filing.',
    icon: Hash,
    color: 'from-amber-600 to-orange-600',
    category: 'edit',
    badge: 'Legal',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'add-shape',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Shapes & Arrows',
    description: 'Draw rectangles, circles, arrows, callout banners, and geometric highlights.',
    icon: PenTool,
    color: 'from-rose-500 to-pink-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'highlight-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Highlight PDF',
    description: 'Mark important paragraphs with fluorescent yellow, green, or blue highlights.',
    icon: FileEdit,
    color: 'from-yellow-500 to-amber-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'freehand-draw',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Freehand Drawing',
    description: 'Sketch, annotate, and write handwritten notes with adjustable stylus or brush.',
    icon: PenTool,
    color: 'from-emerald-500 to-green-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'add-barcode',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Barcode / QR',
    description: 'Generate and stamp dynamic QR codes or EAN/UPC barcodes onto your documents.',
    icon: Sparkles,
    color: 'from-blue-600 to-purple-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'add-hyperlink',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Add Hyperlink',
    description: 'Insert clickable URL hyperlinks and cross-page anchor jumps into PDF text.',
    icon: Globe,
    color: 'from-cyan-500 to-blue-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'remove-annotations',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Remove Annotations',
    description: 'Strip all existing comments, pop-up sticky notes, and drawing markups.',
    icon: Trash2,
    color: 'from-gray-500 to-red-500',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'whiteout-pdf',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Whiteout PDF',
    description: 'Erase unwanted text, smudges, or confidential paragraphs with precision whiteout tape.',
    icon: FileText,
    color: 'from-slate-400 to-zinc-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'callout-notes',
    step: 4,
    stepName: 'Edit, Annotate & Format',
    name: 'Callout Notes',
    description: 'Place collapsible sticky notes, reviewer instructions, and feedback comments.',
    icon: FileEdit,
    color: 'from-orange-500 to-amber-600',
    category: 'edit',
    acceptedTypes: ['.pdf']
  },

  // ==========================================
  // GROUP 5: SECURITY, SIGN & COMPLIANCE (12 TOOLS)
  // ==========================================
  {
    id: 'sign-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Sign PDF',
    description: 'Sign documents digitally yourself or request certified electronic signatures.',
    icon: PenTool,
    color: 'from-emerald-600 to-green-600',
    category: 'security',
    badge: 'Legally Valid',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'request-signatures',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Request Signatures',
    description: 'Send documents out for multi-party electronic signatures with audit log trail.',
    icon: Mail,
    color: 'from-blue-600 to-indigo-600',
    category: 'security',
    badge: 'Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'protect-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Protect PDF',
    description: 'Encrypt your PDF with standard AES 256-bit password security.',
    icon: Lock,
    color: 'from-amber-500 to-orange-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'unlock-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Unlock PDF',
    description: 'Remove PDF password security to restore full viewing, copying, and printing.',
    icon: Unlock,
    color: 'from-rose-500 to-red-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'redact-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Redact PDF',
    description: 'Permanently censor sensitive text, confidential legal clauses, SSNs, and credit numbers.',
    icon: EyeOff,
    color: 'from-gray-800 to-black',
    category: 'security',
    badge: 'PII Safe',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'verify-signature',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Verify Signatures',
    description: 'Inspect cryptographic X.509 digital certificates and check signature integrity.',
    icon: ShieldCheck,
    color: 'from-teal-500 to-emerald-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'pdf-to-pdfa',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'PDF to PDF/A',
    description: 'Transform standard PDFs into ISO 19005 compliant archivable format for enterprise storage.',
    icon: Archive,
    color: 'from-blue-500 to-teal-600',
    category: 'security',
    badge: 'ISO Compliant',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'remove-metadata',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Remove Metadata',
    description: 'Scrub author name, GPS tags, editing software, and document revision history.',
    icon: Shield,
    color: 'from-red-500 to-rose-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'edit-metadata',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Edit Metadata',
    description: 'Update PDF Title, Author, Subject, Keywords, and Copyright metadata fields.',
    icon: FileText,
    color: 'from-cyan-600 to-blue-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'lock-printing',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Lock Permissions',
    description: 'Set permissions to prohibit printing, text copying, and form extraction.',
    icon: KeyRound,
    color: 'from-amber-600 to-red-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'time-stamp-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Timestamp PDF',
    description: 'Apply trusted RFC 3161 cryptographic timestamp to prove document existence time.',
    icon: Lock,
    color: 'from-indigo-600 to-purple-600',
    category: 'security',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'sanitize-pdf',
    step: 5,
    stepName: 'Security, Sign & Compliance',
    name: 'Sanitize PDF',
    description: 'Deep cleanse malicious embedded JavaScript, external link exploits, and launch actions.',
    icon: Shield,
    color: 'from-emerald-600 to-teal-600',
    category: 'security',
    badge: 'SecOps',
    acceptedTypes: ['.pdf']
  },

  // ==========================================
  // GROUP 6: OPTIMIZE, REPAIR & ADVANCED AI (12 TOOLS)
  // ==========================================
  {
    id: 'compress-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximal PDF quality and resolution.',
    icon: Minimize2,
    color: 'from-emerald-500 to-teal-600',
    category: 'optimize',
    badge: 'Popular',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ocr-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Neural OCR',
    description: 'Turn scanned documents and images into searchable, selectable, and editable text.',
    icon: Search,
    color: 'from-purple-500 to-pink-600',
    category: 'optimize',
    badge: 'AI Neural',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'flatten-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Flatten PDF',
    description: 'Flatten interactive form fields and transparent annotations into non-editable raster content.',
    icon: Layers2,
    color: 'from-blue-500 to-indigo-600',
    category: 'optimize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'repair-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Repair PDF',
    description: 'Analyze, rebuild broken cross-reference tables, and recover corrupted or unreadable PDFs.',
    icon: Wrench,
    color: 'from-orange-500 to-amber-600',
    category: 'optimize',
    badge: 'Auto Repair',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'grayscale-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Grayscale PDF',
    description: 'Convert full-color documents to clean black-and-white to drastically cut toner and size.',
    icon: Sliders,
    color: 'from-gray-500 to-slate-700',
    category: 'optimize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'resize-page',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Resize Page Size',
    description: 'Change paper dimensions to standard A4, US Letter, A3, Legal, or custom dimensions.',
    icon: Crop,
    color: 'from-teal-500 to-emerald-600',
    category: 'optimize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ai-summarize',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Summarize PDF',
    description: 'Generate concise executive summaries, key bullet points, and actionable takeaways.',
    icon: Sparkles,
    color: 'from-purple-600 to-pink-600',
    category: 'optimize',
    badge: 'AI Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ai-translate',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Translate PDF',
    description: 'Translate entire PDF documents into 50+ languages while preserving layout and style.',
    icon: Globe,
    color: 'from-blue-600 to-indigo-600',
    category: 'optimize',
    badge: 'AI Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ai-chat-pdf',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Chat with PDF',
    description: 'Ask questions, query tables, and extract insights interactively from your document.',
    icon: Sparkles,
    color: 'from-indigo-600 to-violet-600',
    category: 'optimize',
    badge: 'AI Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'extract-tables',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'AI Table Extractor',
    description: 'Automatically detect table borders, cell grids, and numerical datasets into Excel/CSV.',
    icon: Table,
    color: 'from-emerald-600 to-teal-600',
    category: 'optimize',
    badge: 'AI Pro',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'invert-colors',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Dark Mode Invert',
    description: 'Invert colors for night reading and reduce eye fatigue for high-contrast accessibility.',
    icon: Eye,
    color: 'from-slate-800 to-gray-950',
    category: 'optimize',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'optimize-web',
    step: 6,
    stepName: 'Optimize, Repair & Advanced AI',
    name: 'Linearize for Web',
    description: 'Fast Web View optimization for instantaneous streaming and viewing in web browsers.',
    icon: Zap,
    color: 'from-amber-500 to-orange-500',
    category: 'optimize',
    badge: 'Fast Stream',
    acceptedTypes: ['.pdf']
  },

  // ==========================================
  // GROUP 7: NEURAL OCR & INTELLIGENCE SUITE
  // ==========================================
  {
    id: 'ocr-searchable-pdf',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'PDF to Searchable PDF',
    description: 'Inject an invisible vector text layer over scanned PDF pages to make words fully searchable and copyable.',
    icon: ScanText,
    color: 'from-violet-600 to-purple-600',
    category: 'ocr',
    badge: 'Searchable',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ocr-image-to-text',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Image to Text (OCR)',
    description: 'Extract raw, formatted text from JPG, PNG, WEBP, and TIFF images with automatic deskew and contrast enhancement.',
    icon: FileScan,
    color: 'from-fuchsia-600 to-pink-600',
    category: 'ocr',
    badge: 'High Accuracy',
    acceptedTypes: ['.png', '.jpg', '.jpeg', '.webp', '.tiff', '.bmp']
  },
  {
    id: 'ocr-scanned-pdf-to-word',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Scanned PDF to Word (OCR)',
    description: 'Transform non-selectable scanned PDF pages directly into editable Microsoft Word (.docx) with layouts intact.',
    icon: FileText,
    color: 'from-blue-600 to-indigo-600',
    category: 'ocr',
    badge: 'Editable DOCX',
    acceptedTypes: ['.pdf']
  },
  {
    id: 'ocr-handwriting',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Handwriting to Text OCR',
    description: 'Transcribe handwritten paper notes, doctor prescriptions, meeting minutes, and journal pages into digital text.',
    icon: PenTool,
    color: 'from-amber-600 to-rose-600',
    category: 'ocr',
    badge: 'Cursive AI',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'ocr-receipt-invoice',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Invoice & Receipt OCR',
    description: 'Financial document scanner: automatically extract Merchant, GST/Tax, Totals, Dates, and Line Items to Excel/JSON.',
    icon: Receipt,
    color: 'from-emerald-600 to-teal-600',
    category: 'ocr',
    badge: 'Finance Pro',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'ocr-id-passport',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'ID Card & Passport OCR',
    description: 'Detect and extract MRZ, full name, document numbers, DOB, and expiry dates from Passports and National ID cards.',
    icon: ShieldCheck,
    color: 'from-indigo-600 to-sky-600',
    category: 'ocr',
    badge: 'MRZ / KYC',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'ocr-table-extractor',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'OCR Tables to Excel/CSV',
    description: 'Detect borders and grid lines in scanned forms and export all tabular cells directly into Excel spreadsheets.',
    icon: Table,
    color: 'from-teal-600 to-emerald-600',
    category: 'ocr',
    badge: 'Grid AI',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'ocr-multi-language',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Multi-Language OCR (100+)',
    description: 'Recognize 100+ international scripts including Hindi (Devanagari), Bengali, Arabic, Spanish, French, German, Chinese, and Japanese.',
    icon: Languages,
    color: 'from-purple-600 to-pink-600',
    category: 'ocr',
    badge: '100+ Languages',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  },
  {
    id: 'ocr-batch-pdf',
    step: 7,
    stepName: 'AI Neural OCR Suite',
    name: 'Batch Document OCR',
    description: 'Queue and run high-speed parallel OCR on multiple scanned files simultaneously with batch export.',
    icon: Layers,
    color: 'from-slate-700 to-gray-900',
    category: 'ocr',
    badge: 'Batch Queue',
    acceptedTypes: ['.pdf', '.png', '.jpg', '.jpeg']
  }
];
