import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Button, Box, Typography, CircularProgress } from '@mui/material';
import { useSpring, animated, config } from 'react-spring';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import confetti from 'canvas-confetti';
import './fileupload.css'; // Import the CSS file

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [compressedLink, setCompressedLink] = useState('');
  const [decompressedLink, setDecompressedLink] = useState('');
  const [loading, setLoading] = useState(false);
  const [fileSelected, setFileSelected] = useState(false); // Track if file is selected
  const videoRef = useRef(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setFileSelected(true); // Set fileSelected to true when a file is chosen
  };

  // Handle file upload and compression
  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://127.0.0.1:5000/compress', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.file_url && response.data.decompress_url) {
        setCompressedLink(`http://127.0.0.1:5000${response.data.file_url}`);
        setDecompressedLink(`http://127.0.0.1:5000${response.data.decompress_url}`);
      } else {
        alert('Error occurred during file compression.');
        console.error('Error response:', response.data);
      }
    } catch (error) {
      console.error('Error uploading the file:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
        alert(`Error: ${error.response.data.error || 'Internal Server Error'}`);
      } else if (error.request) {
        console.error('Error request:', error.request);
        alert('Error: No response from server');
      } else {
        console.error('Error message:', error.message);
        alert('Error: Unable to upload file');
      }
    } finally {
      setLoading(false);
    }
  };

  // Spring animation for file input
  const fileInputAnimation = useSpring({
    transform: file ? 'scale(1.1)' : 'scale(1)',
    config: { tension: 300, friction: 10 },
  });

  // Spring animation for upload button
  const buttonAnimation = useSpring({
    opacity: loading ? 0.5 : 1,
    transform: loading ? 'scale(0.95)' : 'scale(1)',
    config: config.stiff,
  });

  // Spring animation for download link
  const linkAnimation = useSpring({
    opacity: compressedLink || decompressedLink ? 1 : 0,
    transform: compressedLink || decompressedLink ? 'translateY(0)' : 'translateY(20px)',
    config: { tension: 300, friction: 20 },
  });

  // Effect to handle video playback
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      const handleTimeUpdate = () => {
        if (video.currentTime >= 35.90) {
          video.currentTime = 5.50;
        }
      };

      video.addEventListener('timeupdate', handleTimeUpdate);

      video.addEventListener('loadeddata', () => {
        video.currentTime = 5.50;
        video.playbackRate = 1.15;
        video.play();
      });

      return () => {
        video.removeEventListener('timeupdate', handleTimeUpdate);
      };
    }
  }, []);

  // Handle file download and confetti effect
  const handleDownload = (url) => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    window.location.href = url; // Trigger the file download
  };

  return (
    <Box className="container" display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" p={4}>
      <video ref={videoRef} autoPlay loop muted className="background-video">
        <source src="/space.mp4" type="video/mp4" />
      </video>
      <Typography variant="h4" mb={2} className="title">File Compression</Typography>
      
      {/* File input with animated label */}
      <animated.div style={fileInputAnimation}>
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
        <label htmlFor="file-upload">
          <Button variant="contained" color="primary" component="span" startIcon={<UploadFileIcon />} className={`upload-button ${fileSelected ? 'file-selected' : ''}`} sx={{ mb: 2 }}>
            Choose File
          </Button>
        </label>
      </animated.div>
      
      {/* Upload button with animated appearance */}
      <animated.div style={buttonAnimation}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleUpload}
          disabled={loading || !fileSelected} // Disable button if no file selected
          sx={{ mb: 2 }}
          className={`upload-button ${fileSelected ? 'file-selected' : ''}`}
        >
          {loading ? <CircularProgress size={24} /> : 'Upload and Compress'}
        </Button>
      </animated.div>
      
      {/* Download links with animated appearance */}
      <animated.div style={linkAnimation}>
        {compressedLink && (
          <Box mt={2}>
            <Typography variant="body1" className="typography">
              <a href={compressedLink} download={file.name + ".gz"} className="download-button" onClick={() => handleDownload(compressedLink)}>Download Compressed File</a>
            </Typography>
          </Box>
        )}
        {decompressedLink && (
          <Box mt={2}>
            <Typography variant="body1" className="typography">
              <a href={decompressedLink} download={file.name} className="download-button" onClick={() => handleDownload(decompressedLink)}>Download Original File</a>
            </Typography>
          </Box>
        )}
      </animated.div>
    </Box>
  );
};

export default FileUpload;
