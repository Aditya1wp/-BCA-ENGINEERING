/**
 * BCA ENGINEER - Universal Upload System
 * This script injects the premium upload button and modal into any page.
 */

(function() {
    // 1. Inject CSS
    const css = `
        /* Premium Upload Button Styles */
        @keyframes uploadShimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
        }
        @keyframes floatIcon {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
        }
        @keyframes innerGlow {
            0%, 100% { box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.08), 0 4px 15px rgba(0,0,0,0.3), 0 8px 30px rgba(6, 182, 212, 0.1); }
            50% { box-shadow: inset 0 0 25px rgba(6, 182, 212, 0.15), 0 6px 20px rgba(0,0,0,0.35), 0 10px 40px rgba(6, 182, 212, 0.18); }
        }

        #main-upload-btn {
            position: relative;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            padding: 10px 24px;
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 0.8rem;
            letter-spacing: 2px;
            text-transform: uppercase;
            text-decoration: none;
            color: #e0f7fa;
            border: 1px solid rgba(6, 182, 212, 0.25);
            border-radius: 12px;
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.08) 0%, rgba(99, 102, 241, 0.08) 50%, rgba(6, 182, 212, 0.12) 100%);
            backdrop-filter: blur(16px);
            box-shadow: inset 0 0 20px rgba(6, 182, 212, 0.08), 0 4px 15px rgba(0, 0, 0, 0.3);
            overflow: hidden;
            cursor: pointer;
            transition: all 0.4s ease;
            animation: innerGlow 3s ease-in-out infinite;
        }

        #main-upload-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            background: linear-gradient(105deg, transparent 30%, rgba(6, 182, 212, 0.12) 45%, rgba(255, 255, 255, 0.08) 50%, rgba(6, 182, 212, 0.12) 55%, transparent 70%);
            background-size: 200% 100%;
            animation: uploadShimmer 4s ease-in-out infinite;
            pointer-events: none;
        }

        #main-upload-btn:hover {
            transform: scale(1.05);
            border-color: rgba(6, 182, 212, 0.5);
            background: linear-gradient(135deg, rgba(6, 182, 212, 0.14) 0%, rgba(99, 102, 241, 0.12) 50%, rgba(6, 182, 212, 0.18) 100%);
            box-shadow: 0 10px 30px rgba(6, 182, 212, 0.2);
        }

        #main-upload-btn .upload-icon {
            display: inline-flex;
            animation: floatIcon 2.5s ease-in-out infinite;
        }

        /* Modal Styles */
        .modal-open { overflow: hidden; }
        #upload-modal { font-family: 'Inter', 'Poppins', sans-serif; }

        @media (max-width: 600px) {
            #main-upload-btn {
                padding: 6px 12px;
                font-size: 0.6rem;
                letter-spacing: 1px;
                gap: 5px;
                border-radius: 8px;
            }
            #main-upload-btn svg {
                width: 14px;
                height: 14px;
            }
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.innerText = css;
    document.head.appendChild(styleSheet);

    // 2. Inject Modal HTML
    const modalHtml = `
    <div id="upload-modal" class="fixed inset-0 z-[2000] hidden flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-md" id="modal-backdrop"></div>
        <div class="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#0f172a]/95 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-800/80 transform transition-all scale-95 opacity-0 duration-300" id="upload-modal-content">
            <!-- Decorative Lights -->
            <div class="absolute -top-40 -right-40 w-96 h-96 bg-cyan-500/10 blur-[100px] pointer-events-none rounded-full"></div>
            <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-600/10 blur-[100px] pointer-events-none rounded-full"></div>
            <button id="close-upload-modal" class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10 cursor-pointer bg-transparent border-none">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
            <div class="relative p-6 md:p-8 border-b border-slate-800/80 text-center">
                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 mb-4 ring-1 ring-cyan-500/30 overflow-hidden">
                    <img src="logo.png" alt="Logo" class="h-12 w-auto object-contain">
                </div>
                <h2 class="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2">Publish Resource</h2>
                <p class="text-slate-400 font-medium">Adding to the University Hub</p>
            </div>
            <form id="universal-upload-form" class="relative p-6 md:p-8 space-y-6 z-10">
                <div id="up-error-box" class="hidden p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-400 text-sm items-center font-medium">
                    <svg class="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span id="up-error-text"></span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Category</label>
                        <select id="u-category" required class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 appearance-none">
                            <option value="" disabled selected>Select Category</option>
                            <option value="Regular UG">Regular UG</option>
                            <option value="Self-Financed UG">Self-Financed UG</option>
                            <option value="Regular PG">Regular PG</option>
                            <option value="Self-Financed PG">Self-Financed PG</option>
                            <option value="PG Diploma">PG Diploma</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Course</label>
                        <select id="u-course" required disabled class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 appearance-none disabled:opacity-50">
                            <option value="" disabled selected>Select Category First</option>
                        </select>
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Subject Code</label>
                        <input type="text" id="u-code" required class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. CS-301">
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Subject Name</label>
                        <input type="text" id="u-name" required class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Data Structures">
                    </div>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Semester</label>
                        <select id="u-sem" class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 appearance-none">
                            <option value="1st">1st Semester</option>
                            <option value="2nd">2nd Semester</option>
                            <option value="3rd">3rd Semester</option>
                            <option value="4th">4th Semester</option>
                            <option value="5th">5th Semester</option>
                            <option value="6th">6th Semester</option>
                            <option value="7th">7th Semester</option>
                            <option value="8th">8th Semester</option>
                        </select>
                    </div>
                    <div class="space-y-2">
                        <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Exam Year</label>
                        <input type="number" id="u-year" required class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500" value="2024">
                    </div>
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Document Type</label>
                    <select id="u-doctype" required class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500 appearance-none">
                        <option value="pyq">📄 Previous Year Question (PYQ)</option>
                        <option value="notes">📖 Notes / Study Material</option>
                    </select>
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">Your Name / Nickname (optional — shown on leaderboard)</label>
                    <input type="text" id="u-uploader-name" maxlength="30" class="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white outline-none focus:ring-2 focus:ring-cyan-500" placeholder="e.g. Aditya, John (Default: Anonymous Student)">
                </div>
                <div class="space-y-2">
                    <label class="block text-xs font-bold text-slate-300 uppercase tracking-widest">PDF File</label>
                    <input type="file" id="u-file" class="hidden" accept="application/pdf">
                    <div id="u-drop-area" class="border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center cursor-pointer hover:border-cyan-500/50 hover:bg-slate-800/50 transition-all">
                        <div id="u-file-icon" class="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400 transition-all">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <p id="u-file-name" class="text-white font-bold">Click to browse PDF</p>
                        <p class="text-xs text-slate-500">Max 3MB (Vercel Limit)</p>
                    </div>
                </div>
                <button type="submit" id="u-submit-btn" disabled class="w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 transition-all">
                    Select a file to continue
                </button>
            </form>
        </div>
    </div>
    `;
    const modalContainer = document.createElement("div");
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // 3. Elements & Logic
    const modal = document.getElementById('upload-modal');
    const modalContent = document.getElementById('upload-modal-content');
    const backdrop = document.getElementById('modal-backdrop');
    const closeBtn = document.getElementById('close-upload-modal');
    const form = document.getElementById('universal-upload-form');
    const categorySelect = document.getElementById('u-category');
    const courseSelect = document.getElementById('u-course');
    const fileInput = document.getElementById('u-file');
    const dropArea = document.getElementById('u-drop-area');
    const fileNameDisp = document.getElementById('u-file-name');
    const fileIcon = document.getElementById('u-file-icon');
    const submitBtn = document.getElementById('u-submit-btn');
    const errorBox = document.getElementById('up-error-box');
    const errorText = document.getElementById('up-error-text');

    let selectedFile = null;

    const courseData = {
        'Regular UG': ['B.A. Hons', 'B.Sc. Hons', 'B.Com. Hons'],
        'Self-Financed UG': ['BCA', 'BBA', 'B.Lib.I.Sc.', 'BFA', 'B.MC', 'BSW', 'Functional English', 'Biotechnology', 'Environmental Science'],
        'Regular PG': ['M.A.', 'M.Sc.', 'M.Com.', 'LL.M.', 'M.Ed.'],
        'Self-Financed PG': ['MCA', 'MBA', 'PMIR', 'M.Sc. Biotechnology', 'M.Sc. Environmental Science', 'M.Sc. Bio-Chemistry', 'MJMC', 'MSW', 'M.Lib.I.Sc.', 'M.A. Women\'s Studies', 'M.A. Music'],
        'PG Diploma': ['PGDCA', 'Public Administration', 'Industrial Safety Management', 'Yogic Science', 'Human Resource Development', 'Clinical Psychology', 'Women\'s Studies']
    };

    window.openUploadModal = (options = {}) => {
        modal.classList.remove('hidden');
        document.body.classList.add('modal-open');
        
        // Reset form
        form.reset();
        selectedFile = null;
        fileNameDisp.textContent = "Click to browse PDF";
        fileIcon.className = "w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-3 text-slate-400 transition-all";
        fileIcon.innerHTML = `<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>`;
        submitBtn.disabled = true;
        submitBtn.className = "w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 transition-all";
        submitBtn.textContent = "Select a file to continue";

        if (options.category) {
            categorySelect.value = options.category;
            // Trigger change to populate courses
            categorySelect.dispatchEvent(new Event('change'));
            
            if (options.course) {
                const optToSelect = Array.from(courseSelect.options).find(opt => 
                    opt.value.replace(/[^a-zA-Z]/g, '').toLowerCase() === options.course.replace(/[^a-zA-Z]/g, '').toLowerCase()
                );
                if (optToSelect) {
                    courseSelect.value = optToSelect.value;
                } else {
                    // Try exact value or loose add if it doesn't exist
                    let exists = Array.from(courseSelect.options).some(opt => opt.value === options.course);
                    if (!exists) {
                        const opt = document.createElement('option');
                        opt.value = options.course;
                        opt.textContent = options.course;
                        courseSelect.appendChild(opt);
                    }
                    courseSelect.value = options.course;
                }
            }
        }
        
        if (options.sem) {
            const semSelect = document.getElementById('u-sem');
            if (semSelect) semSelect.value = options.sem;
        }
        
        if (options.docType) {
            const dtSelect = document.getElementById('u-doctype');
            if (dtSelect) {
                dtSelect.value = options.docType;
                dtSelect.dispatchEvent(new Event('change'));
            }
        }

        setTimeout(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
            modalContent.classList.add('scale-100', 'opacity-100');
        }, 10);
    };

    window.closeUploadModal = () => {
        modalContent.classList.remove('scale-100', 'opacity-100');
        modalContent.classList.add('scale-95', 'opacity-0');
        document.body.classList.remove('modal-open');
        setTimeout(() => modal.classList.add('hidden'), 300);
    };

    backdrop.onclick = closeUploadModal;
    closeBtn.onclick = closeUploadModal;

    categorySelect.onchange = (e) => {
        const cat = e.target.value;
        courseSelect.innerHTML = '<option value="" disabled selected>Select Course</option>';
        if (cat && courseData[cat]) {
            courseSelect.disabled = false;
            courseData[cat].forEach(c => {
                const opt = document.createElement('option');
                opt.value = c; opt.textContent = c;
                courseSelect.appendChild(opt);
            });
        }
    };

    const docTypeSelect = document.getElementById('u-doctype');
    const yearInput = document.getElementById('u-year');

    docTypeSelect.onchange = (e) => {
        if (e.target.value === 'notes') {
            yearInput.disabled = true;
            yearInput.value = "";
            yearInput.placeholder = "N/A for Notes";
            yearInput.classList.add('opacity-50', 'cursor-not-allowed');
        } else {
            yearInput.disabled = false;
            yearInput.value = new Date().getFullYear();
            yearInput.placeholder = "e.g. 2024";
            yearInput.classList.remove('opacity-50', 'cursor-not-allowed');
        }
    };

    dropArea.onclick = () => fileInput.click();
    fileInput.onchange = (e) => {
        selectedFile = e.target.files[0];
        if (selectedFile) {
            if (selectedFile.size > 3 * 1024 * 1024) {
                alert("File too large (Max 3MB for direct upload). Please compress the PDF or upload a smaller version.");
                return;
            }
            fileNameDisp.textContent = selectedFile.name;
            fileIcon.className = "w-12 h-12 bg-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3 text-white scale-110 shadow-lg shadow-cyan-500/20";
            fileIcon.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            submitBtn.disabled = false;
            submitBtn.classList.remove('bg-slate-800', 'text-slate-500', 'cursor-not-allowed');
            submitBtn.classList.add('bg-cyan-500', 'text-[#0f172a]', 'cursor-pointer', 'hover:bg-cyan-400');
            submitBtn.textContent = "Submit Paper";
        }
    };

    form.onsubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) return;

        submitBtn.disabled = true;
        submitBtn.textContent = "Uploading...";

        const reader = new FileReader();
        reader.onload = async () => {
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: selectedFile.name,
                        fileSize: selectedFile.size,
                        content: reader.result,
                        category: document.getElementById('u-category').value,
                        courseName: document.getElementById('u-course').value,
                        code: document.getElementById('u-code').value.toUpperCase(),
                        name: document.getElementById('u-name').value,
                        sem: document.getElementById('u-sem').value,
                        year: parseInt(document.getElementById('u-year').value) || 0,
                        docType: document.getElementById('u-doctype').value,
                        uploaderName: document.getElementById('u-uploader-name').value
                    })
                });

                if (res.ok) {
                    alert("Submission Successful!");
                    closeUploadModal();
                    form.reset();
                    fileNameDisp.textContent = "Click to browse PDF";
                    fileIcon.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>';
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Select a file to continue";
                    submitBtn.className = "w-full py-4 rounded-xl font-bold text-white uppercase tracking-widest bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700 transition-all";
                } else {
                    let errorMsg = "Upload failed";
                    try {
                        const err = await res.json();
                        errorMsg = err.error || errorMsg;
                    } catch (e) {
                        // Handle non-JSON response (like Vercel's 413 "Request Entity Too Large")
                        if (res.status === 413) {
                            errorMsg = "File is too large for the server to process. Please try a smaller PDF (under 3MB).";
                        } else {
                            errorMsg = `Server Error (${res.status}): ${res.statusText}`;
                        }
                    }
                    alert("Error: " + errorMsg);
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Submit Paper";
                }
            } catch (err) {
                alert("Network error: " + err.message);
                submitBtn.disabled = false;
                submitBtn.textContent = "Submit Paper";
            }
        };
        reader.readAsDataURL(selectedFile);
    };

    // 4. Injected Button Logic
    function injectButton() {
        // Try to find the nav and a placeholder
        const placeholder = document.querySelector('.w-24') || document.querySelector('.nav-right');
        const nav = document.querySelector('nav');
        
        if (placeholder) {
            placeholder.innerHTML = `
                <button id="main-upload-btn" onclick="openUploadModal()">
                    <span class="upload-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </span>
                    UPLOAD
                </button>
            `;
            placeholder.classList.remove('w-24'); // Allow it to expand
            placeholder.style.width = 'auto';
        } else if (nav) {
            // Fallback for index.html which already has it, or other pages
            if (!document.getElementById('main-upload-btn')) {
                const btnContainer = document.createElement('div');
                btnContainer.innerHTML = `
                    <button id="main-upload-btn" onclick="openUploadModal()">
                        <span class="upload-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        </span>
                        UPLOAD
                    </button>
                `;
                nav.appendChild(btnContainer);
            }
        }
    }

    // 5. One-Time Session Upload Invitation Modal
    function initPromotionalModal() {
        let pageViews = parseInt(localStorage.getItem('bca_page_views') || '0');
        pageViews++;
        localStorage.setItem('bca_page_views', pageViews.toString());

        const promoShown = localStorage.getItem('bca_promo_modal_shown') === 'true';

        if (pageViews >= 3 && !promoShown) {
            localStorage.setItem('bca_promo_modal_shown', 'true');
            
            const promoHtml = `
            <div id="promo-modal" class="fixed inset-0 z-[3000] flex items-center justify-center p-4">
                <div class="absolute inset-0 bg-[#0B1120]/90 backdrop-blur-md" id="promo-backdrop"></div>
                <div class="relative w-full max-w-lg bg-[#0f172a]/95 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-cyan-500/30 transform transition-all scale-95 opacity-0 duration-300" id="promo-content">
                    <div class="absolute -top-20 -right-20 w-48 h-48 bg-cyan-500/10 blur-[50px] pointer-events-none rounded-full"></div>
                    <div class="absolute -bottom-20 -left-20 w-48 h-48 bg-indigo-600/10 blur-[50px] pointer-events-none rounded-full"></div>
                    
                    <button id="close-promo-modal" class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-10 bg-transparent border-none cursor-pointer">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                    
                    <div class="text-center space-y-6">
                        <div class="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 text-cyan-400 ring-1 ring-cyan-500/30">
                            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                        </div>
                        <div class="space-y-2">
                            <h3 class="text-2xl font-black text-white tracking-tight">Help Your Peers! 🚀</h3>
                            <p class="text-slate-300 text-sm leading-relaxed">
                                BCA_ENGINEER is a community platform run entirely by students. If you have question papers or notes, share them to help the next batch prepare better!
                            </p>
                        </div>
                        
                        <div class="flex flex-col sm:flex-row gap-3 pt-2">
                            <button id="promo-btn-upload" class="flex-1 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-[#0f172a] hover:from-cyan-400 hover:to-blue-400 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20 cursor-pointer border-none">
                                Upload a Resource
                            </button>
                            <button id="promo-btn-dismiss" class="flex-1 py-4 bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer border-none">
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            `;
            
            const promoContainer = document.createElement("div");
            promoContainer.innerHTML = promoHtml;
            document.body.appendChild(promoContainer);
            
            const promoModal = document.getElementById('promo-modal');
            const promoContent = document.getElementById('promo-content');
            const promoBackdrop = document.getElementById('promo-backdrop');
            const promoClose = document.getElementById('close-promo-modal');
            const promoUploadBtn = document.getElementById('promo-btn-upload');
            const promoDismissBtn = document.getElementById('promo-btn-dismiss');
            
            const closePromo = () => {
                promoContent.classList.remove('scale-100', 'opacity-100');
                promoContent.classList.add('scale-95', 'opacity-0');
                setTimeout(() => promoModal.remove(), 300);
            };
            
            setTimeout(() => {
                promoContent.classList.remove('scale-95', 'opacity-0');
                promoContent.classList.add('scale-100', 'opacity-100');
            }, 10);
            
            promoBackdrop.onclick = closePromo;
            promoClose.onclick = closePromo;
            promoDismissBtn.onclick = closePromo;
            promoUploadBtn.onclick = () => {
                closePromo();
                setTimeout(() => {
                    if (window.openUploadModal) window.openUploadModal();
                }, 400);
            };
        }
    }

    // Run injection when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectButton();
            initPromotionalModal();
        });
    } else {
        injectButton();
        initPromotionalModal();
    }

})();
