require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

// Array to store original URLs
const originalURLs = [];

// URL Shortener API endpoint
app.post('/api/shorturl', (req, res) => {
  const url = req.body.url;

  // Regular expression for URL format validation
  const pattern = /^(https?:\/\/)?([\w.]+)\.([a-z]{2,})(\.[a-z]{2,})?$/i;

  // Check if the URL matches the valid format
  if (!pattern.test(url)) {
    return res.json({ error: 'invalid url' });
  }

  // Add the original URL to the array
  originalURLs.push(url);

  // Respond with the original URL and its index in the array
  res.json({
    original_url: url,
    short_url: originalURLs.indexOf(url)
  });
});

// Shortened URL's original URL access API endpoint
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortURLIndex = req.params.short_url;

  // Check if the index is valid
  if (!originalURLs[shortURLIndex]) {
    return res.json({ error: 'No URL found for the given short_url' });
  }

  // Redirect to the original URL
  res.redirect(originalURLs[shortURLIndex]);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
