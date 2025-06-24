const express = require('express');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

// Multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Route to handle CSV upload
app.post('/upload-csv', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(req.file.path); // delete file after parsing
      console.log("Sending response:", {
  message: 'File uploaded and parsed!',
  data: results
});

      res.json({
        message: 'File uploaded and parsed!', // ✅ This must be included!
        data: results
      });
    })
    .on('error', (err) => {
      console.error(err);
      res.status(500).json({ message: 'CSV parsing failed.' });
    });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
