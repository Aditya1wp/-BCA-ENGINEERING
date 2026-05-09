import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Search, 
  Download, 
  Layers, 
  PlusCircle, 
  Clock, 
  BookOpen, 
  AlertCircle, 
  CheckCircle2,
  Filter,
  ArrowLeft,
  CalendarDays,
  Hash,
  Binary,
  Cpu
} from 'lucide-react';

// Constants
const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

const COURSE_GROUPS = [
  { id: 'bca', name: 'BCA (Bachelor of Computer Applications)' },
  { id: 'btech', name: 'B.Tech Computer Science' },
  { id: 'mca', name: 'MCA (Master of Computer Applications)' },
  { id: 'bsc', name: 'B.Sc IT / CS' }
];

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [selectedGroupId, setSelectedGroupId] = useState('bca');
  const [selectedSemester, setSelectedSemester] = useState('All');
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  const fileInputRef = useRef(null);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadForm, setUploadForm] = useState({ 
    subjectCode: '',
    subjectName: '',
    year: new Date().getFullYear(),
    semester: '1st',
    file: null 
  });

  const fetchDocuments = async () => {
    try {
      const res = await fetch('/api/upload');
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setUploadError('');
    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setUploadError(`File size exceeds ${MAX_FILE_SIZE_MB}MB limit.`);
        setUploadForm(prev => ({ ...prev, file: null }));
        e.target.value = null;
      } else {
        setUploadForm(prev => ({ ...prev, file }));
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!uploadForm.subjectCode || !uploadForm.subjectName || !uploadForm.file) {
      setUploadError('Please provide subject code, name, and a PDF file.');
      return;
    }

    setUploading(true);
    try {
      // Convert file to Base64
      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });
      const fileBase64 = await fileToBase64(uploadForm.file);

      // Upload to GitHub via our API (which also updates database.json)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: uploadForm.file.name,
          fileSize: uploadForm.file.size,
          content: fileBase64,
          code: uploadForm.subjectCode,
          name: uploadForm.subjectName,
          sem: uploadForm.semester,
          year: uploadForm.year
        })
      });
      
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.error || 'Failed to upload to GitHub');
      }

      setUploadForm({ subjectCode: '', subjectName: '', year: new Date().getFullYear(), semester: '1st', file: null });
      setUploadError('');
      setView('dashboard');
      fetchDocuments(); // Refresh the list
    } catch (err) {
      console.error(err);
      setUploadError('Failed to upload. Please check your connection.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesGroup = doc.groupId === selectedGroupId;
      const matchesSemester = selectedSemester === 'All' || doc.semester === selectedSemester;
      const matchesSearch = 
        doc.subjectCode?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        doc.subjectName?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesGroup && matchesSemester && matchesSearch;
    });
  }, [documents, selectedGroupId, selectedSemester, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans text-slate-200 selection:bg-cyan-500/30">
      
      {/* --- SLEEK PREMIUM HEADER --- */}
      <header className="bg-[#0B1120]/80 backdrop-blur-xl border-b border-slate-800/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          
          {/* Logo Section */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('dashboard')}>
            <h1 className="font-black text-xl md:text-2xl text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-cyan-200 tracking-widest uppercase transition-opacity">
              BCA_ENGINEER
            </h1>
          </div>

          {/* Upload Button Area */}
          <div className="flex items-center gap-4">
            {view === 'dashboard' ? (
              <button 
                onClick={() => setView('upload')}
                className="group relative inline-flex items-center justify-center px-6 md:px-8 py-2.5 text-sm font-bold text-white transition-all duration-300 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-400 focus:ring-offset-[#0B1120]"
              >
                <span className="tracking-widest uppercase flex items-center gap-2">
                  <Upload size={16} className="text-cyan-400 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  Upload
                </span>
              </button>
            ) : (
              <button 
                onClick={() => setView('dashboard')}
                className="flex items-center gap-2 text-slate-400 hover:text-white font-bold transition-all px-5 py-2.5 bg-slate-800/50 border border-slate-700 rounded-full hover:bg-slate-800"
              >
                <ArrowLeft size={16} /> Return to Library
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8">
        {view === 'dashboard' ? (
          <div className="space-y-8">
            
            {/* --- DASHBOARD CONTROLS (Filters) --- */}
            <div className="flex flex-col gap-6 p-6 rounded-3xl border border-slate-800/80 bg-slate-900/40 backdrop-blur-md shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[80px] pointer-events-none rounded-full"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-4 flex-1">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 shadow-inner">
                    <Filter className="text-cyan-400" size={20} />
                  </div>
                  <select 
                    className="flex-1 bg-transparent border-none text-white font-extrabold text-xl focus:ring-0 cursor-pointer outline-none appearance-none"
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                  >
                    {COURSE_GROUPS.map(g => (
                      <option key={g.id} value={g.id} className="bg-slate-900 text-slate-200 text-base font-medium">{g.name}</option>
                    ))}
                  </select>
                </div>

                <div className="relative w-full md:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search code or subject..." 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 outline-none transition-all text-white placeholder-slate-500 shadow-inner font-medium"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-700/50 to-transparent"></div>

              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                <button 
                  onClick={() => setSelectedSemester('All')}
                  className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedSemester === 'All' ? 'bg-cyan-500 text-[#0B1120] shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white'}`}
                >
                  All Semesters
                </button>
                {SEMESTERS.map(sem => (
                  <button 
                    key={sem}
                    onClick={() => setSelectedSemester(sem)}
                    className={`whitespace-nowrap px-6 py-2 rounded-full text-sm font-bold transition-all ${selectedSemester === sem ? 'bg-cyan-500 text-[#0B1120] shadow-[0_0_15px_rgba(6,182,212,0.4)]' : 'bg-slate-800/40 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-white'}`}
                  >
                    {sem} Sem
                  </button>
                ))}
              </div>
            </div>

            {/* --- CARDS GRID --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
              {filteredDocs.map((doc) => (
                <div key={doc.id} className="group flex flex-col p-6 rounded-3xl border border-slate-800/60 bg-slate-900/30 hover:bg-slate-800/60 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_8px_30px_rgba(6,182,212,0.08)] hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-6">
                    <div className="p-3.5 bg-slate-800/80 rounded-2xl text-cyan-400 border border-slate-700/50 group-hover:scale-110 group-hover:bg-cyan-500/10 transition-all duration-300">
                      <Binary size={24} />
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                        {doc.semester} Sem
                      </span>
                      <span className="bg-slate-800 text-slate-300 border border-slate-700/50 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest shadow-sm">
                        YEAR {doc.year}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-black text-2xl text-white mb-2 tracking-tight group-hover:text-cyan-400 transition-colors">{doc.subjectCode}</h3>
                  <p className="text-slate-400 text-sm mb-6 font-medium line-clamp-2 flex-grow">{doc.subjectName}</p>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-6 pb-6 border-b border-slate-800/50">
                    <Clock size={14} className="text-cyan-500/60" />
                    <span className="font-medium">{new Date(doc.createdAt).toLocaleDateString()}</span>
                    <span className="ml-auto font-mono bg-slate-950/50 px-2 py-1 rounded-md text-slate-400 border border-slate-800/50">{(doc.fileSize / 1024).toFixed(0)} KB</span>
                  </div>

                  <button 
                    onClick={() => {
                        if(doc.downloadUrl) window.open(doc.downloadUrl, '_blank');
                        else alert('Download URL not available.');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-200 font-bold hover:bg-cyan-500 hover:text-[#0B1120] hover:border-transparent transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] active:scale-[0.98]">
                    <Download size={18} /> Download
                  </button>
                </div>
              ))}
            </div>
            
            {filteredDocs.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex bg-slate-800/50 p-6 rounded-full text-slate-600 mb-4">
                  <Search size={40} />
                </div>
                <h3 className="text-xl font-bold text-slate-300">No resources found</h3>
                <p className="text-slate-500 mt-2">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        ) : (
          
          /* --- UPLOAD FORM VIEW --- */
          <div className="max-w-3xl mx-auto py-4 md:py-8">
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800/80 relative">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 blur-[100px] pointer-events-none rounded-full"></div>
              
              <div className="relative p-10 border-b border-slate-800/80 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-6 ring-1 ring-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                  <Upload size={32} />
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2">Publish Resource</h2>
                <p className="text-slate-400 font-medium text-lg">Adding to <span className="text-cyan-400">{COURSE_GROUPS.find(g => g.id === selectedGroupId)?.name}</span></p>
              </div>

              <form onSubmit={handleUpload} className="relative p-8 md:p-10 space-y-8 z-10">
                {uploadError && (
                  <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-sm items-center font-medium backdrop-blur-sm">
                    <AlertCircle size={20} className="shrink-0" />
                    {uploadError}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Subject Code</label>
                    <div className="relative group">
                      <Binary className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="text" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 font-medium"
                        placeholder="e.g. CS-301"
                        value={uploadForm.subjectCode}
                        onChange={e => setUploadForm({...uploadForm, subjectCode: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Subject Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 font-medium" 
                      placeholder="e.g. Data Structures"
                      value={uploadForm.subjectName}
                      onChange={e => setUploadForm({...uploadForm, subjectName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Semester</label>
                    <div className="relative group">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <select 
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white font-medium appearance-none cursor-pointer"
                        value={uploadForm.semester}
                        onChange={e => setUploadForm({...uploadForm, semester: e.target.value})}
                      >
                        {SEMESTERS.map(sem => (
                          <option key={sem} value={sem} className="bg-slate-900">{sem} Semester</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Exam Year</label>
                    <div className="relative group">
                      <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={18} />
                      <input 
                        type="number" 
                        className="w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all text-white font-medium" 
                        value={uploadForm.year}
                        onChange={e => setUploadForm({...uploadForm, year: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-4">
                  <label className="block text-sm font-bold text-slate-300 uppercase tracking-widest">Question Paper (PDF)</label>
                  <input type="file" ref={fileInputRef} className="hidden" accept="application/pdf" onChange={handleFileChange} />
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className={`border-2 border-dashed rounded-2xl p-10 md:p-12 text-center transition-all duration-300 cursor-pointer group 
                      ${uploadForm.file ? 'border-cyan-500 bg-cyan-500/5' : 'border-slate-700 bg-slate-950/50 hover:border-cyan-500/50 hover:bg-slate-900/50'}`}
                  >
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transition-all duration-300 shadow-xl
                      ${uploadForm.file ? 'bg-cyan-500 text-[#0B1120] scale-110 shadow-cyan-500/20' : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-cyan-400 group-hover:scale-105 group-hover:rotate-3'}`}>
                      {uploadForm.file ? <CheckCircle2 size={40} /> : <FileText size={36} />}
                    </div>
                    <p className="font-bold text-xl text-white mb-2">
                      {uploadForm.file ? uploadForm.file.name : 'Click to browse PDF file'}
                    </p>
                    <p className="text-sm text-slate-500 font-medium">
                      Maximum size: {MAX_FILE_SIZE_MB}MB • {uploadForm.file ? <span className="text-cyan-400">{`${(uploadForm.file.size / (1024 * 1024)).toFixed(2)}MB`}</span> : 'PDF Document Only'}
                    </p>
                  </div>
                </div>

                <div className="pt-6">
                  <button 
                    type="submit" 
                    disabled={uploading || !uploadForm.file}
                    className={`w-full py-5 rounded-2xl font-black text-lg transition-all duration-300 uppercase tracking-widest
                      ${uploading || !uploadForm.file 
                        ? 'bg-slate-800/80 text-slate-500 cursor-not-allowed border border-slate-700' 
                        : 'bg-cyan-500 text-[#0B1120] hover:bg-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] hover:shadow-[0_0_40px_rgba(6,182,212,0.5)] hover:-translate-y-1'}`}
                  >
                    {uploading ? 'Processing Upload...' : 'Publish Paper To Hub'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
