const express = require('express');
const app = express();
const PORT = process.env.PORT || 10000;

app.get('/', async (req, res) => {
    const searchString = '?url=';
    const urlIndex = req.originalUrl.indexOf(searchString);
    
    // Check if '?url=' exists in the request
    if (urlIndex === -1) {
        return res.status(400).json({ error: "Please provide a URL. Example: /?url=https://xyz.com/index.mpd" });
    }

    // This perfectly extracts the full target URL, protecting parameters like &token= and &__hdnea__=
    const targetUrl = req.originalUrl.substring(urlIndex + searchString.length);

    try {
        // Native fetch resolves as soon as the headers arrive. 
        // Because we don't request the body, the .mpd file is NEVER downloaded.
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        // Loop through the captured response headers and save them
        const capturedHeaders = {};
        response.headers.forEach((value, key) => {
            capturedHeaders[key] = value;
        });

        // Send the final result back to you
        res.json({
            target_url: targetUrl,
            status: response.status,
            headers: capturedHeaders
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to fetch headers", details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
