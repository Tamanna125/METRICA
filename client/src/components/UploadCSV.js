import ChartView from '../ChartView'; 
import '../App.css';
import React, { useState } from 'react';
import axios from 'axios';

function UploadCSV() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [csvData, setCsvData] = useState([]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.type !== 'text/csv') {
      setMessage('❌ Please upload a valid CSV file.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setMessage('');
  };

  const handleUpload = async () => {
    console.log("Upload button clicked");

    if (!file) {
      setMessage('❌ No file selected.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('http://localhost:5000/upload-csv', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Server response:', res.data);

      // ✅ Use exact keys
      if (res.data && res.data.message && res.data.data) {
        setMessage('✅ ' + res.data.message);
        setCsvData(res.data.data);
      } else {
        setMessage('⚠️ Upload succeeded but unexpected response.');
        setCsvData([]);
      }

    } catch (err) {
      console.error(err);
      setMessage('❌ Error uploading file.');
    }
  };

  return (
    <div>
      <h2>Metrica: Data Upload</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <p>{message}</p>

      {Array.isArray(csvData) && csvData.length > 0 && (
        <table border="1" cellPadding="10" style={{ marginTop: '20px', width: '100%' }}>
          <thead style={{ backgroundColor: '#0077cc', color: 'white' }}>
            <tr>
              {Object.keys(csvData[0]).map((col, i) => (
                <th key={i}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((value, j) => (
                  <td key={j}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {csvData.length > 0 && <ChartView data={csvData} />}

    </div>
  );
}

export default UploadCSV;
