import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "motion/react";
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, User as UserIcon, Copy, Check, Smartphone, Monitor } from "lucide-react";
import { useApp, cn } from "../App";

export default function HomePage() {
  const { user, t } = useApp();
  const location = useLocation();
  const [targetId, setTargetId] = useState("");
  const [isCalling, setIsCalling] = useState(false);
  const [isIncoming, setIsIncoming] = useState(false);
  const [callerId, setCallerId] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  useEffect(() => {
    socketRef.current = io();
    
    if (user) {
      socketRef.current.emit("register", user.id);
    }

    // Handle auto-call from query param
    const params = new URLSearchParams(location.search);
    const callId = params.get("call");
    if (callId && callId.length === 4 && callId !== user?.id) {
      setTargetId(callId);
      // We need to wait a bit for the socket to register before calling
      setTimeout(() => {
        startCall(callId);
      }, 1000);
    }

    socketRef.current.on("incoming-call", async ({ from, offer }) => {
      setCallerId(from);
      setIsIncoming(true);
      (window as any).pendingOffer = offer;
    });

    socketRef.current.on("call-answered", async ({ answer }) => {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        setCallActive(true);
        setIsCalling(false);
      }
    });

    socketRef.current.on("ice-candidate", async ({ candidate }) => {
      if (peerConnectionRef.current) {
        try {
          await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (e) {
          console.error("Error adding ice candidate", e);
        }
      }
    });

    socketRef.current.on("hang-up", () => {
      endCall();
    });

    return () => {
      socketRef.current?.disconnect();
      endCall();
    };
  }, [user, location.search]);

  const setupMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      return null;
    }
  };

  const createPeerConnection = (stream: MediaStream, target: string) => {
    const pc = new RTCPeerConnection(configuration);
    
    stream.getTracks().forEach(track => pc.addTrack(track, stream));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socketRef.current?.emit("ice-candidate", { to: target, candidate: event.candidate });
      }
    };

    pc.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnectionRef.current = pc;
    return pc;
  };

  const startCall = async (idToCall?: string) => {
    const id = idToCall || targetId;
    if (!id || id === user?.id) return;
    
    setIsCalling(true);
    const stream = await setupMedia();
    if (!stream) {
      setIsCalling(false);
      return;
    }

    const pc = createPeerConnection(stream, id);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    
    socketRef.current?.emit("call-user", { to: id, offer, from: user?.id });
  };

  const acceptCall = async () => {
    setIsIncoming(false);
    const stream = await setupMedia();
    if (!stream) return;

    const pc = createPeerConnection(stream, callerId);
    await pc.setRemoteDescription(new RTCSessionDescription((window as any).pendingOffer));
    
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);
    
    socketRef.current?.emit("answer-call", { to: callerId, answer });
    setCallActive(true);
  };

  const endCall = () => {
    peerConnectionRef.current?.close();
    peerConnectionRef.current = null;
    
    localStream?.getTracks().forEach(track => track.stop());
    setLocalStream(null);
    setRemoteStream(null);
    
    setCallActive(false);
    setIsCalling(false);
    setIsIncoming(false);
    
    if (socketRef.current && (targetId || callerId)) {
      socketRef.current.emit("hang-up", { to: targetId || callerId });
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);
    }
  };

  const copyId = () => {
    if (user?.id) {
      navigator.clipboard.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{t.startCall}</h2>
          <p className="text-neutral-500 text-sm mt-1">{t.howToUse}</p>
        </div>
        <div className="flex items-center gap-3 bg-neutral-50 p-3 rounded-2xl border border-neutral-100">
          <div className="text-right">
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{t.yourId}</p>
            <p className="text-xl font-mono font-bold text-indigo-600">{user?.id}</p>
          </div>
          <button 
            onClick={copyId}
            className="p-2 hover:bg-white rounded-xl transition-colors text-neutral-400 hover:text-indigo-600"
          >
            {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
          </button>
        </div>
      </div>

      {/* Main Call Area */}
      <div className="relative aspect-video md:aspect-[16/9] bg-neutral-900 rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        {!callActive ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-600 mb-6">
              <UserIcon size={48} />
            </div>
            <div className="max-w-sm w-full space-y-4">
              <input 
                type="text" 
                maxLength={4}
                value={targetId}
                onChange={(e) => setTargetId(e.target.value.replace(/\D/g, ""))}
                placeholder={t.enterId}
                className="w-full bg-neutral-800 border-2 border-neutral-700 text-white text-center text-2xl font-mono py-4 rounded-2xl focus:border-indigo-500 outline-none transition-all placeholder:text-neutral-600"
              />
              <button 
                onClick={startCall}
                disabled={targetId.length !== 4 || isCalling}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-neutral-800 disabled:text-neutral-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-indigo-900/20 transition-all flex items-center justify-center gap-3"
              >
                <Phone size={24} />
                {isCalling ? "Calling..." : t.call}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Remote Video (Full Screen) */}
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture in Picture) */}
            <div className="absolute bottom-6 right-6 w-32 md:w-48 aspect-video bg-neutral-800 rounded-2xl overflow-hidden border-2 border-white shadow-xl">
              <video 
                ref={localVideoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover"
              />
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900/80">
                  <VideoOff size={24} className="text-white/50" />
                </div>
              )}
            </div>

            {/* Call Controls */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 p-2 bg-black/20 backdrop-blur-xl rounded-3xl border border-white/10">
              <button 
                onClick={toggleAudio}
                className={cn(
                  "p-4 rounded-2xl transition-all",
                  audioEnabled ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"
                )}
              >
                {audioEnabled ? <Mic size={24} /> : <MicOff size={24} />}
              </button>
              <button 
                onClick={toggleVideo}
                className={cn(
                  "p-4 rounded-2xl transition-all",
                  videoEnabled ? "bg-white/10 text-white hover:bg-white/20" : "bg-red-500 text-white"
                )}
              >
                {videoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
              </button>
              <button 
                onClick={endCall}
                className="p-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all shadow-lg shadow-red-900/20"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          </>
        )}

        {/* Incoming Call Overlay */}
        <AnimatePresence>
          {isIncoming && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6"
            >
              <div className="bg-white p-8 rounded-[40px] shadow-2xl w-full max-w-xs text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 mx-auto mb-6 animate-pulse">
                  <Phone size={32} />
                </div>
                <h3 className="text-xl font-bold mb-1">Incoming Call</h3>
                <p className="text-neutral-500 mb-8">User ID: <span className="font-mono font-bold text-indigo-600">{callerId}</span></p>
                <div className="flex gap-4">
                  <button 
                    onClick={endCall}
                    className="flex-1 bg-neutral-100 text-neutral-600 py-4 rounded-2xl font-bold hover:bg-neutral-200 transition-colors"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={acceptCall}
                    className="flex-1 bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-100"
                  >
                    Accept
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Device Info (Responsive Hint) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
            <Monitor size={24} />
          </div>
          <div>
            <h4 className="font-bold">Desktop Ready</h4>
            <p className="text-sm text-neutral-500">Optimized for large screens and webcams.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
            <Smartphone size={24} />
          </div>
          <div>
            <h4 className="font-bold">Mobile Friendly</h4>
            <p className="text-sm text-neutral-500">Works perfectly on mobile browsers.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
