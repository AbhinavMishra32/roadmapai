import React, { useState, useRef } from 'react';
import './VideoDetails.css';

interface VideoDetailsProps {
    videoUrl: string;
    title?: string;
    onEnded?: () => void;
}

const VideoDetails: React.FC<VideoDetailsProps> = ({ videoUrl, title, onEnded }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <div className="video-container">
            {title && <h2 className="video-title">{title}</h2>}
            <div className="video-wrapper">
                <video
                    ref={videoRef}
                    src={videoUrl}
                    className="video-player"
                    onEnded={() => {
                        setIsPlaying(false);
                        onEnded?.();
                    }}
                >
                    Your browser does not support the video tag.
                </video>
                <div className="video-controls">
                    <button
                        className={`play-pause-button ${isPlaying ? 'playing' : ''}`}
                        onClick={handlePlayPause}
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                    >
                        <svg viewBox="0 0 24 24" width="24" height="24">
                            {isPlaying ? (
                                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" fill="currentColor" />
                            ) : (
                                <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;