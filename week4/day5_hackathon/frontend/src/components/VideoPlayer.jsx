import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Settings,
  PictureInPicture,
  RotateCcw,
  RotateCw,
} from "lucide-react";
import ReactPlayer from "react-player";

const VideoPlayer = ({ videoUrl, poster, title }) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const controlsTimeoutRef = useRef(null);

  // Initialize playback correctly when the videoUrl loads
  useEffect(() => {
    let isMounted = true;
    const playVideo = async () => {
      if (videoRef.current && videoUrl) {
        try {
          await videoRef.current.play();
          if (isMounted) setIsPlaying(true);
        } catch (err) {
          console.log("Autoplay blocked. User interaction required.");
          if (isMounted) setIsPlaying(false); // Ensure UI displays 'paused' state if blocked
        }
      }
    };
    playVideo();
    return () => { isMounted = false; };
  }, [videoUrl]);

  // Handle Video Time Update
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const total = videoRef.current.duration;
    setCurrentTime(current);
    if (total > 0) setProgress((current / total) * 100);
  };

  // Handle Video Loaded Data
  const handleLoadedData = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const val = parseFloat(e.target.value);
    const seekTime = (val / 100) * duration;
    videoRef.current.currentTime = seekTime;
    setProgress(val);
  };

  const skipTime = (amount) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime += amount;
  };

  const handleVolumeChange = (e) => {
    const vol = parseFloat(e.target.value);
    setVolume(vol);
    if (videoRef.current) {
      videoRef.current.volume = vol;
      videoRef.current.muted = vol === 0;
      setIsMuted(vol === 0);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const newMuted = !videoRef.current.muted;
    videoRef.current.muted = newMuted;
    setIsMuted(newMuted);
    if (!newMuted && volume === 0) {
      setVolume(1);
      videoRef.current.volume = 1;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changePlaybackSpeed = (speed) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  // Mouse activity hiding controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
        setShowSettings(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
      setShowSettings(false);
    }
  };

  const formatTime = (timeInSeconds) => {
    if (isNaN(timeInSeconds)) return "00:00";
    const m = Math.floor(timeInSeconds / 60).toString().padStart(2, "0");
    const s = Math.floor(timeInSeconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const isExternalStream = videoUrl && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") || videoUrl.includes("vimeo.com"));

  if (isExternalStream) {
    return (
       <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#262626]">
         <ReactPlayer 
           url={videoUrl} 
           width="100%" 
           height="100%" 
           controls={true}
           playing={isPlaying}
         />
       </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black rounded-lg overflow-hidden border border-[#262626] group flex items-center justify-center ${
        !showControls && isPlaying ? "cursor-none" : ""
      }`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (!showControls) setShowControls(true);
      }}
    >
      <video
        ref={videoRef}
        src={videoUrl}
        poster={poster}
        className="w-full h-full object-contain cursor-pointer"
        onTimeUpdate={handleTimeUpdate}
        onLoadedData={handleLoadedData}
        onEnded={() => setIsPlaying(false)}
        onClick={togglePlay}
        playsInline
      />

      {/* Central Play/Pause Animation Overlay */}
      <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 ${!isPlaying && showControls ? "opacity-100" : "opacity-0"}`}>
        <div className="bg-black/50 p-6 rounded-full backdrop-blur-md border border-[#ffffff20]">
          {!isPlaying && <Play size={48} fill="white" className="text-white ml-2" />}
        </div>
      </div>

      {/* Title Bar */}
      <div className={`absolute top-0 left-0 right-0 p-5 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-300 ${showControls ? "opacity-100" : "opacity-0"}`}>
        <h2 className="text-white font-semibold text-lg drop-shadow-md">{title}</h2>
      </div>

      {/* Main Controls Overlay */}
      <div
        onClick={(e) => e.stopPropagation()} 
        className={`absolute bottom-0 left-0 right-0 px-4 pb-4 pt-16 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 flex flex-col gap-3 ${showControls ? "opacity-100" : "opacity-0"}`}
      >
        {/* Progress Timeline */}
        <div className="flex items-center gap-3 w-full group/timeline">
          <input
            type="range"
            min="0"
            max="100"
            value={progress || 0}
            onChange={handleSeek}
            className="w-full h-1 bg-[#444] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-[#E50000] [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:w-4 hover:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:transition-all transition-all group-hover/timeline:h-1.5"
            style={{ background: `linear-gradient(to right, #E50000 ${progress || 0}%, #444 ${progress || 0}%)` }}
          />
        </div>

        {/* Bottom Controls */}
        <div className="flex items-center justify-between w-full">
          {/* Left: Play/Pause, Skip, Volume, Time */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button onClick={togglePlay} className="text-white hover:text-[#E50000] transition-colors">
              {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
            </button>

            <div className="items-center gap-4 hidden sm:flex">
              <button onClick={() => skipTime(-10)} className="text-white hover:text-[#E50000] transition-colors" title="Rewind 10s"><RotateCcw size={18} /></button>
              <button onClick={() => skipTime(10)} className="text-white hover:text-[#E50000] transition-colors" title="Forward 10s"><RotateCw size={18} /></button>
            </div>

            <div className="flex items-center gap-2 group/volume">
              <button onClick={toggleMute} className="text-white hover:text-[#E50000] transition-colors">
                {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="hidden lg:block lg:w-20 lg:opacity-100 transition-all h-1 bg-[#444] rounded-full appearance-none cursor-pointer outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                style={{ background: `linear-gradient(to right, white ${(isMuted ? 0 : volume) * 100}%, #444 ${(isMuted ? 0 : volume) * 100}%)` }}
              />
            </div>

            <div className="text-white text-xs lg:text-sm font-medium tabular-nums drop-shadow-sm ml-2">
              {formatTime(currentTime)} <span className="text-[#999] opacity-70">/ {formatTime(duration)}</span>
            </div>
          </div>

          {/* Right: Settings, PiP, Fullscreen */}
          <div className="flex items-center gap-5 relative">
            <button onClick={togglePiP} className="text-white hover:text-[#E50000] transition-colors hidden sm:block" title="Picture in Picture"><PictureInPicture size={18} /></button>

            <div className="relative">
              <button onClick={() => setShowSettings(!showSettings)} className={`text-white hover:text-[#E50000] transition-colors ${showSettings ? "text-[#E50000]" : ""}`} title="Settings">
                <Settings size={20} className={showSettings ? "animate-spin" : ""} style={showSettings ? { animationDuration: "3s" } : undefined} />
              </button>

              {showSettings && (
                <div className="absolute bottom-12 right-0 bg-[#1A1A1A] border border-[#262626] rounded-lg py-2 min-w-[120px] shadow-2xl z-50">
                  <div className="px-3 pb-1 mb-1 border-b border-[#333] text-xs text-[#999] uppercase font-semibold">Speed</div>
                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changePlaybackSpeed(speed)}
                      className={`w-full text-left px-4 py-1.5 text-sm hover:bg-[#333] transition-colors ${playbackSpeed === speed ? "text-[#E50000] font-medium" : "text-white"}`}
                    >
                      {speed === 1 ? "Normal" : `${speed}x`}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={toggleFullscreen} className="text-white hover:text-[#E50000] transition-colors">
              {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
