// AI Tutor Bot Integration Script
// Auto-injects a fully premium floating AI Tutor Bot into the webpage.

(function() {
    // 1. Inject Styles
    const style = document.createElement('style');
    style.innerHTML = `
        @keyframes botFloat {
            0% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-8px) rotate(1.5deg); }
            100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes glowPulse {
            0% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4), 0 0 30px rgba(99, 102, 241, 0.2); }
            50% { box-shadow: 0 0 25px rgba(6, 182, 212, 0.8), 0 0 45px rgba(99, 102, 241, 0.4); }
            100% { box-shadow: 0 0 15px rgba(6, 182, 212, 0.4), 0 0 30px rgba(99, 102, 241, 0.2); }
        }
        .animate-bot-float {
            animation: botFloat 4s ease-in-out infinite;
        }
        .animate-glow-pulse {
            animation: glowPulse 2.5s infinite;
        }
        .ai-bubble {
            max-width: 85%;
            border-radius: 18px;
            padding: 12px 16px;
            margin-bottom: 8px;
            font-size: 0.875rem;
            line-height: 1.5;
            word-wrap: break-word;
        }
        .scrollbar-none::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-none {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        #chat-messages::-webkit-scrollbar {
            width: 4px;
        }
        #chat-messages::-webkit-scrollbar-track {
            background: transparent;
        }
        #chat-messages::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.15);
            border-radius: 99px;
        }
        #chat-messages::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    `;
    document.head.appendChild(style);

    // 2. Create the Bot Container
    const botContainer = document.createElement('div');
    botContainer.id = 'ai-chat-container';
    botContainer.className = 'fixed bottom-6 left-6 z-[60]';
    
    // 3. Create the HTML Structure
    botContainer.innerHTML = `
        <!-- Floating Bot Button -->
        <button id="ai-toggle-btn" class="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-95 group border-0 outline-none cursor-pointer transition-all duration-300 animate-bot-float animate-glow-pulse relative">
            <svg class="h-9 w-9 group-hover:scale-110 transition-all duration-300" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="botGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#06b6d4"/>
                  <stop offset="100%" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
              <!-- Antennas -->
              <path d="M12 6V3M12 3C11.4477 3 11 2.55228 11 2C11 1.44772 11.4477 1 12 1C12.5523 1 13 1.44772 13 2C13 2.55228 12.5523 3 12 3Z" stroke="#06b6d4" stroke-width="2" stroke-linecap="round"/>
              <!-- Head -->
              <rect x="4" y="6" width="16" height="13" rx="4" fill="#0f172a" stroke="url(#botGradient)" stroke-width="2"/>
              <!-- Eyes -->
              <circle cx="9" cy="12" r="1.5" fill="#06b6d4" class="animate-pulse"/>
              <circle cx="15" cy="12" r="1.5" fill="#06b6d4" class="animate-pulse"/>
              <!-- Mouth -->
              <path d="M8 15.5C8 15.5 9.5 17 12 17C14.5 17 16 15.5 16 15.5" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round"/>
              <!-- Side Bolts -->
              <rect x="2" y="11" width="2" height="3" rx="1" fill="#6366f1"/>
              <rect x="20" y="11" width="2" height="3" rx="1" fill="#6366f1"/>
            </svg>
        </button>

        <!-- Dynamic Curiosity Tooltip -->
        <div id="ai-curiosity-tooltip" class="absolute bottom-3 left-20 bg-[#0f172a]/95 border border-cyan-500/30 text-white text-xs px-3.5 py-2.5 rounded-xl whitespace-nowrap shadow-2xl transition-all duration-500 opacity-0 translate-x-4 pointer-events-none z-[70] backdrop-blur-md">
          <div class="relative font-semibold flex items-center gap-2">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            I'm online! Ask me anything.
          </div>
          <div class="absolute top-1/2 -left-1.5 -translate-y-1/2 w-3 h-3 bg-[#0f172a] border-l border-b border-cyan-500/30 rotate-45"></div>
        </div>
        
        <!-- Chat Window -->
        <div id="ai-chat-window" class="hidden absolute bottom-20 left-0 w-85 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10" style="background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(20px);">
            <!-- Header -->
            <div class="p-4 bg-slate-900/90 text-white flex justify-between items-center border-b border-white/5">
                <div class="flex items-center">
                    <div class="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span class="font-bold text-xs uppercase tracking-widest" style="font-family:'Inter', sans-serif;">University AI Guide</span>
                </div>
                <div class="flex items-center gap-3">
                    <button id="clear-chat" class="text-slate-400 hover:text-red-400 bg-transparent border-none cursor-pointer p-1 outline-none transition-colors" title="Clear Conversation">
                        <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                    <button id="close-chat" class="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl font-bold leading-none outline-none">&times;</button>
                </div>
            </div>
            
            <!-- Dynamic Suggestions -->
            <div id="ai-suggestions-container" class="p-2.5 flex gap-1.5 overflow-x-auto bg-slate-800/40 border-b border-white/5 scrollbar-none">
                <!-- Dynamically loaded suggestions -->
            </div>

            <!-- Messages Panel -->
            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto max-h-96 min-h-[350px] bg-slate-950/20 space-y-4 flex flex-col" style="font-family:'Inter', sans-serif;">
                <div class="ai-bubble bg-slate-800/80 text-slate-300 self-start border border-white/5 shadow-sm">Hello! I am your University AI Guide. Whether you are studying Arts, Science, Commerce, or Professional courses like BCA & BBA, I am here to help you navigate your academic journey!</div>
            </div>

            <!-- Input area -->
            <div class="p-3 border-t border-white/5 flex gap-2 bg-slate-900/90">
                <input type="text" id="chat-input" placeholder="Ask about any university course..." class="flex-1 bg-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-white/5 outline-none font-medium">
                <button id="send-chat" class="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-500 transition-colors border-none cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(botContainer);

    // 4. Client-side Logic & DOM Bindings
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('send-chat');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const clearBtn = document.getElementById('clear-chat');
    const curiosityTooltip = document.getElementById('ai-curiosity-tooltip');
    const suggestionsContainer = document.getElementById('ai-suggestions-container');

    const systemPrompt = `You are the ultimate Patna University Academic Navigator AI, an expert tutor and concierge built specifically for the 'BCA ENGINEER' website.
You have absolute knowledge of this academic platform's structure, courses, files, and navigation routes.

## WEBSITE DIRECTORY & NAVIGATION RULES:
Whenever a student asks about a specific course, semester, or document (e.g. PYQs or Notes), you MUST provide direct, clickable links using markdown format: [Label](url) so the student can navigate instantly.
Use these EXACT routes to generate links:
1. Category Selector: categories.html
2. Course List: courses.html?type=regular (for B.A, B.Sc, B.Com) or courses.html?type=self-financed (for BCA, BBA, Biotech)
3. Resource Type Choice: resource-type.html?course=<CourseCode>&type=<Type> (e.g., resource-type.html?course=BCA&type=self-financed)
4. Semester Roadmap: semesters.html?course=<CourseCode>&docType=<pyq|notes> (e.g., semesters.html?course=BCA&docType=pyq)
5. Document Archive / PDF Viewer: viewer.html?course=<CourseCode>&docType=<pyq|notes>&semester=<1st|2nd|3rd|4th|5th|6th>
   - Example for Semester 4 PYQs of BCA: viewer.html?course=BCA&docType=pyq&semester=4th
   - Example for Semester 1 Notes of BBA: viewer.html?course=BBA&docType=notes&semester=1st
6. Admin CMS Console: github-cms.html (allows uploading papers, renaming folders, and reviewing the pending moderation queue)
7. Legacy Syllabus Explorer: legacy_dashboard.html (displays Unit details for C#, Enterprise Java, Oracle, and Solid Waste Management)

## ACADEMIC COURSES HIERARCHY:
- Regular Courses: B.A. (Bachelor of Arts), B.Sc. (Bachelor of Science), B.Com (Bachelor of Commerce)
- Self-Financed Courses: BCA (Bachelor of Computer Applications), BBA (Bachelor of Business Administration), Biotech (Biotechnology)

## REPLICATING STUDENT BEHAVIOR:
If a user writes "pyq sem 4" or similar shortcuts, recognize that they are looking for the BCA Semester 4 Previous Year Questions. Give them a polite response and provide the direct link: [Click here to view Semester 4 PYQs](viewer.html?course=BCA&docType=pyq&semester=4th).
Keep your tone extremely smart, professional, encouraging, and helpful. Be concise.`;

    let chatHistory = [];

    // Safe HTML Escaper
    function escapeHtml(str) {
        return str.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(/"/g, '&quot;')
                  .replace(/'/g, '&#039;');
    }

    // Custom Markdown and Rich Text Formatter
    function formatAiMessage(text) {
        // 1. Isolate and escape code blocks so we don't mess them up with standard processing
        const codeBlocks = [];
        let formatted = text.replace(/```(javascript|html|css|js|sql|python|cpp|bash)?([\s\S]*?)```/g, (match, lang, code) => {
            const index = codeBlocks.length;
            codeBlocks.push(`<pre class="bg-black/40 p-3 rounded-lg overflow-x-auto my-2 border border-white/5 font-mono text-xs text-cyan-300"><code class="language-${lang || 'txt'}">${escapeHtml(code.trim())}</code></pre>`);
            return `__CODE_BLOCK_${index}__`;
        });

        // 2. Escape other markdown text for HTML safety
        formatted = escapeHtml(formatted);

        // 3. Restore isolated code blocks
        codeBlocks.forEach((block, index) => {
            formatted = formatted.replace(`__CODE_BLOCK_${index}__`, block);
        });

        // 4. Format Inline Code: `code`
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="font-mono text-cyan-400 bg-slate-950/60 px-1.5 py-0.5 rounded text-xs">$1</code>');

        // 5. Format Bold: **text**
        formatted = formatted.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-white font-bold">$1</strong>');

        // 6. Format Markdown Links: [Label](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, label, url) => {
            return `<a href="${url}" class="inline-flex items-center gap-1.5 px-3.5 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-xl font-bold text-xs transition-all duration-300 my-1.5 no-underline shadow-lg shadow-cyan-500/5 hover:scale-[1.02] active:scale-95" target="_self">${label} <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg></a>`;
        });

        // 7. Format Bullet Points (lines starting with - or * )
        const lines = formatted.split('\n');
        const processedLines = lines.map(line => {
            const trimmed = line.trim();
            if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
                return `<li class="ml-4 list-disc text-slate-300 my-1">${trimmed.substring(2)}</li>`;
            }
            return line;
        });
        formatted = processedLines.join('<br>');

        // Fix list linebreaks
        formatted = formatted.replace(/(<li[^>]*>.*?<\/li>)<br>/g, '$1');

        return formatted;
    }

    // Dynamic Suggestion Loader based on current active page
    const getPageSuggestions = () => {
        const path = window.location.pathname.toLowerCase();
        if (path.includes('categories.html')) {
            return [
                { id: 'sug-1', label: 'BCA Syllabus', text: 'Tell me about the BCA course structure and roadmap.' },
                { id: 'sug-2', label: 'BCA vs BBA', text: 'Which is better: BCA or BBA?' },
                { id: 'sug-3', label: 'What is Self-Financed?', text: 'Explain what Self-Financed programs are at Patna University.' }
            ];
        } else if (path.includes('semesters.html') || path.includes('resource-type.html')) {
            return [
                { id: 'sug-1', label: 'BCA 4th Sem PYQs', text: 'Give me the link for BCA 4th Semester PYQs.' },
                { id: 'sug-2', label: 'BBA 1st Sem Notes', text: 'Show me the notes for BBA 1st Semester.' },
                { id: 'sug-3', label: 'Download Help', text: 'How do I download academic files and notes?' }
            ];
        } else if (path.includes('github-cms.html')) {
            return [
                { id: 'sug-1', label: 'CMS Instructions', text: 'How do I use this CMS dashboard panel?' },
                { id: 'sug-2', label: 'Moderation System', text: 'How does the content moderation and verification process work?' },
                { id: 'sug-3', label: 'Add New Papers', text: 'How do I add a new paper or PDF file?' }
            ];
        } else {
            return [
                { id: 'sug-1', label: 'Explore Courses', text: 'What academic courses does the university offer?' },
                { id: 'sug-2', label: 'Regular vs Self-Financed', text: 'What is the difference between Regular and Self-Financed?' },
                { id: 'sug-3', label: 'Find PYQs', text: 'How do I search for and download Previous Year Questions?' }
            ];
        }
    };

    // Render suggestions in UI
    const loadSuggestions = () => {
        const suggestions = getPageSuggestions();
        suggestionsContainer.innerHTML = suggestions.map(sug => `
            <button id="${sug.id}" class="text-[10px] bg-slate-800 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-white/5 text-slate-300 hover:text-cyan-400 cursor-pointer font-medium transition-colors">${sug.label}</button>
        `).join('');

        suggestions.forEach(sug => {
            const btn = document.getElementById(sug.id);
            if (btn) btn.onclick = () => askAI(sug.text);
        });
    };

    const askAI = (text) => {
        chatInput.value = text;
        sendMessage();
    };

    // Render message item to chat window
    function appendMessage(role, text) {
        const div = document.createElement('div');
        if (role === 'user') {
            div.className = 'ai-bubble bg-indigo-600/30 text-white border border-indigo-500/20 shadow-sm';
            div.style.cssText = 'align-self: flex-end; margin-left: auto;';
            div.innerText = text;
        } else {
            div.className = 'ai-bubble bg-slate-800 text-slate-300 self-start border border-white/5';
            div.innerHTML = '<div class="font-bold text-[10px] text-cyan-400 mb-2 tracking-wider uppercase font-mono">AI Response</div>' + formatAiMessage(text);
        }
        chatMessages.appendChild(div);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Load Chat History from SessionStorage on startup
    function loadChatHistory() {
        const saved = sessionStorage.getItem('ai_chat_history');
        if (saved) {
            chatHistory = JSON.parse(saved);
            chatMessages.innerHTML = ''; // clear initial hello
            chatHistory.forEach(item => {
                appendMessage(item.role, item.text);
            });
        }
    }

    // Save Chat History to SessionStorage
    function saveChatHistory() {
        sessionStorage.setItem('ai_chat_history', JSON.stringify(chatHistory));
    }

    // Trigger Curiosity Tooltip after 3 seconds
    setTimeout(() => {
        if (curiosityTooltip && chatWindow && chatWindow.classList.contains('hidden')) {
            curiosityTooltip.classList.remove('opacity-0', 'translate-x-4', 'pointer-events-none');
            curiosityTooltip.classList.add('opacity-100', 'translate-x-0');
            
            // Auto hide tooltip after 6 seconds
            setTimeout(() => {
                hideTooltip();
            }, 6000);
        }
    }, 3000);

    function hideTooltip() {
        if (curiosityTooltip) {
            curiosityTooltip.classList.remove('opacity-100', 'translate-x-0');
            curiosityTooltip.classList.add('opacity-0', 'translate-x-4', 'pointer-events-none');
        }
    }

    if (toggleBtn) {
        toggleBtn.onclick = () => {
            chatWindow.classList.toggle('hidden');
            hideTooltip();
            if (!chatWindow.classList.contains('hidden')) {
                chatInput.focus();
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            chatWindow.classList.add('hidden');
        };
    }

    if (clearBtn) {
        clearBtn.onclick = () => {
            if (confirm("Clear your chat conversation history?")) {
                sessionStorage.removeItem('ai_chat_history');
                chatHistory = [];
                chatMessages.innerHTML = `<div class="ai-bubble bg-slate-800/80 text-slate-300 self-start border border-white/5 shadow-sm">Hello! I am your University AI Guide. Whether you are studying Arts, Science, Commerce, or Professional courses like BCA & BBA, I am here to help you navigate your academic journey!</div>`;
            }
        };
    }

    async function sendMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;

        // 1. Append User Message
        appendMessage('user', msg);
        chatHistory.push({ role: 'user', text: msg });
        saveChatHistory();
        
        chatInput.value = '';
        
        // 2. Typing indicator
        const loadDiv = document.createElement('div');
        loadDiv.className = 'ai-bubble bg-slate-800 text-slate-400 italic self-start';
        loadDiv.innerHTML = 'Thinking...';
        chatMessages.appendChild(loadDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            // Send full conversation history to the API for context memory
            const payloadContents = [
                ...chatHistory.map(item => ({
                    role: item.role === 'user' ? 'user' : 'model',
                    parts: [{ text: item.text }]
                }))
            ];

            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    contents: payloadContents, 
                    systemInstruction: { parts: [{ text: systemPrompt }] } 
                })
            });
            
            const data = await res.json();
            const aiMsg = data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection lost to the central server.";
            
            loadDiv.remove();
            
            // 3. Append AI Response
            appendMessage('model', aiMsg);
            chatHistory.push({ role: 'model', text: aiMsg });
            saveChatHistory();
        } catch (err) {
            loadDiv.innerHTML = "System Error: Check API Key or Network Connection.";
        }
    }

    if (sendBtn) sendBtn.onclick = sendMessage;
    if (chatInput) {
        chatInput.onkeypress = (e) => {
            if (e.key === 'Enter') sendMessage();
        };
    }

    // Initialize Suggestions and Chat History
    loadSuggestions();
    loadChatHistory();
})();
