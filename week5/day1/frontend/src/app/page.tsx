'use client';

import React, { useState, useEffect, useRef } from 'react';
import { socket } from '@/lib/socket';
import { Send, User, MessageCircle, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
  id: string;
  userName: string;
  text: string;
  timestamp: string;
}

export default function Home() {
  const [userName, setUserName] = useState('');
  const [inputText, setInputText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.connect();

    function onConnect() {
      setIsConnected(true);
      console.log('Connected to server');
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log('Disconnected from server');
    }

    function onNewComment(newComment: Comment) {
      setComments((prev) => [...prev, newComment]);
      
      // If someone else commented, show a toast
      // We check memory/local state for the name to see if it's the current user
      // A more robust way would be comparing socket IDs or having a persistent user ID
      if (newComment.userName !== userName) {
        toast.success(`New comment from ${newComment.userName}`, {
          icon: '💬',
          style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
          },
        });
      }
    }

    function onAllComments(allComments: Comment[]) {
      setComments(allComments);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('new_comment', onNewComment);
    socket.on('all_comments', onAllComments);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('new_comment', onNewComment);
      socket.off('all_comments', onAllComments);
      socket.disconnect();
    };
  }, [userName]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [comments]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    if (!userName.trim()) {
      toast.error('Please enter your name first');
      return;
    }

    socket.emit('add_comment', {
      userName: userName.trim(),
      text: inputText.trim(),
    });

    setInputText('');
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-[300px_1fr] gap-6 animate-in">
        
        {/* Sidebar / Profile Area */}
        <div className="glass p-6 rounded-2xl flex flex-col gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
              <User className="text-white w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Your Profile</h2>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm text-gray-400">Display Name</label>
            <input
              type="text"
              placeholder="e.g. Alex"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white"
            />
          </div>

          <div className="mt-auto">
            <div className="flex items-center gap-2 text-xs">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
              <span className="text-gray-400">{isConnected ? 'Connected to Server' : 'Disconnected'}</span>
            </div>
          </div>
        </div>

        {/* Comment Section Area */}
        <div className="glass rounded-2xl flex flex-col overflow-hidden max-h-[600px]">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-blue-400" />
              <span className="font-semibold text-lg">Live Comments ({comments.length})</span>
            </div>
          </div>

          {/* Comment List */}
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar"
          >
            {comments.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-gray-500 text-center">
                <MessageCircle className="w-12 h-12 mb-2 opacity-20" />
                <p>No comments yet. Be the first to say something!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <div 
                  key={comment.id} 
                  className={`flex flex-col gap-1 p-3 rounded-xl animate-in ${
                    comment.userName === userName 
                    ? 'bg-blue-600/20 border border-blue-500/30 self-end ml-12' 
                    : 'bg-white/5 border border-white/10 self-start mr-12'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-bold text-sm text-blue-300">{comment.userName}</span>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-200 text-sm">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Input Box */}
          <form 
            onSubmit={handleSend}
            className="p-4 bg-white/5 border-t border-white/10 flex gap-2"
          >
            <input
              type="text"
              placeholder="Write a comment..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              disabled={!isConnected}
              className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-white disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!isConnected || !inputText.trim() || !userName.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:bg-gray-600 text-white p-2 px-4 rounded-xl transition-all flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>
    </main>
  );
}
