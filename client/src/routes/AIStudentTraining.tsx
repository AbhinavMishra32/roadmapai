import React, { useState, useRef, ChangeEvent, FormEvent } from 'react';
import { api } from '@/services/axios';

const AIStudentTraining = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [recording, setRecording] = useState<boolean>(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setVideoFile(file);
  };

  const startRecording = async () => {
    setRecording(true);
    chunks.current = [];
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks.current, { type: 'video/mp4' });
        setRecordedBlob(blob);
        if (videoRef.current?.srcObject) {
          const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
          tracks.forEach((track) => track.stop());
        }
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    } catch (error) {
      console.error('Error accessing camera:', error);
      setRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const videoToUpload = recordedBlob || videoFile;
    if (!videoToUpload) {
      alert('Please select or record a video!');
      return;
    }

    console.log('Uploading video:', videoToUpload);

    const formData = new FormData();
    formData.append('video', videoToUpload, recordedBlob ? 'recording.mp4' : videoFile?.name || 'video.mp4');

    try {
      setUploading(true);
      const response = await api.post('/api/ai/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      console.log('File uploaded successfully:', response.data);
      setResponse(response.data.response);
      alert(`Video ready for inference: ${response.data.message}`);
    } catch (error) {
      console.error('Error uploading video:', error);
      alert('Failed to upload video');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Option to select a file */}
        <input type="file" accept="video/mp4" onChange={handleFileChange} />

        {/* Video recording section */}
        <div>
          <video ref={videoRef} autoPlay muted style={{ width: '100%', maxHeight: '400px' }}></video>
          {recording ? (
            <button type="button" onClick={stopRecording}>
              Stop Recording
            </button>
          ) : (
            <button type="button" onClick={startRecording}>
              Start Recording
            </button>
          )}
        </div>

        {/* Upload button */}
        <button type="submit">Upload Video</button>

        {/* Upload status */}
        {uploading && <p>Uploading...</p>}
        {response && <p>Response: {response}</p>}
      </form>
    </div>
  );
};

export default AIStudentTraining;