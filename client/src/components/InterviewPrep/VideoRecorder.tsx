import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button"

interface VideoRecorderProps {
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  onVideoReady: (blob: Blob) => void;
}

const VideoRecorder: React.FC<VideoRecorderProps> = ({ isRecording, setIsRecording, onVideoReady }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [countdown, setCountdown] = useState(3);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    let countdownInterval: NodeJS.Timeout;
    if (isRecording && countdown > 0) {
      countdownInterval = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      startRecording();
    }
    return () => clearInterval(countdownInterval);
  }, [isRecording, countdown]);

  const startRecording = async () => {
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
        onVideoReady(blob);
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
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="relative">
      <video ref={videoRef} autoPlay muted className="w-full h-64 bg-gray-200 rounded-lg"></video>
      {isRecording && countdown > 0 && (
        <motion.div 
          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl font-bold"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
        >
          {countdown}
        </motion.div>
      )}
      <div className="mt-4 flex justify-center">
        {!isRecording ? (
          <Button 
            onClick={() => setIsRecording(true)}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-800"
          >
            Start Recording
          </Button>
        ) : (
          <Button 
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white"
          >
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default VideoRecorder;

