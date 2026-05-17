import React, { useState, useEffect } from 'react';

const UniversityNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // List of proxies (starts with local server if available, falls back to public proxies for GitHub Pages)
        const targetUrl = 'https://www.pup.ac.in/';
        const proxies = [
            `/api/news`, // Production relative endpoint
            `http://localhost:3000/api/news`, // Local Express server
            `https://corsproxy.io/?${encodeURIComponent(targetUrl)}`, // Reliable public proxy
            `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}` // Fallback proxy
        ];
        
        let html = null;
        
        // Try each proxy sequentially until one succeeds
        for (let proxyUrl of proxies) {
            try {
                const response = await fetch(proxyUrl);
                if (response.ok) {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const data = await response.json();
                        html = data.contents || data.data || data;
                    } else {
                        const text = await response.text();
                        // Self-correction in case response is JSON string with text/plain content-type
                        try {
                            const parsed = JSON.parse(text);
                            html = parsed.contents || parsed.data || text;
                        } catch (e) {
                            html = text;
                        }
                    }
                    
                    if (html && html.trim()) {
                        const lower = html.toLowerCase();
                        if (lower.includes('</body>') || lower.includes('</html>') || lower.includes('<div') || lower.includes('<a')) {
                            break; // Success! Exit the fallback loop
                        }
                    }
                }
            } catch (e) {
                console.warn(`Proxy ${proxyUrl} failed, trying next...`);
            }
        }
        
        if (!html) {
          throw new Error("All proxy servers are currently blocked or unavailable.");
        }
        
        // Parse the HTML using the browser's built-in DOMParser
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // Extract notices specifically from the .linkbtn list
        const links = Array.from(doc.querySelectorAll('.linkbtn a'));
        const extractedNews = [];
        const seenLinks = new Set();
        
        links.forEach(a => {
            let link = a.getAttribute('href');
            // Get text from .text span if it exists, otherwise get full text content
            const textSpan = a.querySelector('.text');
            let title = textSpan ? textSpan.textContent.trim() : a.textContent.trim();
            
            if (link && link !== '#') {
                if (!link.startsWith('http')) {
                    link = 'https://www.pup.ac.in/' + (link.startsWith('/') ? link.substring(1) : link);
                }
                
                if (title && !seenLinks.has(link)) {
                    seenLinks.add(link);
                    extractedNews.push({ title, link });
                }
            }
        });
        
        // Fallback: If .linkbtn a is not found, try getting UploadFile PDF links
        if (extractedNews.length === 0) {
            const allLinks = Array.from(doc.querySelectorAll('a[href*="UploadFile"]'));
            allLinks.forEach(a => {
                let link = a.getAttribute('href');
                let title = a.textContent.trim();
                if (link && title && link.endsWith('.pdf')) {
                    if (!link.startsWith('http')) link = 'https://www.pup.ac.in/' + link;
                    if (!seenLinks.has(link)) {
                        seenLinks.add(link);
                        extractedNews.push({ title, link });
                    }
                }
            });
        }
        
        setNews(extractedNews.slice(0, 30)); // Take top 30 recent notices
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Unable to load latest university updates at this time. (" + error.message + ")");
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 mb-20 relative z-10">
      {/* Glowing gradient background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 via-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-60"></div>
      
      <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-5 border-b border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 flex items-center gap-3 tracking-tight">
            <span className="relative flex h-3 w-3 mt-1">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            </span>
            Live University Notices
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/30 tracking-widest font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
              <svg className="w-3.5 h-3.5 animate-[spin_3s_linear_infinite]" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              LIVE SYNC
            </span>
            <a href="https://pup.ac.in" target="_blank" rel="noopener noreferrer" className="hidden sm:flex text-xs text-slate-400 hover:text-cyan-400 transition-colors items-center gap-1.5 font-semibold bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full">
              Official Portal <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-4 bg-slate-900/20">
          {loading && (
            <div className="flex flex-col justify-center items-center h-72 gap-5 bg-slate-900/30 rounded-2xl">
              <div className="w-14 h-14 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin shadow-[0_0_20px_rgba(6,182,212,0.3)]"></div>
              <div className="text-cyan-400 font-semibold tracking-wide animate-pulse drop-shadow-md">Establishing secure connection to PUP Servers...</div>
            </div>
          )}

          {error && (
            <div className="flex flex-col justify-center items-center h-72 text-slate-400 bg-slate-900/30 p-6 text-center rounded-2xl">
              <div className="bg-rose-500/10 p-4 rounded-full mb-4">
                  <svg className="w-10 h-10 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <span className="font-bold text-rose-400 text-lg">Connection Interrupted</span>
              <span className="text-sm mt-2 text-slate-400 max-w-md">{error}</span>
            </div>
          )}

          {!loading && !error && news.length === 0 && (
            <div className="flex justify-center items-center h-72 text-slate-400 bg-slate-900/30 rounded-2xl">
              No notices available at this moment.
            </div>
          )}

          {!loading && !error && news.length > 0 && (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[420px] overflow-y-auto pr-2 pt-4 pb-2 custom-scrollbar" style={{scrollbarWidth: 'thin', scrollbarColor: '#06b6d4 #0f172a'}}>
              {news.map((item, index) => (
                <li key={index} className="group relative overflow-visible">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="relative flex items-start gap-4 p-5 h-full rounded-xl bg-slate-800/40 hover:bg-slate-800/80 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-1 no-underline group-hover:ring-1 ring-cyan-500/20">
                    
                    {index < 3 && (
                      <span className="absolute -top-2.5 -right-2 bg-gradient-to-r from-emerald-400 to-emerald-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-[0_0_12px_rgba(52,211,153,0.5)] z-10 border border-emerald-300/50">NEW</span>
                    )}

                    <div className="flex items-center justify-center w-11 h-11 shrink-0 rounded-lg bg-slate-900/80 border border-white/5 text-indigo-400 group-hover:bg-cyan-500/10 group-hover:text-cyan-400 group-hover:scale-110 transition-all duration-300 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-300 group-hover:text-white font-semibold leading-relaxed drop-shadow-sm transition-colors duration-300" style={{display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis'}}>
                        {item.title}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-wider group-hover:text-cyan-500/70 transition-colors">Official Notification</p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default UniversityNews;
