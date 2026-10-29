const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const mdPath = path.join(rootDir, "GUIDE-USSD.md");
const pdfPath = path.join(rootDir, "GUIDE-USSD.pdf");
const tempHtmlPath = path.join(rootDir, "GUIDE-USSD.temp.html");
const logoPath = path.join(rootDir, "public", "assets", "logo_asac.png");

// 1. Read Markdown content
if (!fs.existsSync(mdPath)) {
  console.error("Fichier GUIDE-USSD.md introuvable !");
  process.exit(1);
}

// 2. Read logo and convert to base64
let logoBase64 = "";
if (fs.existsSync(logoPath)) {
  const logoBuffer = fs.readFileSync(logoPath);
  logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
}

// 3. Convert Markdown to HTML using marked
const rawHtml = execSync(`npx -y marked "${mdPath}" --gfm`, { encoding: "utf8" });

// 4. Construct Full HTML with print-ready CSS
const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Guide d'Intégration USSD - ASAC</title>
  <style>
    @page {
      size: A4;
      margin: 15mm 15mm 18mm 15mm;
    }

    @media print {
      body {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      h1, h2, h3 {
        page-break-after: avoid;
      }
      pre, blockquote, table {
        page-break-inside: avoid;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      font-size: 12px;
      line-height: 1.55;
      color: #1E293B;
      background-color: #FFFFFF;
      padding: 0;
    }

    /* Corporate Header */
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #0284C7;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }

    .doc-header .logo-container img {
      height: 44px;
      max-width: 170px;
      object-fit: contain;
    }

    .doc-header .meta-container {
      text-align: right;
    }

    .doc-header .meta-badge {
      display: inline-block;
      background-color: #E0F2FE;
      color: #0369A1;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 3px 8px;
      border-radius: 4px;
      margin-bottom: 3px;
    }

    .doc-header .meta-sub {
      font-size: 10.5px;
      color: #64748B;
    }

    /* Typography */
    h1 {
      font-size: 20px;
      font-weight: 800;
      color: #0F172A;
      line-height: 1.25;
      margin-bottom: 10px;
      letter-spacing: -0.3px;
    }

    h2 {
      font-size: 14.5px;
      font-weight: 700;
      color: #0F172A;
      border-bottom: 1px solid #E2E8F0;
      padding-bottom: 5px;
      margin-top: 20px;
      margin-bottom: 10px;
    }

    h3 {
      font-size: 13px;
      font-weight: 700;
      color: #1E293B;
      margin-top: 14px;
      margin-bottom: 6px;
    }

    h4 {
      font-size: 12px;
      font-weight: 700;
      color: #334155;
      margin-top: 12px;
      margin-bottom: 5px;
    }

    p {
      margin-bottom: 8px;
      color: #334155;
    }

    strong {
      color: #0F172A;
      font-weight: 600;
    }

    hr {
      border: 0;
      border-top: 1px solid #E2E8F0;
      margin: 16px 0;
    }

    /* Lists */
    ul, ol {
      margin-left: 18px;
      margin-bottom: 10px;
    }

    li {
      margin-bottom: 4px;
      color: #334155;
    }

    li > strong {
      color: #0F172A;
    }

    /* Code & Snippets */
    code {
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 11px;
      background-color: #F1F5F9;
      color: #0F172A;
      padding: 1.5px 5px;
      border-radius: 4px;
      border: 1px solid #E2E8F0;
    }

    pre {
      background-color: #0F172A;
      color: #F8FAFC;
      border-radius: 6px;
      padding: 10px 12px;
      margin: 8px 0 12px 0;
      overflow-x: auto;
      font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
      font-size: 10.5px;
      line-height: 1.42;
      border: 1px solid #1E293B;
      page-break-inside: avoid;
    }

    pre code {
      background-color: transparent;
      color: inherit;
      padding: 0;
      border: none;
      font-size: inherit;
    }

    /* Blockquotes / Alerts */
    blockquote {
      background-color: #F8FAFC;
      border-left: 4px solid #0284C7;
      padding: 7px 12px;
      margin: 10px 0;
      border-radius: 0 4px 4px 0;
      color: #334155;
      font-size: 11.5px;
    }

    blockquote p {
      margin-bottom: 0;
    }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 12px 0 16px 0;
      font-size: 11px;
      page-break-inside: avoid;
    }

    th {
      background-color: #F1F5F9;
      color: #0F172A;
      font-weight: 700;
      text-align: left;
      padding: 7px 9px;
      border: 1px solid #CBD5E1;
      font-size: 11px;
    }

    td {
      padding: 6px 9px;
      border: 1px solid #E2E8F0;
      color: #334155;
      vertical-align: top;
    }

    tr:nth-child(even) {
      background-color: #F8FAFC;
    }
  </style>
</head>
<body>

  <div class="doc-header">
    <div class="logo-container">
      ${logoBase64 ? `<img src="${logoBase64}" alt="ASAC Logo">` : `<span style="font-size:20px; font-weight:800; color:#0284C7;">ASAC</span>`}
    </div>
    <div class="meta-container">
      <div class="meta-badge">Documentation Technique d'Intégration</div>
      <div class="meta-sub">Canal USSD &bull; Version 2.0 &bull; Septembre 2026</div>
      <div class="meta-sub">Plateforme E-Attestation &bull; ASAC Cameroun</div>
    </div>
  </div>

  <div class="doc-content">
    ${rawHtml}
  </div>

</body>
</html>`;

// 5. Write temporary HTML
fs.writeFileSync(tempHtmlPath, fullHtml, "utf8");
console.log("HTML temporaire généré:", tempHtmlPath);

// 6. Run Google Chrome Headless to generate PDF with native footer pagination
const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
if (!fs.existsSync(chromePath)) {
  console.error("Google Chrome introuvable au chemin:", chromePath);
  process.exit(1);
}

const headerTemplate = `<div></div>`;
const footerTemplate = `<div style="font-size:8.5px; color:#94a3b8; width:100%; padding:0 15mm; display:flex; justify-content:space-between; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <span>ASAC &bull; Plateforme E-Attestation &bull; Sp&eacute;cification d&apos;Int&eacute;gration USSD</span>
  <span>Page <span class="pageNumber"></span> sur <span class="totalPages"></span></span>
</div>`;

// eslint-disable-next-line @typescript-eslint/no-require-imports
const { execFileSync } = require("child_process");

try {
  console.log("Génération du PDF via Google Chrome Headless...");
  const args = [
    "--headless=new",
    "--disable-gpu",
    "--no-pdf-header-footer",
    `--print-to-pdf=${pdfPath}`,
    tempHtmlPath
  ];
  execFileSync(chromePath, args, { stdio: "inherit" });
  console.log("PDF généré avec succès:", pdfPath);
} catch (err) {
  console.error("Erreur lors de la génération du PDF:", err);
  process.exit(1);
} finally {
  // 7. Cleanup temp HTML
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }
}
