import React, { useRef, useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface Props {
  videoUrl?: string;
  className?: string;
  autoPlay?: boolean;
}

export const ExerciseVideo: React.FC<Props> = ({ videoUrl, className = "w-full h-full", autoPlay = true }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reset state when url changes
    setError(false);
    setLoading(true);
    
    if (videoRef.current) {
      videoRef.current.load();
      // Ensure muted for autoplay policy
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
    }
  }, [videoUrl]);

  if (!videoUrl || error) {
    return (
      <div className={`flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-800 text-slate-400 ${className}`}>
        <AlertCircle size={32} className="mb-2 opacity-50" />
        <span className="text-xs font-medium">Video Unavailable</span>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-200 dark:bg-slate-700 animate-pulse z-10">
          {/* Skeleton Loader */}
        </div>
      )}
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        autoPlay={autoPlay}
        loop
        muted
        playsInline
        onLoadedData={() => setLoading(false)}
        onError={() => {
            console.error("Video load failed for:", videoUrl);
            setError(true);
            setLoading(false);
        }}
      />
      {/* Dark overlay for text legibility if needed */}
      <div className="absolute inset-0 bg-black/10 pointer-events-none" />
    </div>
  );
};