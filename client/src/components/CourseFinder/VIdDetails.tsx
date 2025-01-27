import React, { useState, useRef } from 'react';

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
                        className="play-pause-button"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VideoDetails;</video>