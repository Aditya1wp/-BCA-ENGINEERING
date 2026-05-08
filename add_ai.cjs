const fs = require('fs');
const path = require('path');

const aiBlock = `
    <!-- AI Chat Container -->
    <div id="ai-chat-container" class="fixed bottom-6 left-6 z-[60]">
        <button id="ai-toggle-btn" class="w-16 h-16 bg-gradient-to-tr from-cyan-500 to-indigo-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 transition-transform active:scale-95 group border-0 outline-none cursor-pointer">
            <svg class="h-8 w-8 group-hover:-rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
        </button>
        
        <div id="ai-chat-window" class="hidden absolute bottom-20 left-0 w-80 md:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-white/10" style="background: rgba(30, 41, 59, 0.95); backdrop-filter: blur(16px);">
            <div class="p-4 bg-slate-900/80 text-white flex justify-between items-center border-b border-white/5">
                <div class="flex items-center"><div class="w-2 h-2 bg-emerald-400 rounded-full mr-2 animate-pulse"></div><span class="font-bold text-xs uppercase tracking-widest" style="font-family:'Inter', sans-serif;">University AI Guide</span></div>
                <button id="close-chat" class="text-slate-400 hover:text-white bg-transparent border-none cursor-pointer text-xl">&times;</button>
            </div>
            
            <div class="p-2 flex gap-1 overflow-x-auto bg-slate-800/50">
                <button onclick="askAI('What courses does the university offer?')" class="text-[10px] bg-slate-700 hover:bg-cyan-500/20 px-2 py-1 rounded whitespace-nowrap border-none text-white cursor-pointer">Explore Courses</button>
                <button onclick="askAI('What is the difference between Regular and Self-Financed?')" class="text-[10px] bg-slate-700 hover:bg-indigo-500/20 px-2 py-1 rounded whitespace-nowrap border-none text-white cursor-pointer">Regular vs Self-Financed</button>
                <button onclick="askAI('How to use the PYQ Archive?')" class="text-[10px] bg-slate-700 hover:bg-rose-500/20 px-2 py-1 rounded whitespace-nowrap border-none text-white cursor-pointer">Find PYQs</button>
            </div>

            <div id="chat-messages" class="flex-1 p-4 overflow-y-auto max-h-96 min-h-[350px] bg-slate-900/40 space-y-4" style="font-family:'Inter', sans-serif;">
                <div class="ai-bubble bg-slate-800 text-slate-300 self-start border border-white/5 shadow-sm" style="max-width: 85%; border-radius: 18px; padding: 12px 16px; margin-bottom: 8px; font-size: 0.875rem;">Hello! I am your University AI Guide. Whether you are studying Arts, Science, Commerce, or Professional courses like BCA & BBA, I am here to help you navigate your academic journey!</div>
            </div>

            <div class="p-3 border-t border-white/5 flex gap-2 bg-slate-900/80">
                <input type="text" id="chat-input" placeholder="Ask about any university course..." class="flex-1 bg-slate-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500 border-none outline-none">
                <button id="send-chat" class="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-500 transition-colors border-none cursor-pointer flex items-center justify-center">
                    <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
            </div>
        </div>
    </div>

    <script id="ai-script-block">
        const systemPrompt = "Act as a world-class Academic Counselor and Tutor for a University. You are an expert in ALL university courses, including Regular courses (B.A., B.Sc., B.Com) and Self-Financed professional courses (BCA, BBA, Biotech). Provide helpful, accurate, and encouraging guidance to students from any discipline. If they ask about engineering, provide technical help. If they ask about arts, provide academic insights. Be concise and use a professional yet encouraging tone.";
        const chatWindow = document.getElementById('ai-chat-window');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');
        const sendBtn = document.getElementById('send-chat');

        if(document.getElementById('ai-toggle-btn')) { document.getElementById('ai-toggle-btn').onclick = () => chatWindow.classList.toggle('hidden'); }
        if(document.getElementById('ai-toggle-top')) { document.getElementById('ai-toggle-top').onclick = () => chatWindow.classList.toggle('hidden'); }
        if(document.getElementById('close-chat')) { document.getElementById('close-chat').onclick = () => chatWindow.classList.add('hidden'); }

        async function askAI(text) { chatInput.value = text; sendMessage(); }

        async function sendMessage() {
            const msg = chatInput.value.trim();
            if (!msg) return;

            const userDiv = document.createElement('div');
            userDiv.className = 'ai-bubble bg-indigo-600/30 text-white self-end ml-auto border border-indigo-500/20';
            userDiv.style.cssText = 'max-width: 85%; border-radius: 18px; padding: 12px 16px; margin-bottom: 8px; font-size: 0.875rem; align-self: flex-end; margin-left: auto;';
            userDiv.innerText = msg;
            chatMessages.appendChild(userDiv);
            chatInput.value = '';
            
            const loadDiv = document.createElement('div');
            loadDiv.className = 'ai-bubble bg-slate-800 text-slate-400 self-start italic';
            loadDiv.style.cssText = 'max-width: 85%; border-radius: 18px; padding: 12px 16px; margin-bottom: 8px; font-size: 0.875rem;';
            loadDiv.innerHTML = 'Analyzing...';
            chatMessages.appendChild(loadDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;

            try {
                const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: [{ parts: [{ text: msg }] }], systemInstruction: { parts: [{ text: systemPrompt }] } })
                });
                const data = await res.json();
                const aiMsg = data.candidates?.[0]?.content?.parts?.[0]?.text || "Connection lost to the central server.";
                
                loadDiv.remove();
                const aiDiv = document.createElement('div');
                aiDiv.className = 'ai-bubble bg-slate-800 text-slate-300 self-start border border-white/5';
                aiDiv.style.cssText = 'max-width: 85%; border-radius: 18px; padding: 12px 16px; margin-bottom: 8px; font-size: 0.875rem;';
                aiDiv.innerHTML = '<div class="font-bold text-[10px] text-cyan-400 mb-2 tracking-tighter uppercase">AI Response</div>' + aiMsg.replace(/\\n/g, '<br>').replace(/\`\`\`/g, '<code class="bg-black/50 px-1 rounded">');
                chatMessages.appendChild(aiDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            } catch (err) {
                loadDiv.innerHTML = "System Error: Check API Key or Network Connection.";
            }
        }
        if(sendBtn) sendBtn.onclick = sendMessage;
        if(chatInput) chatInput.onkeypress = (e) => { if(e.key === 'Enter') sendMessage(); };
    </script>
`;

const files = ['index.html', 'legacy_dashboard.html', 'categories.html', 'courses.html', 'semesters.html'];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Remove existing AI Chat Container if present
    const aiContainerStart = content.indexOf('<!-- AI Chat Container -->');
    if (aiContainerStart !== -1) {
        const bodyEnd = content.indexOf('</body>');
        content = content.substring(0, aiContainerStart) + content.substring(bodyEnd);
    }

    // Now inject the new block right before </body>
    content = content.replace('</body>', aiBlock + '\\n</body>');
    
    fs.writeFileSync(file, content);
    console.log('Updated ' + file + ' with generalized AI bot.');
});
