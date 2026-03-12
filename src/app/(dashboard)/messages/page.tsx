"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PaperAirplaneIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/outline";

const sampleConversations = [
  {
    id: "1",
    otherUser: { id: "u1", name: "Ralph Martinez", avatarUrl: null, role: "Producer" },
    lastMessage: { content: "Let me know when you're available to discuss the Atlanta shoot.", createdAt: "2:30 PM", senderId: "u1" },
    unreadCount: 2,
  },
  {
    id: "2",
    otherUser: { id: "u2", name: "Shahpoor Ahmadi", avatarUrl: null, role: "Director" },
    lastMessage: { content: "The color grade looks amazing. Great work!", createdAt: "Yesterday", senderId: "u2" },
    unreadCount: 0,
  },
  {
    id: "3",
    otherUser: { id: "u3", name: "Sarah Chen", avatarUrl: null, role: "DP" },
    lastMessage: { content: "I can bring my ARRI package for the shoot.", createdAt: "Mar 6", senderId: "u3" },
    unreadCount: 0,
  },
];

const sampleMessages = [
  { id: "m1", senderId: "u1", content: "Hey, I saw your profile on FrameOne. We're staffing up for a feature shooting in Atlanta.", createdAt: "10:15 AM" },
  { id: "m2", senderId: "me", content: "Hi Ralph! Thanks for reaching out. I'd love to hear more about the project.", createdAt: "10:22 AM" },
  { id: "m3", senderId: "u1", content: "It's a thriller, shooting for 6 weeks starting March 15. We need a Line Producer who knows the Atlanta market.", createdAt: "10:25 AM" },
  { id: "m4", senderId: "me", content: "That sounds right up my alley. I've done three productions in Atlanta over the past two years. What's the budget range?", createdAt: "10:30 AM" },
  { id: "m5", senderId: "u1", content: "Let me know when you're available to discuss the Atlanta shoot.", createdAt: "2:30 PM" },
];

export default function MessagesPage() {
  const { data: session } = useSession();
  const [selectedConvo, setSelectedConvo] = useState<string | null>("1");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(sampleMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages([
      ...messages,
      {
        id: `m${Date.now()}`,
        senderId: "me",
        content: newMessage.trim(),
        createdAt: "Just now",
      },
    ]);
    setNewMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const selectedConversation = sampleConversations.find((c) => c.id === selectedConvo);

  return (
    <div className="flex h-[calc(100vh-7rem)] animate-fade-in rounded-2xl border border-white/[0.08] overflow-hidden">
      {/* Conversation list */}
      <div className="w-80 border-r border-white/[0.08] flex flex-col bg-[#131318]">
        <div className="p-5 border-b border-white/[0.08]">
          <h2 className="text-lg font-light text-[#f0efe6] mb-4 tracking-tight">Messages</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#9e9eab]" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full border border-white/[0.08] bg-white/[0.04] pl-10 pr-4 py-2.5 text-sm text-[#f0efe6] placeholder-[#6b6b78] focus:border-[#9d7663]/40 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {sampleConversations.map((convo) => (
            <button
              key={convo.id}
              onClick={() => setSelectedConvo(convo.id)}
              className={`w-full flex items-start gap-3.5 px-5 py-4 text-left transition-colors border-b border-white/[0.04] ${
                selectedConvo === convo.id
                  ? "bg-white/[0.04]"
                  : "hover:bg-white/[0.02]"
              }`}
            >
              <div className="relative mt-0.5">
                <Avatar name={convo.otherUser.name} size="md" />
                {convo.unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#9d7663] text-[10px] font-bold text-white">
                    {convo.unreadCount}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-[#f0efe6] truncate">{convo.otherUser.name}</span>
                  <span className="text-[11px] text-[#9e9eab] shrink-0 ml-2">{convo.lastMessage.createdAt}</span>
                </div>
                <p className="text-[11px] text-[#9d7663] mt-0.5">{convo.otherUser.role}</p>
                <p className={`text-xs mt-1 truncate leading-relaxed ${convo.unreadCount > 0 ? "text-[#cdc9bc] font-medium" : "text-[#6b6b78]"}`}>
                  {convo.lastMessage.content}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Message area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col bg-[#1f1f2a]">
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/[0.08] bg-[#1f1f2a]">
            <Avatar name={selectedConversation.otherUser.name} size="md" />
            <div>
              <p className="text-sm font-normal text-[#f0efe6]">{selectedConversation.otherUser.name}</p>
              <p className="text-[11px] text-[#9d7663] mt-0.5">{selectedConversation.otherUser.role}</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {messages.map((msg) => {
              const isMe = msg.senderId === "me";
              return (
                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 ${
                    isMe
                      ? "bg-[#9d7663]/20 text-[#f0efe6] rounded-br-lg"
                      : "bg-[#2a2a38] text-[#f0efe6] rounded-bl-lg"
                  }`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className="text-[11px] text-[#9e9eab] mt-1.5">{msg.createdAt}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-6 py-4 border-t border-white/[0.08]">
            <div className="flex items-end gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message..."
                className="flex-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-5 py-3 text-sm text-[#f0efe6] placeholder-[#6b6b78] focus:border-[#9d7663]/40 focus:outline-none transition-colors"
              />
              <button
                onClick={handleSend}
                disabled={!newMessage.trim()}
                className="flex items-center justify-center h-11 w-11 rounded-full bg-[#9d7663] text-white hover:bg-[#9d7663]/80 disabled:opacity-30 disabled:cursor-not-allowed transition-colors shrink-0"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-[#1f1f2a]">
          <div className="text-center">
            <ChatBubbleLeftRightIcon className="h-12 w-12 text-[#353544] mx-auto mb-4" />
            <p className="text-sm text-[#6b6b78]">Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
