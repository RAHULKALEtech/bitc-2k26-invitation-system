import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InvitationChatbotVideoProps {
  isInvitationRevealed: boolean;
  videoSrc?: string;
}

export const InvitationChatbotVideo: React.FC<InvitationChatbotVideoProps> = ({
  isInvitationRevealed,
  videoSrc = '/jsdRchatbot.mp4',
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useCanvasKeying, setUseCanvasKeying] = useState(true);

  // Auto-play and reset control
  useEffect(() => {
    if (isInvitationRevealed && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.playbackRate = 0.85; // Smooth, clear, steady speed
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented by browser policy:', err);
      });
    } else if (!isInvitationRevealed && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isInvitationRevealed]);

  // Real-time canvas chroma-keying to remove light/white background dynamically
  useEffect(() => {
    if (!isInvitationRevealed || !useCanvasKeying) return;

    let animFrameId: number;

    const processFrame = () => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState >= 2) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
            canvas.width = video.videoWidth || 300;
            canvas.height = video.videoHeight || 300;
          }

          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const l = frame.data.length / 4;

          // Key out white/light background pixels (making them transparent)
          for (let i = 0; i < l; i++) {
            const r = frame.data[i * 4];
            const g = frame.data[i * 4 + 1];
            const b = frame.data[i * 4 + 2];

            // If pixel is near white/light gray
            if (r > 200 && g > 200 && b > 200) {
              frame.data[i * 4 + 3] = 0; // Set Alpha to 0 (Transparent)
            } else if (r > 160 && g > 160 && b > 160) {
              // Soft edge feathering
              const avg = (r + g + b) / 3;
              const alpha = Math.max(0, 255 - (avg - 160) * 3);
              frame.data[i * 4 + 3] = Math.min(frame.data[i * 4 + 3], alpha);
            }
          }

          ctx.putImageData(frame, 0, 0);
        }
      }
      animFrameId = requestAnimationFrame(processFrame);
    };

    animFrameId = requestAnimationFrame(processFrame);

    return () => {
      if (animFrameId) cancelAnimationFrame(animFrameId);
    };
  }, [isInvitationRevealed, useCanvasKeying]);

  if (!isInvitationRevealed) {
    return null;
  }

  return (
    <AnimatePresence>
      {isInvitationRevealed && (
        <motion.div
          initial={{ opacity: 0, x: 60, y: 30, scale: 0.8 }}
          animate={{
            opacity: 1,
            x: 0,
            y: [0, -10, 0],
            scale: 1,
          }}
          exit={{ opacity: 0, x: 60, scale: 0.8 }}
          transition={{
            opacity: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            x: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            scale: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
            y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          }}
          className="absolute -right-4 sm:-right-14 md:-right-24 lg:-right-36 xl:-right-44 top-20 sm:top-28 lg:top-36 z-30 pointer-events-none flex flex-col items-center select-none"
        >
          {/* Holographic Glowing Aura Ring behind Robot */}
          <div className="absolute w-36 h-36 sm:w-48 sm:h-48 lg:w-60 lg:h-60 rounded-full bg-cyan-500/20 blur-3xl animate-pulse pointer-events-none" />

          {/* Hidden Source Video for Canvas Processing */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            src={videoSrc}
            onError={() => {
              // Try fallback paths if main path fails
              if (videoRef.current && videoRef.current.src !== window.location.origin + '/jsdRCHATBIT.mp4') {
                videoRef.current.src = '/jsdRCHATBIT.mp4';
              }
            }}
            className={useCanvasKeying ? 'hidden' : 'w-28 sm:w-36 lg:w-48 xl:w-56 h-auto mix-blend-multiply filter contrast-125'}
          />

          {/* Real-Time Transparent Canvas Video Display (Removes Light Rectangular Box) */}
          {useCanvasKeying ? (
            <canvas
              ref={canvasRef}
              className="w-28 sm:w-36 lg:w-48 xl:w-56 h-auto object-contain drop-shadow-[0_0_25px_rgba(0,240,255,0.7)]"
            />
          ) : null}

          {/* Cyber Status Label under Robot */}
          <div className="mt-2 px-3 py-1 rounded-full border border-cyan-500/40 bg-slate-900/90 backdrop-blur-md text-[10px] font-mono font-semibold text-cyan-300 tracking-wider shadow-[0_0_15px_rgba(0,240,255,0.4)] flex items-center space-x-1">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
            <span>AI ASSISTANT</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
