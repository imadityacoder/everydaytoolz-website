import { ToolDefinition } from "@/types/tools";

export const CATEGORIES = [
  { id: "finance", name: "Finance & Wealth", icon: "DollarSign", description: "High-accuracy wealth, tax, and loan calculators" },
  { id: "media", name: "Media & Studio", icon: "Video", description: "Zero-upload client-side video, audio & image engines" },
  { id: "developer", name: "Developer Tools", icon: "Code", description: "Syntax formatters, encoders, decoders & debugging utilities" },
  { id: "productivity", name: "Productivity & PDF", icon: "Sparkles", description: "Document toolkits, text analyzers & health metrics" },
  { id: "security", name: "Security & Crypto", icon: "Shield", description: "Cryptographic entropy generators and hash algorithms" },
] as const;

export const TOOLS_REGISTRY: ToolDefinition[] = [
  {
    "id": "sip-calculator",
    "slug": "sip-calculator",
    "name": "SIP & Compound Interest Calculator",
    "shortDescription": "Calculate wealth accumulated through Systematic Investment Plans (SIP) or lumpsum mutual funds with annual step-up options and visual returns breakdown.",
    "category": "finance",
    "iconName": "TrendingUp",
    "cpcTier": "high",
    "badge": "Most Popular",
    "adSenseChannelId": "ch_finance_01",
    "primaryKeyword": "SIP Calculator",
    "secondaryKeywords": [
      "sip return calculator",
      "mutual fund sip calculator",
      "step up sip calculator",
      "compound interest calculator",
      "systematic investment plan",
      "sip wealth growth formula",
      "monthly investment calculator",
      "lump sum vs sip returns"
    ],
    "seoTitle": "SIP Calculator \u2013 Compound Returns & Step-Up Plan",
    "seoDescription": "Calculate mutual fund returns with our free SIP calculator. Model compound growth, step-up plans, and wealth online. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Choose your investment mode: Monthly SIP for recurring deposits or Lumpsum for one-time contributions.",
        "Input your planned monthly investment amount in your local currency.",
        "Set your expected annual rate of return based on historical asset class performance.",
        "Define the investment horizon in years to evaluate long-term compounding effects.",
        "Enable Step-Up percentage to simulate annual contribution hikes alongside salary growth."
      ],
      "formulaOrLogic": "Future Value = P \u00d7 [((1 + i)^n - 1) / i] \u00d7 (1 + i), where P is the monthly installment, i is the periodic monthly interest rate (annual rate / 12 / 100), and n is the total number of monthly payments (years \u00d7 12).",
      "useCases": [
        "Retirement Corpus Planning: Estimate accumulated capital over a 20-30 year career.",
        "Higher Education & Life Milestones: Project disciplined savings for children's college tuition or home down payments.",
        "Step-Up Wealth Acceleration: Model how an annual 10% contribution hike drastically expands the terminal corpus.",
        "Index Fund & Equity Mutual Fund Evaluation: Benchmark portfolio expectations against historical 12-15% CAGR."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "What is a Systematic Investment Plan (SIP) and how does it work?",
        "answer": "A Systematic Investment Plan (SIP) is a wealth-building method where an investor commits a fixed dollar or rupee amount at regular intervals into a mutual fund scheme. It reduces market timing risk through dollar-cost averaging and compounds periodic yields over multi-year horizons."
      },
      {
        "question": "How does an annual Step-Up SIP significantly expand maturity wealth?",
        "answer": "A Step-Up SIP increases your periodic investment contribution by a set percentage each year, in sync with annual career salary increments. Because incremental savings enter the compounding cycle earlier, a 10% annual step-up can often double the final wealth corpus compared to a static SIP."
      },
      {
        "question": "What formula governs the future value of a SIP investment?",
        "answer": "The future value is calculated using the formula FV = P \u00d7 [((1 + i)^n - 1) / i] \u00d7 (1 + i), where P represents the installment, i is the periodic rate (annual rate divided by 12), and n represents the total count of monthly installments."
      },
      {
        "question": "Are inflation and tax deductions factored into this SIP calculator?",
        "answer": "This calculator displays gross nominal maturity value before capital gains tax and inflation adjustments. For long-term real purchasing power, investors generally subtract 5% to 6% inflation from nominal CAGR or plan for LTCG tax upon redemption."
      },
      {
        "question": "Is my financial data uploaded or stored on any server?",
        "answer": "No. All SIP calculations and compound interest projections execute 100% locally in your web browser using client-side JavaScript. No personal numbers or financial parameters are ever sent to an external server."
      }
    ],
    "guide": {
      "title": "Understanding Systematic Investment Planning",
      "description": "Investing regularly in mutual funds or index funds compounds returns over the long term. This calculator estimates your maturity wealth based on historical average market returns.",
      "formula": "M = P \u00d7 [((1 + i)^n - 1) / i] \u00d7 (1 + i)",
      "steps": [
        "Select either Monthly SIP or One-Time Lumpsum investment mode.",
        "Enter your planned periodic investment amount in INR or USD.",
        "Set your expected annual return rate (typical equity returns range between 11% and 15%).",
        "Specify the total investment horizon in years.",
        "Optionally enable Step-Up % to model annual salary increments and observe exponential growth."
      ],
      "notes": [
        "Returns do not account for inflation, fund expense ratios, or capital gains tax.",
        "Historical market performance does not guarantee future results."
      ]
    },
    "relatedToolSlugs": [
      "emi-salary-calculator",
      "tdee-macro-calculator"
    ],
    "keywords": [
      "SIP Calculator",
      "sip return calculator",
      "mutual fund sip calculator",
      "step up sip calculator",
      "compound interest calculator",
      "systematic investment plan",
      "sip wealth growth formula",
      "monthly investment calculator",
      "lump sum vs sip returns"
    ]
  },
  {
    "id": "emi-salary-calculator",
    "slug": "emi-salary-calculator",
    "name": "Loan EMI & In-Hand Salary Calculator",
    "shortDescription": "Dual-utility financial calculator for Home, Car, and Personal Loan EMIs with complete amortization schedules, plus CTC to Take-Home Salary deductions breakdown.",
    "category": "finance",
    "iconName": "Coins",
    "cpcTier": "high",
    "badge": "High CPC",
    "adSenseChannelId": "ch_finance_02",
    "primaryKeyword": "EMI Calculator",
    "secondaryKeywords": [
      "home loan emi calculator",
      "in hand salary calculator",
      "ctc to net salary",
      "car loan emi calculator",
      "personal loan interest",
      "loan amortization schedule",
      "take home pay calculator",
      "provident fund deduction"
    ],
    "seoTitle": "EMI & Salary Calculator \u2013 Loan Schedule & In-Hand Pay",
    "seoDescription": "Calculate loan EMI amortization and convert CTC to take-home in-hand salary with accurate tax deductions. 100% free with no login required online.",
    "editorialGuide": {
      "howToSteps": [
        "Select your mode: Loan EMI Calculator or CTC to In-Hand Salary Calculator.",
        "For Loan EMI: Enter the principal amount borrowed, annual interest rate (%), and tenure in years.",
        "Inspect your monthly installment, total interest payable, and the interactive amortization chart.",
        "Export the complete month-by-month repayment breakdown to CSV for mortgage planning.",
        "For Salary: Enter your annual CTC to calculate monthly gross, EPF, professional tax, and net take-home pay."
      ],
      "formulaOrLogic": "EMI = [P \u00d7 r \u00d7 (1 + r)^n] / [(1 + r)^n - 1], where P is Principal Loan Amount, r is Monthly Interest Rate (Annual Rate / 12 / 100), and n is Tenure in Months. Net Salary = Gross Pay - (Employee EPF [12% of Basic] + Professional Tax + TDS).",
      "useCases": [
        "Mortgage Affordability: Evaluate home loan monthly cash flow commitments before approaching lenders.",
        "Job Offer Evaluation: Accurately translate a high CTC offer into realistic disposable monthly in-hand compensation.",
        "Prepayment Strategy: Analyze interest savings and amortization trajectories across tenure reductions.",
        "Vehicle Financing: Compare auto loan options from multiple banks to minimize overall interest costs."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "How is the Equated Monthly Installment (EMI) mathematically calculated?",
        "answer": "EMI is derived using the standard reducing-balance loan formula: EMI = [P \u00d7 r \u00d7 (1 + r)^n] / [(1 + r)^n - 1], where P is the borrowed principal, r is the monthly interest rate, and n is the tenure in months."
      },
      {
        "question": "What deductions differentiate gross CTC from net in-hand monthly salary?",
        "answer": "Cost to Company (CTC) includes employer contributions like PF and gratuity. Net monthly in-hand pay is determined by subtracting Employee Provident Fund (12% of basic), Professional Tax, and Income Tax (TDS) from your gross monthly salary."
      },
      {
        "question": "Can I export the full amortization schedule for my accountant?",
        "answer": "Yes, you can export the full amortization schedule to a CSV spreadsheet with a single click, detailing principal paid, interest paid, and remaining balance for each repayment period."
      },
      {
        "question": "How does loan tenure affect total interest paid over time?",
        "answer": "A longer loan tenure lowers your monthly EMI payment but significantly inflates the cumulative interest paid over the life of the loan. Shortening tenure increases monthly cash outflow while drastically reducing total interest."
      },
      {
        "question": "Does this loan and salary tool require an account or sign-in?",
        "answer": "No registration or sign-in is required. All loan amortization computations and salary breakdowns run entirely client-side inside your browser with complete privacy."
      }
    ],
    "guide": {
      "title": "Loan EMI & Salary Structure Mechanics",
      "description": "Plan your major financial commitments with precision by comparing interest costs across loan options and understanding your actual disposable monthly income.",
      "formula": "EMI = [P \u00d7 r \u00d7 (1 + r)^n] / [(1 + r)^n - 1]",
      "steps": [
        "Toggle between Loan EMI Calculator and CTC to In-Hand Salary Calculator.",
        "For loans: Input the total principal borrowed, annual interest rate (%), and loan tenure in years.",
        "Review monthly EMI, total interest payable, and the interactive amortization table.",
        "For salary: Input your annual CTC and review monthly gross, EPF deductions, standard deduction, and net in-hand pay."
      ]
    },
    "relatedToolSlugs": [
      "sip-calculator",
      "security-vault"
    ],
    "keywords": [
      "EMI Calculator",
      "home loan emi calculator",
      "in hand salary calculator",
      "ctc to net salary",
      "car loan emi calculator",
      "personal loan interest",
      "loan amortization schedule",
      "take home pay calculator",
      "provident fund deduction"
    ]
  },
  {
    "id": "pdf-toolkit",
    "slug": "pdf-toolkit",
    "name": "Client-Side PDF Merger & Splitter",
    "shortDescription": "Combine multiple PDF files, delete unwanted pages, extract custom ranges, or reorder pages with visual drag-and-drop. 100% private in-browser memory.",
    "category": "productivity",
    "iconName": "FileText",
    "cpcTier": "volume",
    "badge": "Private (Zero Upload)",
    "adSenseChannelId": "ch_productivity_01",
    "primaryKeyword": "PDF Merger",
    "secondaryKeywords": [
      "merge pdf online free",
      "split pdf pages",
      "combine pdf documents",
      "reorder pdf pages",
      "extract pages from pdf",
      "private pdf merger",
      "client side pdf tool",
      "zero upload pdf editor"
    ],
    "seoTitle": "PDF Merger & Splitter \u2013 Combine PDF Pages Online Free",
    "seoDescription": "Merge, split, reorder, and extract PDF pages directly in your browser. 100% free with no login required, zero file uploads, and complete privacy.",
    "editorialGuide": {
      "howToSteps": [
        "Drag and drop one or more PDF files into the local workspace drop zone.",
        "To Merge: Drag file cards into your preferred sequence and verify individual page counts.",
        "To Split: Specify comma-separated target page numbers or custom ranges (e.g., 1-4, 7, 9-12).",
        "Preview and delete unneeded individual pages using the visual page removal toggles.",
        "Click 'Process & Download PDF' to trigger in-memory compilation and save the resulting document."
      ],
      "formulaOrLogic": "Processes documents via WebAssembly and pdf-lib byte-stream manipulation in local browser memory. Page trees are decoded into array buffers, rearranged according to selected indices, and serialized into standard ISO 32000-1 PDF binary structures without network round-trips.",
      "useCases": [
        "Confidential Document Merging: Combine NDA-protected contracts, legal filings, and financial statements without cloud privacy risks.",
        "Invoice & Tax Receipt Bundling: Assemble quarterly expense receipts and billing records into a unified PDF attachment.",
        "Academic & Research Extraction: Pull specific chapters or data appendices out of voluminous research papers.",
        "Application Submission: Assemble resume, cover letter, recommendation letters, and transcripts into a single submission file."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "Are my confidential PDF documents uploaded to an external server?",
        "answer": "Never. All PDF operations\u2014including parsing, reordering, extracting, and merging\u2014run 100% locally inside your web browser via WebAssembly byte streams. Your files never leave your device."
      },
      {
        "question": "What is the maximum file size or page count allowed in this PDF toolkit?",
        "answer": "Because file processing executes entirely within local device RAM rather than a remote cloud server, there are no artificial file size caps. Modern devices easily handle PDF files in excess of 200MB."
      },
      {
        "question": "How do I extract non-consecutive page ranges from a large PDF document?",
        "answer": "Select the Split / Extract tab, then enter comma-separated numbers or page ranges such as '1-3, 5, 8-10'. The engine compiles those exact pages into a newly generated PDF file."
      },
      {
        "question": "Can I reorder individual pages within a PDF before saving?",
        "answer": "Yes. The toolkit provides visual drag-and-drop handles so you can freely reposition, reorder, or delete unnecessary pages prior to generating your final document."
      },
      {
        "question": "Does this online PDF tool impose daily limits or require an account?",
        "answer": "No account, login, or subscription is required. You can merge and split as many PDF documents as you need with unlimited usage and instant client-side downloads."
      }
    ],
    "guide": {
      "title": "Secure PDF Document Management",
      "description": "Manipulate sensitive business, legal, or personal PDF documents without worrying about cloud privacy risks or data retention policies.",
      "steps": [
        "Drag and drop one or more PDF files into the upload zone.",
        "To Merge: Order your files, preview individual page counts, and click 'Merge All'.",
        "To Split: Enter desired page ranges (e.g., '1-3, 5, 8-10') or select individual pages to delete.",
        "Click 'Download Processed PDF' to instantly save your result."
      ]
    },
    "relatedToolSlugs": [
      "image-compressor",
      "text-utility"
    ],
    "keywords": [
      "PDF Merger",
      "merge pdf online free",
      "split pdf pages",
      "combine pdf documents",
      "reorder pdf pages",
      "extract pages from pdf",
      "private pdf merger",
      "client side pdf tool",
      "zero upload pdf editor"
    ]
  },
  {
    "id": "json-jwt-studio",
    "slug": "json-jwt-studio",
    "name": "JSON Formatter, Validator & JWT Decoder",
    "shortDescription": "Dual-pane developer workspace to format, validate, minify JSON data, fix syntax errors, and decode JSON Web Tokens with real-time expiration inspection.",
    "category": "developer",
    "iconName": "Braces",
    "cpcTier": "high",
    "badge": "Developer Utility",
    "adSenseChannelId": "ch_developer_01",
    "primaryKeyword": "JSON Formatter",
    "secondaryKeywords": [
      "json validator online",
      "jwt decoder online",
      "format json online",
      "json prettifier",
      "decode jwt token",
      "json minifier tool",
      "jwt payload inspector",
      "json lint syntax checker"
    ],
    "seoTitle": "JSON Formatter & JWT Decoder \u2013 Validate & Inspect Tokens",
    "seoDescription": "Format, validate, and minify JSON while decoding JSON Web Tokens client-side. Inspect OAuth claims and fix syntax. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Switch between the JSON Studio tab or JWT Decoder tab based on your payload.",
        "Paste raw JSON text or an encoded JWT token string into the interactive editor.",
        "For JSON: Choose 2-space or 4-space indentation, or click Minify to eliminate whitespace.",
        "Inspect syntax errors flagged with exact line and column numbers in the error console.",
        "For JWT: View parsed Header and Payload claims, expiry countdown, and token issuance timestamps."
      ],
      "formulaOrLogic": "JSON validation parses strings via recursive descent Lexer/Parser with error-offset trapping. JWT decoding segments tokens by '.' delimiter, applies Base64URL-to-UTF8 decoding to header and payload segments, parses RFC 7519 claims, and compares Unix timestamp claims (exp, nbf, iat) against Date.now().",
      "useCases": [
        "REST & GraphQL API Debugging: Prettify messy API responses and identify trailing commas or unescaped quotes.",
        "OAuth & OpenID Token Inspection: Verify token scopes, subject claims, issuer domains, and expiration lifespans.",
        "Production Payload Minification: Strip whitespace and formatting from configuration files to reduce network bandwidth.",
        "Client-Side Token Auditing: Inspect internal Bearer authentication tokens safely without leaking secrets to remote servers."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "Is it secure to paste production JWT tokens into this decoder?",
        "answer": "Yes, because decoding is conducted entirely client-side using JavaScript Base64URL string decoding. The token is never transmitted over the internet or logged to any analytics service."
      },
      {
        "question": "Does this JWT inspector verify digital signatures (e.g., RS256, HS256)?",
        "answer": "This utility decodes and inspects the token Header, Payload claims, and expiration timestamps. Signature verification requires the corresponding public certificate or HMAC secret key."
      },
      {
        "question": "How does the JSON validator highlight parsing errors?",
        "answer": "The parser captures native syntax exceptions and highlights the precise line number, column offset, and unexpected token character, making it simple to fix missing braces or invalid quotation marks."
      },
      {
        "question": "Can I convert unformatted single-line JSON into 2-space or 4-space indentation?",
        "answer": "Yes. You can switch between 2-space indentation, 4-space indentation, or compact minification with a single click, instantly cleaning up complex nested objects."
      },
      {
        "question": "Do I need to sign in or create an account to use the JSON & JWT studio?",
        "answer": "No sign-in or account registration is ever required. The entire developer suite is free, instantaneous, and operates offline within your browser session."
      }
    ],
    "guide": {
      "title": "Inspecting JSON Payloads and Auth Tokens",
      "description": "Quickly debug API payloads, inspect OAuth / OpenID Connect tokens, and format messy configurations with instant client-side execution.",
      "steps": [
        "Select JSON Studio or JWT Decoder tab.",
        "Paste your payload into the input editor.",
        "For JSON: Choose indentation or click 'Minify'. Errors are flagged with red line markers.",
        "For JWT: View decoded Algorithm, Issued-At date, and Expiration status with countdown badge."
      ]
    },
    "relatedToolSlugs": [
      "security-vault",
      "text-utility"
    ],
    "keywords": [
      "JSON Formatter",
      "json validator online",
      "jwt decoder online",
      "format json online",
      "json prettifier",
      "decode jwt token",
      "json minifier tool",
      "jwt payload inspector",
      "json lint syntax checker"
    ]
  },
  {
    "id": "video-to-audio",
    "slug": "video-to-audio",
    "name": "Browser FFmpeg Video-to-Audio Converter",
    "shortDescription": "Extract crisp MP3 or WAV audio tracks from MP4, WebM, or MKV videos directly inside your browser using WebAssembly FFmpeg. Zero bandwidth consumed.",
    "category": "media",
    "iconName": "Music",
    "cpcTier": "volume",
    "badge": "WASM Powered",
    "adSenseChannelId": "ch_media_01",
    "primaryKeyword": "Video to Audio Converter",
    "secondaryKeywords": [
      "mp4 to mp3 converter",
      "extract audio from video",
      "convert video to mp3",
      "browser ffmpeg converter",
      "webm to mp3 converter",
      "video to wav converter",
      "offline video to audio",
      "extract audio without upload"
    ],
    "seoTitle": "Video to Audio Converter \u2013 Extract MP3 from MP4 in Browser",
    "seoDescription": "Extract crystal-clear MP3 or WAV audio from MP4 and WebM videos using browser FFmpeg WASM. 100% free with no login required and zero file uploads.",
    "editorialGuide": {
      "howToSteps": [
        "Drag and drop any video file (MP4, WebM, MKV, MOV) into the transcode workspace.",
        "Choose your desired output audio format: MP3 for compressed audio or WAV for uncompressed fidelity.",
        "Select your audio quality bitrate (320 kbps Studio, 192 kbps Standard, or 128 kbps Compact).",
        "Click 'Start Conversion' to initiate local FFmpeg WebAssembly transcoding.",
        "Monitor the real-time conversion progress bar and download your completed audio file."
      ],
      "formulaOrLogic": "Executes compiled FFmpeg C binaries via WebAssembly (WASM) and multi-threaded Web Workers. Demuxes video container bitstreams (ISO BMFF/Matroska), isolates the audio stream, runs libmp3lame or PCM transcoders, and outputs binary blobs directly through browser Object URLs.",
      "useCases": [
        "Podcast & Lecture Extraction: Turn recorded Zoom meetings, webinars, and lectures into lightweight MP3 audio for on-the-go listening.",
        "Soundtrack & Voiceover Harvesting: Extract clean audio samples, background tracks, or speech from video clips for editing.",
        "Bandwidth Conservation: Convert 2GB high-definition video captures into 25MB audio files locally without using cellular or home internet data.",
        "Air-Gapped Media Processing: Transcode proprietary corporate or personal video recordings on secure, offline machines without cloud exposure."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "How does video-to-audio conversion work without uploading files to a server?",
        "answer": "We utilize FFmpeg compiled into WebAssembly (WASM). Your device's local CPU executes the transcoding engine directly inside a sandboxed Web Worker, converting media in local memory."
      },
      {
        "question": "What audio container formats and bitrates are supported?",
        "answer": "The converter supports both MP3 and WAV outputs. For MP3, you can choose between Studio Quality (320 kbps), High Quality (192 kbps), and Compact (128 kbps)."
      },
      {
        "question": "Why does this tool require Cross-Origin Isolation headers (COOP/COEP)?",
        "answer": "Multi-threaded WebAssembly FFmpeg requires high-resolution shared memory buffers (SharedArrayBuffer), which modern web browsers only unlock when strict COOP and COEP security headers are present."
      },
      {
        "question": "Are there restrictions on the length or size of the uploaded video?",
        "answer": "There are no server file size limits because files are never uploaded. Processing capacity is determined solely by your device's available system RAM and CPU processing power."
      },
      {
        "question": "Is there any cost, subscription, or login required to transcode videos?",
        "answer": "No login, user registration, or subscription fee is needed. You can convert an unlimited number of video files completely free of charge."
      }
    ],
    "guide": {
      "title": "Local Media Transcoding via FFmpeg WASM",
      "description": "Save gigabytes of upload bandwidth and protect your privacy when extracting audio lectures, podcasts, or music from video files.",
      "steps": [
        "Drop any video file (MP4, MKV, WebM, MOV) into the drop zone.",
        "Choose your target audio container (MP3 or WAV) and desired bitrate.",
        "Click 'Start Conversion' and watch the real-time transcoding progress meter.",
        "Click 'Download Audio' once completed."
      ]
    },
    "relatedToolSlugs": [
      "youtube-extractor",
      "image-compressor"
    ],
    "keywords": [
      "Video to Audio Converter",
      "mp4 to mp3 converter",
      "extract audio from video",
      "convert video to mp3",
      "browser ffmpeg converter",
      "webm to mp3 converter",
      "video to wav converter",
      "offline video to audio",
      "extract audio without upload"
    ]
  },
  {
    "id": "youtube-extractor",
    "slug": "youtube-extractor",
    "name": "YouTube Thumbnail Downloader & Tag Extractor",
    "shortDescription": "Grab High-Definition (1080p MaxRes, HQ, MQ) YouTube video and Shorts thumbnails in 1-click, extract SEO tags, and preview thumbnails in light/dark feeds.",
    "category": "media",
    "iconName": "Youtube",
    "cpcTier": "volume",
    "badge": "Creator Essential",
    "adSenseChannelId": "ch_media_02",
    "primaryKeyword": "YouTube Thumbnail Downloader",
    "secondaryKeywords": [
      "download youtube thumbnail",
      "youtube thumbnail grabber",
      "youtube tag extractor",
      "youtube shorts thumbnail",
      "hd youtube thumbnail 1080p",
      "youtube cover image download",
      "youtube video tags finder",
      "maxresdefault thumbnail download"
    ],
    "seoTitle": "YouTube Thumbnail Downloader \u2013 Get HD 1080p Thumbnails",
    "seoDescription": "Download full HD 1080p YouTube thumbnails and extract video SEO tags in 1 click. Preview feed in light/dark mode. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Copy the video URL of any standard YouTube video, Shorts clip, or Live stream.",
        "Paste the link into the extractor input box (supports youtube.com, youtu.be, and /shorts/ formats).",
        "Inspect the automatically detected thumbnail resolutions: MaxRes (1080p), High Quality (HQ), and Medium Quality.",
        "Click 'Download Thumbnail' to save your chosen resolution directly to your device.",
        "Copy extracted SEO keywords and preview thumbnail visibility on simulated dark/light mobile feeds."
      ],
      "formulaOrLogic": "Extracts the canonical 11-character video ID via regular expressions matching standard, short, and embed YouTube URL patterns. Resolves high-resolution asset CDNs: https://img.youtube.com/vi/{id}/maxresdefault.jpg with automated fallback cascade to hqdefault.jpg and mqdefault.jpg.",
      "useCases": [
        "Creator Inspiration & Competitor Analysis: Study high-performing thumbnail designs, typography, and contrast in your niche.",
        "CTR Feed Optimization: Test how custom thumbnail artwork stands out against YouTube's native light and dark feed layouts.",
        "SEO Tag Harvesting: Uncover competitive search tags and long-tail ranking phrases used by top-ranking video creators.",
        "Graphic Design & Presentations: Retrieve clean cover art for keynote presentations, blog headers, and marketing roundups."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "Why do some YouTube videos not offer a 1080p MaxRes thumbnail?",
        "answer": "YouTube creates maxresdefault.jpg only when the creator uploads a custom thumbnail of at least 1280x720 pixels. If unavailable, our tool automatically falls back to the highest available quality (hqdefault)."
      },
      {
        "question": "Can I extract thumbnails from YouTube Shorts and Live stream links?",
        "answer": "Yes. The parsing engine recognizes all YouTube URL variations, including desktop watch links, mobile youtu.be shortlinks, Shorts vertical links, and live broadcast streams."
      },
      {
        "question": "How does the mobile feed contrast simulator benefit creators?",
        "answer": "The simulator renders your thumbnail inside a simulated YouTube mobile feed in both dark and light modes, allowing you to gauge visual contrast and readability before publishing."
      },
      {
        "question": "Is downloading YouTube thumbnails for personal reference legal?",
        "answer": "Yes, accessing public YouTube thumbnail images for design reference, fair use analysis, and creative inspiration is standard industry practice. Always respect copyright when reusing assets."
      },
      {
        "question": "Do I need to install browser extensions or create an account?",
        "answer": "No extensions, downloads, or user accounts are needed. Simply paste your YouTube URL to inspect and download high-resolution cover graphics immediately."
      }
    ],
    "guide": {
      "title": "Optimizing YouTube Thumbnail & Tag Assets",
      "description": "Analyze competitor video tags, archive high-res cover art, and optimize your Click-Through Rate (CTR) using our simulated feed previewer.",
      "steps": [
        "Paste any YouTube video or Shorts link into the search bar.",
        "View and download MaxRes (1080p), High Quality (HQ), or Standard Definition thumbnails.",
        "Copy all detected video SEO tags with a single click.",
        "Toggle the YouTube Feed Preview to test contrast against dark/light interfaces."
      ]
    },
    "relatedToolSlugs": [
      "video-to-audio",
      "image-compressor"
    ],
    "keywords": [
      "YouTube Thumbnail Downloader",
      "download youtube thumbnail",
      "youtube thumbnail grabber",
      "youtube tag extractor",
      "youtube shorts thumbnail",
      "hd youtube thumbnail 1080p",
      "youtube cover image download",
      "youtube video tags finder",
      "maxresdefault thumbnail download"
    ]
  },
  {
    "id": "image-compressor",
    "slug": "image-compressor",
    "name": "Bulk Image Compressor & WebP Converter",
    "shortDescription": "Compress up to 10 JPG, PNG, and WebP images simultaneously with live quality tuning, dimension resizing, before/after size comparisons, and ZIP batch download.",
    "category": "media",
    "iconName": "Image",
    "cpcTier": "volume",
    "badge": "Bulk Fast",
    "adSenseChannelId": "ch_media_03",
    "primaryKeyword": "Image Compressor",
    "secondaryKeywords": [
      "compress image online",
      "reduce image size",
      "compress png online",
      "compress jpg free",
      "convert png to webp",
      "bulk image compressor",
      "lossless image compression",
      "photo size reducer in kb"
    ],
    "seoTitle": "Image Compressor \u2013 Compress JPG, PNG & WebP Online Free",
    "seoDescription": "Compress JPG, PNG, and WebP images in bulk with real-time preview, visual slider, and quality settings. 100% free with no login required online.",
    "editorialGuide": {
      "howToSteps": [
        "Drag and drop up to 10 JPG, PNG, or WebP images into the bulk compressor drop zone.",
        "Adjust the global compression quality slider (optimal balance is typically 75% - 85%).",
        "Choose your target output format: maintain original format or convert to next-gen WebP.",
        "Optionally configure maximum dimensions to downscale images for web page speed optimization.",
        "Review individual file savings percentages and download images individually or as a single ZIP archive."
      ],
      "formulaOrLogic": "Employs client-side HTML5 Canvas 2D rasterization alongside browser-native WebP/JPEG lossy compression encoders. Downscales pixel matrices using bilinear filtering and applies DCT/quantization tables to strip redundant high-frequency image data without visible perceptual loss.",
      "useCases": [
        "Web Performance Optimization: Shrink image payloads to boost Google Core Web Vitals and Largest Contentful Paint (LCP).",
        "Email & Messaging Limits: Reduce multi-megabyte DSLR photographs down to lightweight files suitable for email attachments.",
        "Job & Passport Applications: Downsize scanned profile photos and certificates to comply with strict 100KB portal file constraints.",
        "E-Commerce Catalogues: Standardize and compress hundreds of product catalog images into high-performance WebP formats."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "How much file size reduction can I expect from image compression?",
        "answer": "Converting raw PNGs or unoptimized JPEGs to modern WebP format typically cuts file size by 65% to 85% while preserving visual clarity and sharp lines."
      },
      {
        "question": "Are my private personal photos uploaded to any external server?",
        "answer": "No. All compression algorithms and format conversions execute 100% locally in your browser memory using HTML5 Canvas primitives. Your files never touch a remote server."
      },
      {
        "question": "Can I compress multiple images at the same time?",
        "answer": "Yes. You can drag and drop up to 10 images simultaneously. The batch processor optimizes them concurrently and allows you to download them individually or as a ZIP archive."
      },
      {
        "question": "What is the advantage of converting PNG and JPEG to WebP?",
        "answer": "WebP provides superior lossy and lossless compression for web images, yielding files that are 25% to 34% smaller than comparable JPEGs and PNGs at equivalent quality ratings."
      },
      {
        "question": "Does this image compressor impose watermarks or require a login?",
        "answer": "No watermarks, file limits, or account sign-ups are imposed. The tool is 100% free, private, and unlimited for personal and commercial usage."
      }
    ],
    "guide": {
      "title": "Modern Web Image Optimization",
      "description": "Speed up your website's Largest Contentful Paint (LCP) and save mobile data by optimizing imagery before publication.",
      "steps": [
        "Upload up to 10 images (JPEG, PNG, WebP).",
        "Adjust the compression quality slider (recommended: 75%-85%).",
        "Select your output format (WebP is optimal for web performance).",
        "Compare original vs compressed size with percentage saved badges and download."
      ]
    },
    "relatedToolSlugs": [
      "pdf-toolkit",
      "youtube-extractor"
    ],
    "keywords": [
      "Image Compressor",
      "compress image online",
      "reduce image size",
      "compress png online",
      "compress jpg free",
      "convert png to webp",
      "bulk image compressor",
      "lossless image compression",
      "photo size reducer in kb"
    ]
  },
  {
    "id": "tdee-macro-calculator",
    "slug": "tdee-macro-calculator",
    "name": "TDEE, BMR & Fitness Macro Calculator",
    "shortDescription": "Calculate your Total Daily Energy Expenditure (TDEE), Basal Metabolic Rate (BMR), and custom Protein, Carb, and Fat splits tailored for Cutting, Maintenance, or Lean Bulking.",
    "category": "productivity",
    "iconName": "Activity",
    "cpcTier": "volume",
    "badge": "Health & Fitness",
    "adSenseChannelId": "ch_productivity_02",
    "primaryKeyword": "TDEE Calculator",
    "secondaryKeywords": [
      "total daily energy expenditure",
      "bmr calculator",
      "macro calculator for weight loss",
      "daily calorie calculator",
      "cutting macro calculator",
      "protein intake calculator",
      "bulking calories calculator",
      "mifflin st jeor formula"
    ],
    "seoTitle": "TDEE & Macro Calculator \u2013 Daily Calories & Protein Plan",
    "seoDescription": "Calculate your daily TDEE, BMR, and exact macro targets for cutting, maintenance, or bulking via Mifflin-St Jeor. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Select your gender and input your current age, weight (kg or lbs), and height (cm or ft/in).",
        "Choose your activity multiplier from Sedentary (office job) to Very Active (heavy daily training).",
        "Select your primary fitness objective: Aggressive Cut (-500 kcal), Moderate Cut (-250 kcal), Maintain, or Lean Bulk (+300 kcal).",
        "Review your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
        "Examine your targeted daily macronutrient grams for Protein (4 kcal/g), Fats (9 kcal/g), and Carbohydrates (4 kcal/g)."
      ],
      "formulaOrLogic": "Calculates Basal Metabolic Rate via the Mifflin-St Jeor formula: BMR = (10 \u00d7 weight_kg) + (6.25 \u00d7 height_cm) - (5 \u00d7 age_years) + s (where s = +5 for men, -161 for women). TDEE = BMR \u00d7 Activity Multiplier (1.2 to 1.9). Macro targets allocate 2.0g protein/kg, 25-30% calories to fats, and remaining calories to carbs.",
      "useCases": [
        "Fat Loss & Cutting Phase: Determine the precise sustainable caloric deficit required to burn fat while sparing lean muscle tissue.",
        "Lean Muscle Hypertrophy: Calculate a modest 250-350 calorie surplus to support muscular growth without excessive body fat gain.",
        "Metabolic Maintenance: Pinpoint energy equilibrium to stabilize body weight following prolonged diet phases.",
        "Nutritional Prep for Athletes: Structure carbohydrate and protein requirements to fuel high-intensity athletic conditioning."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "What is the physiological difference between BMR and TDEE?",
        "answer": "BMR (Basal Metabolic Rate) is the energy expended at rest to sustain vital bodily functions like respiration and circulation. TDEE (Total Daily Energy Expenditure) adds daily movement, exercise, and digestion to your BMR."
      },
      {
        "question": "Why is the Mifflin-St Jeor equation considered the industry gold standard?",
        "answer": "Clinical studies consistently show the Mifflin-St Jeor equation predicts resting metabolic rate within 10% of indirect calorimetry measurements, outperforming the legacy Harris-Benedict formula."
      },
      {
        "question": "How are protein, carbohydrate, and fat gram targets calculated?",
        "answer": "Protein is allocated at 1.8g to 2.2g per kg of bodyweight to protect muscle tissue, healthy dietary fats are set to 25-30% of total caloric intake, and carbohydrates fill the remaining calorie allowance."
      },
      {
        "question": "How often should I recalculate my TDEE as my body weight changes?",
        "answer": "You should recalculate your TDEE every 4 to 6 weeks or whenever your body weight shifts by 3 to 5 kg (7 to 11 lbs), as metabolic output scales alongside total mass."
      },
      {
        "question": "Is an account or sign-up necessary to access macro calculation results?",
        "answer": "No registration, profile setup, or credit card is ever required. Your health metrics are processed instantly in your browser without saving personal data."
      }
    ],
    "guide": {
      "title": "Calculating Energy Balance & Macronutrients",
      "description": "Achieve your fitness goals with scientific nutritional targets calculated from your personal metabolic statistics.",
      "formula": "BMR = (10 \u00d7 weight_kg) + (6.25 \u00d7 height_cm) - (5 \u00d7 age) [+5 for men / -161 for women]",
      "steps": [
        "Select gender, enter age, weight (kg or lbs), and height (cm or ft/inches).",
        "Select your typical weekly physical activity tier.",
        "Choose your fitness objective: Aggressive Cut (-500 kcal), Moderate Cut (-250 kcal), Maintenance, or Lean Bulk (+300 kcal).",
        "View your exact daily targets for Calories, Protein (g), Carbohydrates (g), and Healthy Fats (g)."
      ]
    },
    "relatedToolSlugs": [
      "sip-calculator",
      "text-utility"
    ],
    "keywords": [
      "TDEE Calculator",
      "total daily energy expenditure",
      "bmr calculator",
      "macro calculator for weight loss",
      "daily calorie calculator",
      "cutting macro calculator",
      "protein intake calculator",
      "bulking calories calculator",
      "mifflin st jeor formula"
    ]
  },
  {
    "id": "security-vault",
    "slug": "security-vault",
    "name": "Cryptographic Password & Hash Generator",
    "shortDescription": "Generate cryptographically secure passwords using window.crypto.subtle, evaluate brute-force entropy bits and crack time, and compute SHA-256 and MD5 hashes.",
    "category": "security",
    "iconName": "ShieldCheck",
    "cpcTier": "high",
    "badge": "CSPRNG Verified",
    "adSenseChannelId": "ch_security_01",
    "primaryKeyword": "Password Generator",
    "secondaryKeywords": [
      "secure password generator",
      "sha256 hash generator",
      "password entropy calculator",
      "cryptographic random password",
      "md5 hash generator online",
      "sha512 checksum tool",
      "brute force crack time",
      "offline password generator"
    ],
    "seoTitle": "Password & Hash Generator \u2013 Cryptographic Entropy Checker",
    "seoDescription": "Generate CSPRNG passwords and compute SHA-256/MD5 hashes in your browser. Measure brute-force entropy bits online. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Switch between the CSPRNG Password Generator tab and Cryptographic Hash Generator tab.",
        "For Passwords: Adjust the length slider between 8 and 64 characters.",
        "Toggle character sets: uppercase letters, lowercase letters, numbers, and high-entropy symbols.",
        "Evaluate the real-time entropy score in bits and review the estimated brute-force crack time.",
        "For Hashes: Enter any plain text string to instantly compute SHA-256, SHA-512, and MD5 digests."
      ],
      "formulaOrLogic": "Generates cryptographically random indices via window.crypto.getRandomValues (CSPRNG) across character pools. Entropy is calculated as E = L \u00d7 log2(R), where L is password length and R is pool size (e.g., 94 for full ASCII). Hashing uses Web Crypto API (SubtleCrypto.digest) for native SHA-256/512 execution.",
      "useCases": [
        "Master Password Creation: Generate high-entropy master passwords for 1Password, Bitwarden, or KeePass password vaults.",
        "API Secret & Token Generation: Create unguessable cryptographic tokens, session keys, and database passwords.",
        "Data Integrity Verification: Compute SHA-256 checksums to verify that downloaded files or strings match published hashes.",
        "Credential Auditing: Test existing company passwords against mathematical entropy thresholds to prevent brute-force attacks."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "How does this generator differ from standard random password tools?",
        "answer": "Standard online tools often use Math.random(), which is pseudo-random and predictable. We exclusively use window.crypto.getRandomValues(), hardware-backed CSPRNG meeting military security standards."
      },
      {
        "question": "What constitutes a mathematically strong password entropy score?",
        "answer": "Entropy measures unpredictability in bits. Passwords with 60 to 75 bits resist automated cracking, while passwords with 80+ bits of entropy are virtually uncrackable against modern supercomputers."
      },
      {
        "question": "Are generated passwords or hashed strings logged or sent to any server?",
        "answer": "Never. All cryptographic routines execute entirely in your browser using local Web Crypto APIs. You can disconnect your device from the internet and the generator will continue working."
      },
      {
        "question": "Can I use this tool to calculate file or text checksums for data integrity?",
        "answer": "Yes. The hashing utility computes instant cryptographic digests using SHA-256, SHA-512, and legacy MD5, allowing you to verify text data against published checksums."
      },
      {
        "question": "Does this security utility require registration, software, or login?",
        "answer": "No account creation, browser extensions, or logins are needed. It is a completely free, client-side cryptographic utility."
      }
    ],
    "guide": {
      "title": "Cryptographic Passwords & Hash Verification",
      "description": "Harden your digital accounts and verify file checksum integrity using hardware-backed cryptographic browser primitives.",
      "formula": "Entropy (bits) = Length \u00d7 log2(Charset Pool Size)",
      "steps": [
        "Toggle Password Generator or Text Hasher.",
        "For Passwords: Adjust length (8 to 64 chars) and include uppercase, lowercase, numbers, and symbols.",
        "Check real-time entropy score and estimated crack time.",
        "For Hasher: Type or paste any text string to view real-time SHA-256, SHA-512, and MD5 hashes."
      ]
    },
    "relatedToolSlugs": [
      "json-jwt-studio",
      "text-utility"
    ],
    "keywords": [
      "Password Generator",
      "secure password generator",
      "sha256 hash generator",
      "password entropy calculator",
      "cryptographic random password",
      "md5 hash generator online",
      "sha512 checksum tool",
      "brute force crack time",
      "offline password generator"
    ]
  },
  {
    "id": "text-utility",
    "slug": "text-utility",
    "name": "Word Counter, Reading Time & Case Converter",
    "shortDescription": "Real-time content analysis with Word, Character, Sentence, and Paragraph counts, estimated Reading/Speaking times, Top-5 Keyword density, and 1-click case converters.",
    "category": "productivity",
    "iconName": "FileSpreadsheet",
    "cpcTier": "volume",
    "badge": "Daily Utility",
    "adSenseChannelId": "ch_productivity_03",
    "primaryKeyword": "Word Counter",
    "secondaryKeywords": [
      "word counter online",
      "character count tool",
      "reading time calculator",
      "case converter online",
      "sentence counter",
      "keyword density analyzer",
      "camelcase converter",
      "word count for essays"
    ],
    "seoTitle": "Word Counter & Text Analyzer \u2013 Character & Case Tool",
    "seoDescription": "Analyze text with word, character, sentence counts, reading time, and keyword density. Convert case formats instantly. 100% free with no login required.",
    "editorialGuide": {
      "howToSteps": [
        "Paste or type your draft text into the live analytical editor.",
        "Review immediate real-time statistics: total words, characters (with and without spaces), and sentences.",
        "Check calculated Reading Time (based on 225 WPM) and Speaking Time (based on 130 WPM).",
        "Inspect the Top Keyword Density widget to detect word repetition and optimize SEO balance.",
        "Click any one-click case transformation button (UPPERCASE, lowercase, Title Case, camelCase, snake_case) to reformat text."
      ],
      "formulaOrLogic": "Tokenizes text streams via Unicode-aware RegEx word boundaries. Reading time is calculated as Words / 225 WPM; speaking time as Words / 130 WPM. Keyword frequency parses lowercase tokens, strips common English stop words, and ranks frequency distributions as (Token Occurrences / Total Clean Words) \u00d7 100.",
      "useCases": [
        "Essay & Academic Writing: Stay within strict university assignment word limits and character caps.",
        "Social Media Copywriting: Craft posts conforming to character boundaries for Twitter/X (280), LinkedIn, and meta descriptions.",
        "Podcast & Speech Scripting: Estimate accurate oral delivery time for conference keynotes, YouTube videos, and presentations.",
        "Developer Naming Conventions: Transform natural language phrases into camelCase, snake_case, or kebab-case code variables."
      ]
    },
    "faqs": [
      {
        "question": "Is this tool 100% free to use, and is any login required?",
        "answer": "Yes, this tool is 100% free with no login required, no account creation, no subscriptions, and zero paywalls. All calculations and processing run privately on your device."
      },
      {
        "question": "How is estimated reading and speaking time calculated?",
        "answer": "Reading time is modeled on the average adult silent reading speed of 225 words per minute (WPM). Speaking time is modeled on a conversational keynote delivery rate of 130 WPM."
      },
      {
        "question": "What text casing transformations does this utility support?",
        "answer": "You can convert text into UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, and kebab-case with a single click."
      },
      {
        "question": "How does the keyword density analysis assist SEO content writers?",
        "answer": "The keyword density analyzer filters out common stop words (e.g., 'the', 'is', 'at') to display your most frequent keywords, helping you target primary keywords without keyword stuffing."
      },
      {
        "question": "Are my written drafts or sensitive texts uploaded to any server?",
        "answer": "No. All text parsing, word counting, and casing transformations happen purely in your browser's local memory. Your writing remains strictly confidential."
      },
      {
        "question": "Is there any word limit, subscription fee, or login required to use this tool?",
        "answer": "There are zero word limits, paywalls, or account login requirements. You can analyze documents of any length completely free of charge."
      }
    ],
    "guide": {
      "title": "Copywriting Metrics & Typography Formatting",
      "description": "Optimize essay length, social media character limits, and blog post reading time while cleaning up formatting inconsistencies.",
      "steps": [
        "Type or paste your text into the live editor.",
        "Observe the dynamic stats dashboard: words, characters, sentences, reading and speaking times.",
        "Inspect the Top Keyword Density widget to check keyword recurrence.",
        "Click any case transformation button to reformat text instantly, then click 'Copy'."
      ]
    },
    "relatedToolSlugs": [
      "json-jwt-studio",
      "pdf-toolkit"
    ],
    "keywords": [
      "Word Counter",
      "word counter online",
      "character count tool",
      "reading time calculator",
      "case converter online",
      "sentence counter",
      "keyword density analyzer",
      "camelcase converter",
      "word count for essays"
    ]
  }
];

export function getToolBySlug(slug: string): ToolDefinition | undefined {
  return TOOLS_REGISTRY.find((tool) => tool.slug === slug);
}

export function getToolsByCategory(category: string): ToolDefinition[] {
  return TOOLS_REGISTRY.filter((tool) => tool.category === category);
}

export function getRelatedTools(tool: ToolDefinition): ToolDefinition[] {
  if (tool.relatedToolSlugs && tool.relatedToolSlugs.length > 0) {
    return tool.relatedToolSlugs
      .map((slug) => getToolBySlug(slug))
      .filter((t): t is ToolDefinition => Boolean(t));
  }
  return TOOLS_REGISTRY.filter((t) => t.category === tool.category && t.slug !== tool.slug).slice(0, 3);
}
