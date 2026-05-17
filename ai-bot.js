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
            <div class="p-4 bg-slate-900/90 text-white flex justify-between items-center border-b border-white/5">
                <div class="flex items-center">
                    <div class="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-2.5 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></div>
                    <span class="font-bold text-xs uppercase tracking-widest" style="font-family:'Inter', sans-serif;">University AI Guide</span>
                </div>
                <button id="close-chat" class="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl font-bold leading-none outline-none">&times;</button>
            </div>
            
            <div class="p-2.5 flex gap-1.5 overflow-x-auto bg-slate-800/40 border-b border-white/5 scrollbar-none">
                <button id="sug-1" class="text-[10px] bg-slate-800 hover:bg-cyan-500/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-white/5 text-slate-300 hover:text-cyan-400 cursor-pointer font-medium transition-colors">Explore Courses</button>
                <button id="sug-2" class="text-[10px] bg-slate-800 hover:bg-indigo-500/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-white/5 text-slate-300 hover:text-indigo-400 cursor-pointer font-medium transition-colors">Regular vs Self-Financed</button>
                <button id="sug-3" class="text-[10px] bg-slate-800 hover:bg-rose-500/20 px-2.5 py-1.5 rounded-lg whitespace-nowrap border border-white/5 text-slate-300 hover:text-rose-400 cursor-pointer font-medium transition-colors">Find PYQs</button>
            </div>

            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto max-h-96 min-h-[350px] bg-slate-950/20 space-y-4 flex flex-col" style="font-family:'Inter', sans-serif;">
                <div class="ai-bubble bg-slate-800/80 text-slate-300 self-start border border-white/5 shadow-sm">Hello! I am your University AI Guide. Whether you are studying Arts, Science, Commerce, or Professional courses like BCA & BBA, I am here to help you navigate your academic journey!</div>
            </div>

            <div class="p-3 border-t border-white/5 flex gap-2 bg-slate-900/90">
                <input type="text" id="chat-input" placeholder="Ask about any university course..." class="flex-1 bg-slate-800/80 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-white/5 outline-none font-medium">
                <button id="send-chat" class="bg-indigo-600 text-white p-2.5 rounded-lg hover:bg-indigo-500 transition-colors border-none cursor-pointer flex items-center justify-center shadow-lg shadow-indigo-600/30">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(botContainer);

    // 4. Client-side Interaction Logic
    const chatWindow = document.getElementById('ai-chat-window');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const sendBtn = document.getElementById('send-chat');
    const toggleBtn = document.getElementById('ai-toggle-btn');
    const closeBtn = document.getElementById('close-chat');
    const curiosityTooltip = document.getElementById('ai-curiosity-tooltip');

    const systemPrompt = "Act as a world-class Academic Counselor and Tutor for a University. You are an expert in ALL university courses, including Regular courses (B.A., B.Sc., B.Com) and Self-Financed professional courses (BCA, BBA, Biotech). Provide helpful, accurate, and encouraging guidance to students from any discipline. If they ask about engineering, provide technical help. If they ask about arts, provide academic insights. Be concise and use a professional yet encouraging tone.";

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
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            chatWindow.classList.add('hidden');
        };
    }

    // Set up suggestions
    const askAI = (text) => {
        chatInput.value = text;
        sendMessage();
    };

    document.getElementById('sug-1').onclick = () => askAI('What courses does the university offer?');
    document.getElementById('sug-2').onclick = () => askAI('What is the difference between Regular and Self-Financed?');
    document.getElementById('sug-3').onclick = () => askAI('How to use the PYQ Archive?');

    async function sendMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;

        // User speech bubble
        const userDiv = document.createElement('div');
        userDiv.className = 'ai-bubble bg-indigo-600/30 text-white border border-indigo-500/20 shadow-sm';
        userDiv.style.cssText = 'align-self: flex-end; margin-left: auto;';
        userDiv.innerText = msg;
        chatMessages.appendChild(userDiv);
        chatInput.value = '';
        
        // Typing indicator
        const loadDiv = document.createElement('div');
        loadDiv.className = 'ai-bubble bg-slate-800 text-slate-400 italic self-start';
        loadDiv.innerHTML = 'Thinking...';
        chatMessages.appendChild(loadDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    contents: [{ parts: [{ text: msg }] }], 
                    systemInstruction: { parts: [{ text: systemPrompt }] } 
                })
            });
            const data = await res.json();
            const aiMsg = data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection lost to the central server.";
            
            loadDiv.remove();
            
            // AI speech bubble
            const aiDiv = document.createElement('div');
            aiDiv.className = 'ai-bubble bg-slate-800 text-slate-300 self-start border border-white/5';
            aiDiv.innerHTML = '<div class="font-bold text-[10px] text-cyan-400 mb-2 tracking-wider uppercase font-mono">AI Response</div>' + 
                             aiMsg.replace(/\n/g, '<br>')
                                  .replace(/```(javascript|html|css|js|sql|python|cpp)?([\s\S]*?)```/g, '<pre class="bg-black/40 p-3 rounded-lg overflow-x-auto my-2 border border-white/5"><code class="font-mono text-xs text-cyan-300">$2</code></pre>');
            chatMessages.appendChild(aiDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
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
})();
