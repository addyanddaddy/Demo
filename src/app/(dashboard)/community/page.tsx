"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/input";
import { FileUpload } from "@/components/upload/file-upload";
import {
  HeartIcon,
  ChatBubbleLeftIcon,
  ShareIcon,
  SparklesIcon,
  UserPlusIcon,
  MegaphoneIcon,
  PhotoIcon,
  VideoCameraIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const samplePosts = [
  {
    id: "1",
    author: { name: "Ralph Martinez", avatarUrl: null, role: "Producer" },
    content: "Just wrapped pre-production on Midnight Runner. Looking for a talented Gaffer and Key Grip for our Atlanta shoot starting March 15. If you know anyone, send them my way!",
    postType: "update",
    likesCount: 12,
    commentsCount: 4,
    createdAt: "2 hours ago",
    liked: false,
  },
  {
    id: "2",
    author: { name: "FrameOne", avatarUrl: "/logo.png", role: "Platform" },
    content: "Welcome to the FrameOne community! We're excited to have new members joining every day. Remember to complete your profiles and set your availability so productions can find you.",
    postType: "announcement",
    likesCount: 45,
    commentsCount: 8,
    createdAt: "5 hours ago",
    liked: true,
  },
  {
    id: "w1",
    author: { name: "FrameOne", avatarUrl: "/logo.png", role: "Platform" },
    content: "Please welcome our newest members to the FrameOne community!",
    postType: "welcome",
    likesCount: 23,
    commentsCount: 2,
    createdAt: "Today",
    liked: false,
    newMembers: [
      { name: "Sarah Chen", role: "Director of Photography", city: "Los Angeles" },
      { name: "Marcus Johnson", role: "Gaffer", city: "Atlanta" },
      { name: "Emily Rodriguez", role: "Production Designer", city: "New York" },
      { name: "David Kim", role: "Editor", city: "Los Angeles" },
    ],
  },
  {
    id: "3",
    author: { name: "Shahpoor Ahmadi", avatarUrl: null, role: "Director" },
    content: "Finished color grading on our thriller short. The atmosphere our DP created was incredible — LED walls are changing the game for indie productions. Can't wait to share the final cut with everyone.",
    postType: "update",
    imageUrl: null,
    likesCount: 34,
    commentsCount: 11,
    createdAt: "Yesterday",
    liked: false,
  },
  {
    id: "4",
    author: { name: "Brandon Bible", avatarUrl: null, role: "Line Producer" },
    content: "Pro tip for anyone new to production: Always build 10% contingency into your budget. The best Line Producers I know plan for the unexpected on every single project. What's your best budgeting advice?",
    postType: "update",
    likesCount: 67,
    commentsCount: 23,
    createdAt: "2 days ago",
    liked: true,
  },
];

const postTypeIcons: Record<string, React.ReactNode> = {
  announcement: <MegaphoneIcon className="h-4 w-4 text-[#c4a47a]" />,
  welcome: <UserPlusIcon className="h-4 w-4 text-emerald-400" />,
  job_alert: <SparklesIcon className="h-4 w-4 text-[#9d7663]" />,
};

export default function CommunityPage() {
  const { data: session } = useSession();
  const [newPost, setNewPost] = useState("");
  const [posts, setPosts] = useState(samplePosts);
  const [posting, setPosting] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  const handlePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newPost }),
      });

      if (res.ok) {
        const data = await res.json();
        setPosts([
          {
            id: data.data?.id || Date.now().toString(),
            author: {
              name: session?.user?.name || "You",
              avatarUrl: session?.user?.image || null,
              role: (session?.user as any)?.roleProfiles?.[0]?.roleName || "Member",
            },
            content: newPost,
            postType: "update",
            likesCount: 0,
            commentsCount: 0,
            createdAt: "Just now",
            liked: false,
          },
          ...posts,
        ]);
        setNewPost("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setPosting(false);
    }
  };

  const toggleLike = (postId: string) => {
    setPosts(posts.map((p) => {
      if (p.id === postId) {
        return {
          ...p,
          liked: !p.liked,
          likesCount: p.liked ? p.likesCount - 1 : p.likesCount + 1,
        };
      }
      return p;
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto py-4">
      {/* Page header */}
      <div className="px-1">
        <h1 className="text-3xl font-light tracking-tight text-[#f0efe6]">Community</h1>
        <p className="text-sm text-[#9e9eab] mt-2 leading-relaxed">
          News, updates, and conversations from the FrameOne network.
        </p>
      </div>

      {/* New post composer */}
      <div className="bg-[#1f1f2a] rounded-2xl p-6 border border-white/[0.08]">
        <div className="flex gap-4">
          <Avatar name={session?.user?.name || "User"} src={session?.user?.image} size="md" />
          <div className="flex-1">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Share an update, ask a question, or post about your latest project..."
              className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl text-sm text-[#f0efe6] placeholder-[#6b6b78] resize-none outline-none min-h-[80px] p-4 focus:border-[#9d7663]/40 transition-colors"
              rows={3}
            />

            {showImageUpload && (
              <div className="mt-4">
                <FileUpload
                  type="image"
                  label=""
                  description="Add a photo to your post"
                  onUploadComplete={(url) => console.log("Image:", url)}
                />
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.08]">
              <div className="flex gap-1">
                <button
                  onClick={() => setShowImageUpload(!showImageUpload)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors"
                >
                  <PhotoIcon className="h-4 w-4" />
                  Photo
                </button>
                <button className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs text-[#9e9eab] hover:bg-white/[0.04] hover:text-[#f0efe6] transition-colors">
                  <VideoCameraIcon className="h-4 w-4" />
                  Video
                </button>
              </div>
              <Button size="sm" onClick={handlePost} loading={posting} disabled={!newPost.trim()} className="rounded-full px-6">
                Post
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-5">
        {posts.map((post) => (
          <div key={post.id} className="bg-[#1f1f2a] rounded-2xl p-6 border border-white/[0.08]">
            {/* Post header */}
            <div className="flex items-start gap-3.5">
              <Avatar name={post.author.name} src={post.author.avatarUrl} size="md" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5">
                  <span className="text-sm font-normal text-[#f0efe6]">{post.author.name}</span>
                  <span className="text-[11px] text-[#9d7663] font-light">{post.author.role}</span>
                  {postTypeIcons[post.postType] && (
                    <span>{postTypeIcons[post.postType]}</span>
                  )}
                </div>
                <p className="text-[11px] text-[#9e9eab] mt-0.5">{post.createdAt}</p>
              </div>
            </div>

            {/* Post content */}
            <p className="mt-4 text-sm text-[#f0efe6] leading-relaxed whitespace-pre-wrap">{post.content}</p>

            {/* New members welcome card */}
            {post.postType === "welcome" && (post as any).newMembers && (
              <div className="mt-5 grid grid-cols-2 gap-3">
                {(post as any).newMembers.map((member: any) => (
                  <div key={member.name} className="flex items-center gap-3 rounded-xl bg-white/[0.04] border border-white/[0.08] p-3.5">
                    <Avatar name={member.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-xs font-normal text-[#f0efe6] truncate">{member.name}</p>
                      <p className="text-[11px] text-[#9d7663] truncate">{member.role}</p>
                      <p className="text-[10px] text-[#9e9eab] truncate">{member.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Post actions */}
            <div className="flex items-center gap-8 mt-5 pt-4 border-t border-white/[0.08]">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center gap-2 text-xs text-[#9e9eab] hover:text-[#f0efe6] transition-colors"
              >
                {post.liked ? (
                  <HeartSolidIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
                {post.likesCount}
              </button>
              <button className="flex items-center gap-2 text-xs text-[#9e9eab] hover:text-[#f0efe6] transition-colors">
                <ChatBubbleLeftIcon className="h-4 w-4" />
                {post.commentsCount}
              </button>
              <button className="flex items-center gap-2 text-xs text-[#9e9eab] hover:text-[#f0efe6] transition-colors">
                <ShareIcon className="h-4 w-4" />
                Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
