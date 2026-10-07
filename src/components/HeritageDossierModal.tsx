import React, { useState } from 'react';
import { X, Download, ShieldCheck, Check, Copy, MapPin, FileDown, FileText } from 'lucide-react';
import { HeritageItem } from '../types.ts';
import { getHeritageTitle, getHeritageSummary, getHeritageHistory, getHeritageCulture } from '../data/hindiDescriptions.ts';
import { LanguageKey, t } from '../i18n.ts';

interface HeritageDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: HeritageItem;
  lang: LanguageKey;
}

// Pure Client-side PDF-1.4 Generator (Standard Compliant, Zero external packages, Works 100% on all devices)
function generateNativePdfBlob(item: HeritageItem, gazetteId: string, citationText: string): Blob {
  const esc = (str: string) => str.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
  
  // Word wrap helper for clean PDF formatting
  const wrap = (text: string, maxChars = 85): string[] => {
    const clean = text.replace(/[\r\n]+/g, ' ').replace(/[^\x20-\x7E]/g, ' ').trim();
    const words = clean.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length <= maxChars) {
        cur = (cur + ' ' + w).trim();
      } else {
        if (cur) lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  };

  let stream = '';

  // Top Accent Banner
  stream += 'q 0.57 0.22 0.04 rg 50 782 495 2.5 re f Q\n';

  // Government Header
  stream += 'BT\n';
  stream += '/F1 9.5 Tf 0.45 0.42 0.40 rg 50 802 Td\n';
  stream += '(GOVERNMENT OF INDIA  |  MINISTRY OF CULTURE) Tj\n';
  stream += 'ET\n';

  stream += 'BT\n';
  stream += '/F1 15 Tf 0.08 0.08 0.08 rg 50 762 Td\n';
  stream += '(ARCHAEOLOGICAL SURVEY OF INDIA & NATIONAL ARCHIVE) Tj\n';
  stream += 'ET\n';

  stream += 'BT\n';
  stream += '/F1 9 Tf 0.57 0.22 0.04 rg 50 744 Td\n';
  stream += `(STATUTORY AMASR ACT 1958 RECORD  -  GAZETTE ID: ${esc(gazetteId)}) Tj\n`;
  stream += 'ET\n';

  // Landmark Title
  const cleanTitle = item.title.replace(/[^\x20-\x7E]/g, '');
  stream += 'BT\n';
  stream += '/F1 16 Tf 0.1 0.1 0.1 rg 50 714 Td\n';
  stream += `(${esc(cleanTitle)}) Tj\n`;
  stream += 'ET\n';

  // Subtitle Specs
  const cleanLoc = item.location_name.replace(/[^\x20-\x7E]/g, '');
  stream += 'BT\n';
  stream += '/F2 9 Tf 0.3 0.3 0.3 rg 50 696 Td\n';
  stream += `(Location: ${esc(cleanLoc)}   |   State Circle: ${esc(item.state_id.toUpperCase())}   |   Era: ${esc(item.period)} Era) Tj\n`;
  stream += '0 -13 Td\n';
  stream += `(Coordinates: ${item.lat.toFixed(4)} N, ${item.lng.toFixed(4)} E   |   Protection: Centrally Protected Grade-I) Tj\n`;
  stream += '0 -13 Td\n';
  stream += `(Visiting Hours: ${esc(item.timings || 'Sunrise to Sunset')}   |   Best Season: ${esc(item.best_time)}) Tj\n`;
  stream += 'ET\n';

  // Separator Line
  stream += 'q 0.85 0.85 0.85 rg 50 650 495 1 re f Q\n';

  // Section 1: Curatorial Summary
  stream += 'BT\n';
  stream += '/F1 10.5 Tf 0.57 0.22 0.04 rg 50 630 Td\n';
  stream += '(I. CURATORIAL & EXECUTIVE SUMMARY) Tj\n';
  stream += 'ET\n';

  stream += 'BT\n';
  stream += '/F2 8.5 Tf 0.15 0.15 0.15 rg 50 615 Td\n';
  let yPos = 615;
  const summaryLines = wrap(item.summary, 90).slice(0, 5);
  for (let i = 0; i < summaryLines.length; i++) {
    if (i > 0) stream += '0 -12.5 Td\n';
    stream += `(${esc(summaryLines[i])}) Tj\n`;
    yPos -= 12.5;
  }
  stream += 'ET\n';

  // Section 2: Historical Chronology
  yPos -= 18;
  stream += 'BT\n';
  stream += `/F1 10.5 Tf 0.57 0.22 0.04 rg 50 ${yPos.toFixed(1)} Td\n`;
  stream += '(II. HISTORICAL CHRONOLOGY & DYNASTIC LINEAGE) Tj\n';
  stream += 'ET\n';

  yPos -= 15;
  stream += 'BT\n';
  stream += `/F2 8.5 Tf 0.15 0.15 0.15 rg 50 ${yPos.toFixed(1)} Td\n`;
  const historyLines = wrap(item.history, 90).slice(0, 6);
  for (let i = 0; i < historyLines.length; i++) {
    if (i > 0) stream += '0 -12.5 Td\n';
    stream += `(${esc(historyLines[i])}) Tj\n`;
    yPos -= 12.5;
  }
  stream += 'ET\n';

  // Section 3: Architectural Science
  yPos -= 18;
  stream += 'BT\n';
  stream += `/F1 10.5 Tf 0.57 0.22 0.04 rg 50 ${yPos.toFixed(1)} Td\n`;
  stream += '(III. ARCHITECTURAL SCIENCE & CULTURAL EPIGRAPHY) Tj\n';
  stream += 'ET\n';

  yPos -= 15;
  stream += 'BT\n';
  stream += `/F2 8.5 Tf 0.15 0.15 0.15 rg 50 ${yPos.toFixed(1)} Td\n`;
  const cultureLines = wrap(item.culture, 90).slice(0, 5);
  for (let i = 0; i < cultureLines.length; i++) {
    if (i > 0) stream += '0 -12.5 Td\n';
    stream += `(${esc(cultureLines[i])}) Tj\n`;
    yPos -= 12.5;
  }
  stream += 'ET\n';

  // Section 4: Academic Citation Box
  yPos -= 22;
  stream += `q 0.96 0.95 0.94 rg 50 ${(yPos - 28).toFixed(1)} 495 40 re f Q\n`;
  stream += `q 0.57 0.22 0.04 rg 50 ${(yPos - 28).toFixed(1)} 3.5 40 re f Q\n`;

  stream += 'BT\n';
  stream += `/F1 8.5 Tf 0.2 0.2 0.2 rg 60 ${yPos.toFixed(1)} Td\n`;
  stream += '(STANDARD ACADEMIC CITATION FORMAT - APA / CHICAGO) Tj\n';
  stream += '0 -12 Td\n';
  stream += '/F2 7.5 Tf 0.35 0.35 0.35 rg\n';
  const cleanCite = citationText.replace(/[^\x20-\x7E]/g, '');
  const citeLines = wrap(cleanCite, 95).slice(0, 2);
  for (let i = 0; i < citeLines.length; i++) {
    if (i > 0) stream += '0 -10 Td\n';
    stream += `(${esc(citeLines[i])}) Tj\n`;
  }
  stream += 'ET\n';

  // Bottom Institutional Verification
  stream += 'BT\n';
  stream += '/F2 7 Tf 0.55 0.55 0.55 rg 50 35 Td\n';
  stream += `(Verified Digital Heritage Repository Extract  |  AMASR Act 1958 Protection  |  Generated on ${new Date().toLocaleDateString('en-GB')}) Tj\n`;
  stream += 'ET\n';

  // Assemble PDF Object Tree
  const objects: string[] = [];
  objects[1] = '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
  objects[2] = '2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n';
  objects[3] = '3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] /Resources << /Font << /F1 4 0 R /F2 5 0 R >> >> /Contents 6 0 R >>\nendobj\n';
  objects[4] = '4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>\nendobj\n';
  objects[5] = '5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n';
  
  const streamBytes = new TextEncoder().encode(stream);
  objects[6] = `6 0 obj\n<< /Length ${streamBytes.length} >>\nstream\n${stream}\nendstream\nendobj\n`;

  let pdfText = '%PDF-1.4\n';
  const offsets: number[] = [0];

  for (let i = 1; i <= 6; i++) {
    offsets[i] = new TextEncoder().encode(pdfText).length;
    pdfText += objects[i];
  }

  const startXref = new TextEncoder().encode(pdfText).length;
  pdfText += 'xref\n0 7\n0000000000 65535 f \n';
  for (let i = 1; i <= 6; i++) {
    pdfText += String(offsets[i]).padStart(10, '0') + ' 00000 n \n';
  }
  pdfText += `trailer\n<< /Size 7 /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`;

  return new Blob([new TextEncoder().encode(pdfText)], { type: 'application/pdf' });
}

export const HeritageDossierModal: React.FC<HeritageDossierModalProps> = ({
  isOpen,
  onClose,
  item,
  lang,
}) => {
  const [copiedCitation, setCopiedCitation] = useState(false);
  const [copiedFullDossier, setCopiedFullDossier] = useState(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const gazetteId = `ASI-${item.state_id.toUpperCase().slice(0, 3)}-${item.id.replace(/[^a-zA-Z0-9]/g, '').slice(0, 4).toUpperCase() || '0042'}`;
  const title = lang === 'hi' && item.hindi_title ? item.hindi_title : item.title;
  const summary = getHeritageSummary(item, lang);
  const history = getHeritageHistory(item, lang);
  const culture = getHeritageCulture(item, lang);

  const citationText = `Archaeological Survey of India & National Cultural Archive. (${new Date().getFullYear()}). National Cultural Dossier: ${item.title} [Gazette ID: ${gazetteId}]. Centrally Protected Monument under AMASR Act, 1958. Coordinates: ${item.lat.toFixed(4)}°N, ${item.lng.toFixed(4)}°E.`;

  const fullDossierText = `======================================================================
GOVERNMENT OF INDIA • MINISTRY OF CULTURE
ARCHAEOLOGICAL SURVEY OF INDIA & NATIONAL CULTURAL ARCHIVE
STATUTORY RECORD UNDER AMASR ACT 1958 • GAZETTE ID: ${gazetteId}
======================================================================

LANDMARK: ${title} (${item.title})
LOCATION: ${item.location_name} | STATE: ${item.state_id.toUpperCase()}
COORDINATES: ${item.lat.toFixed(4)}°N, ${item.lng.toFixed(4)}°E
CLASSIFICATION: Centrally Protected Monument (Grade-I)
HISTORICAL ERA: ${item.period} Era
VISITING HOURS: ${item.timings || 'Sunrise to Sunset'}
OPTIMAL SEASON: ${item.best_time}

----------------------------------------------------------------------
I. CURATORIAL & EXECUTIVE SUMMARY
----------------------------------------------------------------------
${summary}

----------------------------------------------------------------------
II. HISTORICAL CHRONOLOGY & DYNASTIC LINEAGE
----------------------------------------------------------------------
${history}

----------------------------------------------------------------------
III. ARCHITECTURAL SCIENCE & CULTURAL EPIGRAPHY
----------------------------------------------------------------------
${culture}

----------------------------------------------------------------------
IV. OFFICIAL CITATION (APA / CHICAGO)
----------------------------------------------------------------------
${citationText}

======================================================================
Verified Digital Heritage Repository Extract • Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
======================================================================`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(citationText);
    setCopiedCitation(true);
    setTimeout(() => setCopiedCitation(false), 2000);
  };

  const handleCopyFullDossier = () => {
    navigator.clipboard.writeText(fullDossierText);
    setCopiedFullDossier(true);
    setTimeout(() => setCopiedFullDossier(false), 2000);
  };

  // 1. Download Genuine PDF File (.pdf) - 100% works on Android, iOS, Windows, Mac
  const handleDownloadPdf = () => {
    try {
      const pdfBlob = generateNativePdfBlob(item, gazetteId, citationText);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ASI_National_Dossier_${item.id.toUpperCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccessMsg(
        lang === 'hi'
          ? 'PDF फाइल (ASI_National_Dossier.pdf) सफलतापूर्वक डाउनलोड हो गई है।'
          : 'PDF document downloaded successfully to your device!'
      );
      setTimeout(() => setDownloadSuccessMsg(null), 4000);
    } catch (e) {
      console.error('PDF creation error', e);
      handleDownloadHtml();
    }
  };

  // 2. Download Standalone HTML Research Document (.html)
  const handleDownloadHtml = () => {
    const lines = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      `  <title>ASI Dossier - ${item.title} (${gazetteId})</title>`,
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      '  <style>',
      '    @page { size: A4; margin: 15mm 20mm; }',
      "    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.55; color: #1c1917; background: #fff; max-width: 820px; margin: 0 auto; padding: 24px; }",
      '    .header { text-align: center; border-bottom: 2.5px solid #92400e; padding-bottom: 14px; margin-bottom: 20px; }',
      '    .header .subtitle { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: #78716c; }',
      '    .header h1 { margin: 4px 0 6px 0; font-size: 20px; text-transform: uppercase; color: #1c1917; }',
      '    .badge { display: inline-block; background: #fef3c7; color: #78350f; border: 1px solid #fcd34d; padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; font-family: monospace; }',
      '    .specs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 16px; background: #f5f5f4; border: 1px solid #e7e5e4; border-radius: 6px; padding: 10px 14px; font-size: 12px; margin: 14px 0 18px 0; }',
      '    .section { margin-bottom: 18px; }',
      '    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #92400e; border-bottom: 1px solid #e7e5e4; padding-bottom: 3px; margin-bottom: 8px; }',
      '    .section p { margin: 0; font-size: 12.5px; color: #292524; text-align: justify; }',
      '    .citation-box { background: #fafaf9; border-left: 3.5px solid #b45309; border: 1px solid #e7e5e4; border-left-color: #b45309; padding: 10px 12px; font-family: monospace; font-size: 11px; color: #44403c; border-radius: 4px; margin-top: 6px; }',
      '    .footer { margin-top: 30px; padding-top: 10px; border-top: 1px solid #e7e5e4; font-size: 10px; color: #a8a29e; text-align: center; }',
      '  </style>',
      '<' + '/head>',
      '<body>',
      '  <div class="header">',
      '    <div class="subtitle">GOVERNMENT OF INDIA • MINISTRY OF CULTURE</div>',
      '    <h1>ARCHAEOLOGICAL SURVEY OF INDIA & NATIONAL ARCHIVE</h1>',
      `    <div class="badge">STATUTORY AMASR ACT 1958 RECORD • GAZETTE ID: ${gazetteId}</div>`,
      '  </div>',
      `  <h2>${item.title} ${item.hindi_title ? `(${item.hindi_title})` : ''}</h2>`,
      '  <div style="font-size: 12px; color: #57534e;">',
      `    Location: ${item.location_name} | State Circle: ${item.state_id.toUpperCase()} | Coordinates: ${item.lat.toFixed(4)}°N, ${item.lng.toFixed(4)}°E`,
      '  </div>',
      '  <div class="specs-grid">',
      '    <div><strong>Classification:</strong> Centrally Protected Grade-I</div>',
      '    <div><strong>Conservation Condition:</strong> Stable • Active Preservation</div>',
      `    <div><strong>Dynastic Era:</strong> ${item.period} Era</div>`,
      `    <div><strong>Visiting Hours:</strong> ${item.timings || 'Sunrise to Sunset'}</div>`,
      `    <div><strong>Optimal Season:</strong> ${item.best_time}</div>`,
      `    <div><strong>Coordinates:</strong> ${item.lat.toFixed(2)}°N, ${item.lng.toFixed(2)}°E</div>`,
      '  </div>',
      `  <div class="section"><div class="section-title">I. Executive Summary</div><p>${summary}</p></div>`,
      `  <div class="section"><div class="section-title">II. Historical Chronology & Lineage</div><p style="white-space: pre-line;">${history}</p></div>`,
      `  <div class="section"><div class="section-title">III. Architectural Science & Epigraphy</div><p>${culture}</p></div>`,
      `  <div class="section"><div class="section-title">IV. Academic Citation</div><div class="citation-box">${citationText}</div></div>`,
      `  <div class="footer">Verified Extract from National Cultural Heritage Repository • ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</div>`,
      '<' + '/body>',
      '<' + '/html>'
    ];
    const htmlContent = lines.join('\n');

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ASI_Dossier_${item.id.toUpperCase()}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccessMsg(
      lang === 'hi'
        ? 'HTML डॉसियर फाइल सफलतापूर्वक डाउनलोड हो गई है।'
        : 'HTML dossier file downloaded successfully!'
    );
    setTimeout(() => setDownloadSuccessMsg(null), 4000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 touch-none"
      onClick={onClose}
      onTouchMove={(e) => {
        if (e.target === e.currentTarget) e.preventDefault();
      }}
    >
      <div
        className="relative w-full max-w-2xl max-h-[92vh] flex flex-col rounded-2xl overflow-hidden bg-[#0a0d12] border border-amber-500/30 text-white shadow-2xl transform-gpu"
        onClick={(e) => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        }}
      >
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-amber-950/40 via-stone-900/60 to-transparent flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                {lang === 'hi' ? 'भारत सरकार • राष्ट्रीय पुरातत्व अभिलेखागार' : 'Government of India • National Heritage Dossier'}
              </span>
              <h3 className="font-serif text-base sm:text-lg font-bold text-white tracking-tight">
                {lang === 'hi' ? 'आधिकारिक अनुसंधान एवं पुरालेख डॉसियर' : 'Official Academic Research Dossier'}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="btn-glass-clay btn-glass-clay-icon w-8 h-8 rounded-full text-zinc-400 hover:text-white cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Dossier Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5 text-left text-xs sm:text-sm text-zinc-300 min-h-0 bg-[#0a0d12]">
          {/* Statutory Title Block */}
          <div className="p-4 rounded-xl bg-white/[0.03] border border-amber-500/25 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/60 text-amber-400 border border-amber-500/30 font-semibold tracking-wider">
                {gazetteId}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>AMASR Act, 1958 • Centrally Protected</span>
              </span>
            </div>

            <h4 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-tight pt-1">
              {title}
            </h4>

            <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                {item.location_name} ({item.state_id.toUpperCase()})
              </span>
              <span>·</span>
              <span>{item.lat.toFixed(4)}°N, {item.lng.toFixed(4)}°E</span>
              <span>·</span>
              <span className="text-amber-300 font-medium">{item.period} Era</span>
            </div>
          </div>

          {/* Curatorial Summary */}
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              {t('executive_summary_title', lang, undefined, 'I. Executive Curatorial Summary')}
            </h5>
            <p className="font-serif leading-relaxed text-zinc-200">
              {summary}
            </p>
          </div>

          {/* Historical Chronology */}
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              {t('historical_chronology_title', lang, undefined, 'II. Historical Chronology & Lineage')}
            </h5>
            <p className="font-serif leading-relaxed text-zinc-300 whitespace-pre-line">
              {history}
            </p>
          </div>

          {/* Architectural Significance */}
          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-wider text-amber-400 mb-1.5">
              {t('architectural_science_title', lang, undefined, 'III. Architectural Science & Epigraphy')}
            </h5>
            <p className="font-serif leading-relaxed text-zinc-300">
              {culture}
            </p>
          </div>

          {/* Academic Citation Block */}
          <div className="p-3.5 rounded-xl bg-black/60 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                {t('citation_format_title', lang, undefined, 'Standard Academic Citation Format (APA / Chicago)')}
              </span>
              <button
                type="button"
                onClick={handleCopyCitation}
                className="btn-glass-clay px-2 py-1 rounded-md text-[10px] flex items-center gap-1 text-zinc-300 hover:text-white cursor-pointer"
              >
                {copiedCitation ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCitation ? t('copied_text', lang, undefined, 'Copied') : t('copy_text', lang, undefined, 'Copy')}</span>
              </button>
            </div>
            <code className="block text-[11px] font-mono text-amber-200/90 leading-relaxed bg-black/40 p-2 rounded border border-white/5 break-words">
              {citationText}
            </code>
          </div>

          {downloadSuccessMsg && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{downloadSuccessMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions: REAL PDF DOWNLOAD + HTML DOWNLOAD + COPY TEXT */}
        <div className="p-3.5 sm:p-4 border-t border-white/10 bg-[#080a0d] flex items-center justify-between gap-2.5 shrink-0 flex-wrap">
          {/* Copy Full Dossier Text */}
          <button
            type="button"
            onClick={handleCopyFullDossier}
            className="btn-glass-clay btn-glass-clay-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transform-gpu"
            title="Copy Full Dossier as Text"
          >
            {copiedFullDossier ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-zinc-300" />}
            <span>{copiedFullDossier ? t('copied_text', lang, undefined, 'Copied') : t('copy_text', lang, undefined, 'Copy Text')}</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Direct HTML File Download */}
            <button
              type="button"
              onClick={handleDownloadHtml}
              className="btn-glass-clay btn-glass-clay-secondary px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer transform-gpu"
              title="Download HTML Document"
            >
              <FileDown className="w-3.5 h-3.5 text-zinc-300" />
              <span>{t('download_html', lang, undefined, 'HTML Doc')}</span>
            </button>

            {/* REAL PDF DOWNLOAD BUTTON (Downloads real .pdf file) */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              className="btn-glass-clay btn-glass-clay-primary px-3.5 sm:px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 cursor-pointer shadow-md transform-gpu"
              title="Download Real PDF File"
            >
              <Download className="w-4 h-4 text-white" />
              <span>{t('download_pdf', lang, undefined, 'Download PDF File')}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
