export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4.5mb',
        },
    },
};

export default async function handler(req, res) {
    // Enable CORS if needed
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        try {
            const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
            const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Aditya1wp'; 
            const GITHUB_REPO = process.env.GITHUB_REPO || 'bca-pyq-database';
            
            if (!GITHUB_TOKEN) {
                return res.status(500).json({ error: 'Configuration Error: Token not set.' });
            }

            const dbRes = await fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/database.json`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'BCA-ENGINEER-APP'
                }
            });

            if (dbRes.status === 404) {
                return res.status(200).json([]);
            }

            if (!dbRes.ok) {
                throw new Error('Failed to fetch database.json');
            }

            const dbData = await dbRes.json();
            const decodedContent = Buffer.from(dbData.content, 'base64').toString('utf-8');
            return res.status(200).json(JSON.parse(decodedContent));
        } catch (error) {
            console.error('Database Fetch Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { 
            filename, 
            fileSize, 
            content, 
            code, 
            name, 
            sem, 
            year,
            category,
            courseName,
            docType
        } = req.body;
        
        if (!content || !filename || !code || !courseName || !category) {
            return res.status(400).json({ error: 'File content, filename, subject code, category, and course name are required' });
        }

        const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
        const GITHUB_OWNER = process.env.GITHUB_OWNER || 'Aditya1wp'; 
        const GITHUB_REPO = process.env.GITHUB_REPO || 'bca-pyq-database'; // Updated repo name
        
        if (!GITHUB_TOKEN) {
            return res.status(500).json({ error: 'Server Configuration Error: GITHUB_TOKEN is not set in environment variables.' });
        }

        // Clean up inputs
        const safeSubjectCode = code.replace(/[^a-zA-Z0-9-]/g, '_').toUpperCase();
        const safeSemester = sem ? sem.replace(/[^a-zA-Z0-9-]/g, '_') : 'Unknown_Sem';
        const safeCourseName = courseName.replace(/[^a-zA-Z0-9-]/g, '_').toLowerCase();
        const timestamp = Date.now();
        const parsedYear = parseInt(year) || new Date().getFullYear();
        
        // Get file extension
        const ext = filename.includes('.') ? '.' + filename.split('.').pop() : '.pdf';
        
        // Construct the path: e.g. uploads/bca/1st/CC-01_169999999.pdf
        const filePath = `uploads/${safeCourseName}/${safeSemester}/${safeSubjectCode}_${timestamp}${ext}`;
        
        // Remove the data:application/pdf;base64, part from the base64 string if it exists
        const base64Content = content.split(',')[1] || content;

        console.log(`Uploading ${filePath} to GitHub repository: ${GITHUB_OWNER}/${GITHUB_REPO}...`);

        const githubFetch = async (path, options = {}) => {
            return fetch(`https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${path}`, {
                ...options,
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'BCA-ENGINEER-APP',
                    ...options.headers
                }
            });
        };

        // --- DUPLICATE CHECK: Fetch database.json FIRST ---
        console.log("Checking for duplicates in database.json...");
        let currentDb = [];
        let dbSha = null;
        
        const dbFetchRes = await githubFetch('database.json');
        
        if (dbFetchRes.ok) {
            const dbFetchData = await dbFetchRes.json();
            const decodedContent = Buffer.from(dbFetchData.content, 'base64').toString('utf-8');
            try {
                currentDb = JSON.parse(decodedContent);
            } catch(e) {
                console.error("Failed to parse database.json, starting fresh.");
                currentDb = [];
            }
            dbSha = dbFetchData.sha;
        } else if (dbFetchRes.status !== 404) {
            console.error("Error fetching database.json", await dbFetchRes.text());
            throw new Error('Failed to fetch existing database.json');
        }

        // Check for duplicate: same course + subject code + year + semester (only for PYQ documents)
        const currentDocType = docType || 'pyq';
        if (currentDocType === 'pyq') {
            const duplicate = currentDb.find(doc => 
                (doc.courseName || '').toLowerCase() === courseName.toLowerCase() &&
                (doc.subjectCode || '').toUpperCase() === safeSubjectCode &&
                doc.year === parsedYear &&
                (doc.semester || '') === safeSemester &&
                (doc.docType || 'pyq') === 'pyq'
            );

            if (duplicate) {
                return res.status(409).json({ 
                    error: `This PYQ document already exists: ${safeSubjectCode} (${courseName}, ${safeSemester} Sem, ${parsedYear}). Duplicate submissions are not allowed.` 
                });
            }
        }

        // 1. Upload PDF (only after duplicate check passes)
        const pdfRes = await githubFetch(filePath, {
            method: 'PUT',
            body: JSON.stringify({
                message: `feat: add resource ${safeSubjectCode} to ${safeCourseName}/${safeSemester}`,
                content: base64Content,
                branch: 'main'
            })
        });

        const pdfData = await pdfRes.json();

        if (!pdfRes.ok) {
            console.error("GitHub API Error (PDF):", pdfData);
            if (pdfData.message && pdfData.message.includes('sha')) {
                return res.status(409).json({ error: 'A file with this name already exists in this folder.' });
            }
            throw new Error(pdfData.message || 'Failed to upload PDF to GitHub');
        }

        const downloadUrl = pdfData.content.download_url;
        console.log("PDF Upload successful:", downloadUrl);

        // 2. Update database.json (we already have currentDb and dbSha from the duplicate check)
        // Re-fetch SHA in case it changed between duplicate check and now
        const dbRefetch = await githubFetch('database.json');
        if (dbRefetch.ok) {
            const refetchData = await dbRefetch.json();
            dbSha = refetchData.sha;
        }

        const newRecord = {
            id: timestamp.toString(),
            category: category,
            courseName: courseName,
            subjectCode: safeSubjectCode,
            subjectName: name || 'Unknown Subject',
            year: parsedYear,
            semester: safeSemester,
            docType: docType || 'pyq',
            verified: false, // New: moderation status
            createdAt: new Date().toISOString(),
            fileName: filename,
            fileSize: fileSize || 0,
            downloadUrl: downloadUrl
        };

        currentDb.push(newRecord);

        const dbBody = {
            message: `update: append ${safeSubjectCode} to database.json`,
            content: Buffer.from(JSON.stringify(currentDb, null, 2)).toString('base64'),
            branch: 'main'
        };
        if (dbSha) dbBody.sha = dbSha;

        console.log("Pushing updated database.json...");
        const dbUpdateRes = await githubFetch('database.json', {
            method: 'PUT',
            body: JSON.stringify(dbBody)
        });

        if (!dbUpdateRes.ok) {
            const dbErr = await dbUpdateRes.json();
            console.error("GitHub API Error (Database):", dbErr);
            throw new Error(dbErr.message || 'Failed to update database.json');
        }

        console.log("Database updated successfully.");

        return res.status(200).json({ 
            success: true, 
            url: downloadUrl,
            path: pdfData.content.path
        });
    } catch (error) {
        console.error('Upload Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
