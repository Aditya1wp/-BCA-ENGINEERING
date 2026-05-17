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
                    if (proxyUrl.includes('allorigins.win/get')) {
                        const data = await response.json();
                        html = data.contents;
                    } else {
                        html = await response.text();
                    }
                    
                    if (html && html.includes('</body>')) {
                        break; // Success! Exit the fallback loop
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
        
        setNews(extractedNews.slice(0, 15)); // Take top 15 recent notices
        setLoading(false);
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Unable to load latest university updates at this time. (" + error.message + ")");
        setLoading(false);
      }
    };
    
    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48 bg-slate-800 rounded-xl shadow-lg border border-slate-700 animate-pulse">
        <div className="text-blue-400 font-semibold tracking-wide">Scraping Latest PUP Notices...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-xl shadow-lg border border-red-500/30 p-6 text-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-xl shadow-lg border border-slate-700 overflow-hidden">
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-700 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          Live University Notices
        </h2>
        <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2 py-1 rounded">Auto-Scraped</span>
      </div>
      <div className="p-2 max-h-[400px] overflow-y-auto custom-scrollbar">
        {news.length === 0 ? (
          <p className="text-slate-400 text-center py-8">No notices found.</p>
        ) : (
          <ul className="divide-y divide-slate-700">
            {news.map((item, index) => (
              <li key={index} className="hover:bg-slate-700/50 transition-colors duration-200">
                <a 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block px-4 py-3 text-sm text-slate-200 hover:text-blue-400 font-medium"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-blue-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <span className="leading-snug">{item.title}</span>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UniversityNews;
