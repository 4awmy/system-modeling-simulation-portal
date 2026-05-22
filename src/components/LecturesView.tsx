import React, { useState } from 'react';
import { FileText, Megaphone, Pin, ChevronRight, ExternalLink, Library, ChevronDown, ChevronUp } from 'lucide-react';
import {
  LineVisualizer,
  CircleVisualizer,
  EllipseVisualizer,
  FillingVisualizer,
  FramebufferCalculator,
  BezierCurveVisualizer,
  Transform2DVisualizer,
  CompositeTransformVisualizer,
  Transform3DVisualizer,
  CRTVectRasterVisualizer,
  ScanLineVisualizer
} from './Demos';

interface LectureDetail {
  title: string;
  content: string;
}

interface Lecture {
  id: string;
  week: string;
  title: string;
  description: string;
  pdfUrl: string;
  concepts: string[];
  keyDetails: LectureDetail[];
}

interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  pinned: boolean;
}

interface LecturesViewProps {
  lectures: Lecture[];
  announcements: Announcement[];
  onNavigateToExercise?: (exerciseId: string) => void;
}

export const LecturesView: React.FC<LecturesViewProps> = ({ lectures, announcements, onNavigateToExercise }) => {
  const [selectedLecId, setSelectedLecId] = useState<string>(lectures[0]?.id || '');
  const [activeLectureViewTab, setActiveLectureViewTab] = useState<'web' | 'pdf'>('pdf'); // Default to PDF Slides
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isAnnouncementsExpanded, setIsAnnouncementsExpanded] = useState<boolean>(true);

  const selectedLec = lectures.find(l => l.id === selectedLecId) || lectures[0];

  const renderLectureDemos = (lecId: string) => {
    const numId = parseInt(String(lecId).replace(/\D/g, ''), 10);
    
    switch (numId) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">CRT Sweep & Deflection (Raster vs Vector)</h4>
              <CRTVectRasterVisualizer />
            </div>
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Framebuffer Calculator</h4>
              <FramebufferCalculator />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Scan-Line Polygon Filling (ET & AET)</h4>
              <ScanLineVisualizer />
            </div>
            <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Boundary-Fill & Flood-Fill Seed Filling</h4>
              <div className="space-y-4">
                <div className="bg-white p-4 border border-slate-150 rounded-lg space-y-1">
                  <h5 className="font-bold text-[10px] text-aast-navy uppercase tracking-wide">Boundary-Fill (Boundary Mode)</h5>
                  <FillingVisualizer defaultType="boundary" />
                </div>
                <div className="bg-white p-4 border border-slate-150 rounded-lg space-y-1">
                  <h5 className="font-bold text-[10px] text-aast-navy uppercase tracking-wide">Flood-Fill (Flood Mode)</h5>
                  <FillingVisualizer defaultType="flood" />
                </div>
                <div className="bg-white p-4 border border-slate-150 rounded-lg space-y-1">
                  <h5 className="font-bold text-[10px] text-aast-navy uppercase tracking-wide">4/8-Connectivity (8-connected)</h5>
                  <FillingVisualizer defaultConnectivity={8} />
                </div>
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Framebuffer Calculator</h4>
            <FramebufferCalculator />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Line Drawing Sandbox</h4>
            <LineVisualizer defaultAlg="bresenham" />
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Midpoint Circle Sandbox</h4>
            <CircleVisualizer />
          </div>
        );
      case 6:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Midpoint Ellipse Sandbox</h4>
            <EllipseVisualizer />
          </div>
        );
      case 8:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Bézier Curve Sandbox</h4>
            <BezierCurveVisualizer />
          </div>
        );
      case 9:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive 2D Transformation Sandbox</h4>
            <Transform2DVisualizer />
          </div>
        );
      case 10:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive Composite 2D Transformation Sandbox</h4>
            <CompositeTransformVisualizer />
          </div>
        );
      case 11:
        return (
          <div className="space-y-4">
            <h4 className="font-bold text-xs text-aast-navy uppercase tracking-wide">Interactive 3D Transformation Sandbox</h4>
            <Transform3DVisualizer />
          </div>
        );
      default:
        return null;
    }
  };

  const showPracticeButton = onNavigateToExercise && (selectedLec.id === 'lec4' || selectedLec.id === 'lec5');
  const practiceExId = selectedLec.id === 'lec4' ? 'ex_line_1' : 'ex_circle_1';
  const practiceLabel = selectedLec.id === 'lec4' ? "Practice Bresenham's Line Algorithm" : "Practice Midpoint Circle Algorithm";

  return (
    <div className="flex gap-6 relative items-start animate-fade-in">
      
      {/* Collapsible Left Sidebar */}
      <div
        className={`transition-all duration-300 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-4 shrink-0 self-stretch ${
          isSidebarOpen ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden p-0 border-0'
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <h3 className="font-bold text-aast-navy text-xs uppercase tracking-wider flex items-center space-x-2">
            <Library className="h-4 w-4 text-aast-gold" />
            <span>All Lectures</span>
          </h3>
        </div>
        <div className="flex flex-col space-y-1 overflow-y-auto max-h-[600px] pr-1">
          {lectures.map((lec) => (
            <button
              key={lec.id}
              onClick={() => setSelectedLecId(lec.id)}
              className={`text-left px-3 py-2 text-xs font-semibold rounded-lg transition-all flex items-start space-x-2 ${
                selectedLecId === lec.id
                  ? 'bg-aast-navy text-aast-gold shadow-sm font-bold'
                  : 'text-slate-650 hover:bg-slate-50'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${selectedLecId === lec.id ? 'bg-aast-gold' : 'bg-slate-350'}`} />
              <div className="flex-1 min-w-0">
                <div className="text-[9px] opacity-75 font-mono leading-none mb-0.5">{lec.week}</div>
                <div className="truncate leading-tight">{lec.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 space-y-6">
        
        {/* Collapsible Announcements Banner */}
        {announcements.length > 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-fade-in">
            <button
              onClick={() => setIsAnnouncementsExpanded(!isAnnouncementsExpanded)}
              className="w-full bg-aast-navy text-white px-4 py-3 flex items-center justify-between hover:bg-slate-800 transition-colors"
            >
              <div className="flex items-center space-x-2">
                <Megaphone className="h-4 w-4 text-aast-gold" />
                <span className="text-xs font-bold uppercase tracking-wider flex items-center space-x-1.5">
                  <span>Announcements Board</span>
                  <span className="bg-aast-gold text-aast-navy font-black text-[9px] px-1.5 py-0.5 rounded-full">
                    {announcements.length}
                  </span>
                </span>
              </div>
              <div className="text-slate-300 hover:text-white">
                {isAnnouncementsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </div>
            </button>
            {isAnnouncementsExpanded && (
              <div className="p-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 bg-slate-50 border-t border-slate-100">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-lg border relative bg-white shadow-sm flex flex-col justify-between ${
                      ann.pinned ? 'border-aast-gold/40 ring-1 ring-aast-gold/10' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[9px] text-slate-400 font-mono font-semibold">{ann.date}</span>
                        {ann.pinned && (
                          <span className="flex items-center space-x-0.5 text-aast-gold text-[9px] font-black uppercase">
                            <Pin className="h-2.5 w-2.5 fill-aast-gold text-aast-gold" />
                            <span>Pinned</span>
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 mb-1 leading-snug">{ann.title}</h4>
                      <p className="text-[11px] text-slate-500 leading-relaxed">{ann.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Navigation & Tab Bar Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold text-xs shadow-sm hover:bg-slate-200 transition-colors"
            >
              <span>{isSidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}</span>
            </button>
          </div>
          
          <div className="flex items-center justify-between sm:justify-end gap-4">
            {/* Tabs Trigger Switcher */}
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setActiveLectureViewTab('pdf')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
                  activeLectureViewTab === 'pdf'
                    ? 'bg-aast-navy text-white shadow-sm'
                    : 'text-slate-650 hover:text-slate-800'
                }`}
              >
                Original Slides PDF
              </button>
              <button
                onClick={() => setActiveLectureViewTab('web')}
                className={`px-4 py-1.5 rounded-md font-bold text-xs transition-all ${
                  activeLectureViewTab === 'web'
                    ? 'bg-aast-navy text-white shadow-sm'
                    : 'text-slate-650 hover:text-slate-800'
                }`}
              >
                Interactive Web Lesson
              </button>
            </div>

            <a
              href={`./${selectedLec.pdfUrl}`}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center space-x-1.5 px-3 py-2 bg-aast-navy-soft text-aast-navy hover:bg-aast-navy hover:text-white rounded-lg font-bold text-xs transition-colors border border-aast-navy/10"
            >
              <span>Download PDF</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>

        {/* Tab Contents */}
        {activeLectureViewTab === 'web' ? (
          <div className="max-w-4xl mx-auto w-full space-y-6 animate-fade-in">
            {/* Topic Title Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center space-x-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-aast-navy-soft text-aast-navy">
                  {selectedLec.week}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Interactive Web Lesson</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-aast-navy tracking-tight">{selectedLec.title}</h2>
              <p className="text-sm text-slate-500 leading-relaxed">{selectedLec.description}</p>
              
              {/* Concept tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedLec.concepts.map((concept, index) => (
                  <span key={index} className="text-[10px] px-2.5 py-0.5 bg-slate-100 text-slate-650 font-bold rounded">
                    {concept}
                  </span>
                ))}
              </div>
            </div>

            {/* Lecture Notes and Formulas (GeeksforGeeks style articles) */}
            <div className="space-y-6">
              {selectedLec.keyDetails.map((detail, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                  <h3 className="text-lg font-bold text-aast-navy border-l-4 border-aast-gold pl-3 leading-snug">
                    {detail.title}
                  </h3>
                  
                  <div className="text-xs sm:text-sm text-slate-650 leading-relaxed whitespace-pre-line font-medium prose max-w-none">
                    {/* Render text with styled formula blocks when equations are present */}
                    {detail.content.split('\n').map((line, lIdx) => {
                      if (!line.trim()) return <div key={lIdx} className="h-2" />;
                      
                      const isEquation = line.includes('=') || line.includes('<=') || line.includes('>=') || line.includes(' m ') || line.trim().startsWith('P_') || line.trim().startsWith('X_') || line.trim().startsWith('Y_');
                      const isCodeOrStep = line.trim().startsWith('-') || line.trim().match(/^\d+\./);
                      
                      if (isEquation && line.trim().length > 3) {
                        return (
                          <div key={lIdx} className="my-2 bg-slate-50 px-4 py-2.5 rounded-lg font-mono text-[11px] sm:text-xs text-aast-navy border border-slate-150 shadow-inner block max-w-full overflow-x-auto whitespace-pre">
                            {line}
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className={`mb-1 ${isCodeOrStep ? 'text-slate-750 font-bold pl-2' : 'text-slate-650'}`}>
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* PDF Slides Viewer Tab (WebView Iframe) */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px] animate-fade-in">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-aast-navy" />
                <span className="text-xs font-bold text-slate-700">Original Lecture Slides PDF (webview)</span>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold">{selectedLec.week} Slides Reference</span>
            </div>
            <iframe
              src={`./${selectedLec.pdfUrl}`}
              className="w-full flex-1 border-0"
              title={`${selectedLec.title} slides`}
            />
          </div>
        )}

        {/* Global Demos & Practice Zone Card (Rendered below the active tab view) */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6 hover:shadow-md transition-shadow">
          <h3 className="text-lg font-black text-aast-navy border-b border-slate-100 pb-3 flex items-center space-x-2">
            <FileText className="h-5 w-5 text-aast-gold" />
            <span>Interactive Sandbox & Practice Zone</span>
          </h3>
          
          {/* Render Demos */}
          {renderLectureDemos(selectedLec.id)}

          {/* Practice redirection button */}
          {showPracticeButton && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => onNavigateToExercise && onNavigateToExercise(practiceExId)}
                className="px-4 py-2.5 bg-aast-gold hover:bg-aast-gold-dark text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center space-x-2"
              >
                <span>{practiceLabel}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
