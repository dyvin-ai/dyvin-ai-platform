import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  GraduationCap,
  Award,
  BookOpen,
  MessageSquare,
  Calendar,
  ThumbsUp,
  ExternalLink,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import type {
  AcademyCourseItem,
  ProfessionalCertificateItem,
  CommunityForumPostItem,
  PlatformEventItem,
} from "@/types";

interface AcademyCertificationConsoleProps {
  courses?: AcademyCourseItem[] | null;
  certifications?: ProfessionalCertificateItem[] | null;
  communityPosts?: CommunityForumPostItem[] | null;
  events?: PlatformEventItem[] | null;
  isLoading?: boolean;
}

export function AcademyCertificationConsole({
  courses,
  certifications,
  communityPosts,
  events,
  isLoading,
}: AcademyCertificationConsoleProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border border-border/60 bg-surface-elevated/40">
            <CardContent className="p-5 space-y-3">
              <Skeleton className="h-6 w-36" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-8 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const courseList = courses || [
    { courseKey: "geo-101", title: "Generative Engine Optimization (GEO) Foundations", level: "BEGINNER" },
    { courseKey: "ai-agents-201", title: "Building Autonomous AI Agents with Dyvin SDK", level: "INTERMEDIATE" },
  ];

  const certList = certifications || [
    { name: "Certified Dyvin AI GEO Specialist (CDGS)", examStatus: "AVAILABLE" },
    { name: "Certified Dyvin AI Platform Architect (CDPA)", examStatus: "AVAILABLE" },
  ];

  const postList = communityPosts || [
    { id: "post-1", title: "Best practices for multi-agent workflows", upvotes: 142 },
    { id: "post-2", title: "How we improved GEO visibility by 340%", upvotes: 289 },
  ];

  const eventList = events || [
    { id: "evt-1", title: "Dyvin AI v1.0 GA Keynote & Live Demo", eventType: "WEBINAR", scheduledAt: new Date(Date.now() + 7 * 86400000).toISOString() },
  ];

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Academy Courses & Professional Certifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Academy Courses */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Dyvin Learning Academy
                </CardTitle>
                <CardDescription className="text-xs">
                  Self-paced interactive curricula on Generative Engine Optimization, vector schemas, and AI agent architectures.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {courseList.map((course) => (
              <div
                key={course.courseKey}
                className="p-3.5 rounded-xl border border-border/60 bg-surface-elevated/50 flex flex-col justify-between gap-3 hover:bg-surface-elevated transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-primary/10 text-primary border border-primary/20 text-[10px] px-1.5 py-0 font-semibold">
                      {course.level}
                    </Badge>
                    <span className="font-mono text-[10px] text-muted-foreground uppercase">{course.courseKey}</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mt-1.5 leading-snug">
                    {course.title}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">4 Modules • 8 Labs</span>
                  <Button size="sm" variant="outline" className="h-7 text-xs border-border/60 gap-1 hover:text-primary">
                    <span>Start Course</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Professional Certifications */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Professional Industry Certifications
                </CardTitle>
                <CardDescription className="text-xs">
                  Official credentials validating deep technical mastery of enterprise Generative Engine Optimization.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {certList.map((cert, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-border/60 bg-surface-elevated/50 flex flex-col justify-between gap-3 hover:bg-surface-elevated transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] px-1.5 py-0 font-semibold">
                      {cert.examStatus}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">Proctored Exam</span>
                  </div>
                  <h4 className="font-semibold text-foreground text-sm mt-1.5 leading-snug">
                    {cert.name}
                  </h4>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-muted-foreground">Valid 2 Years • Verified Badge</span>
                  <Button size="sm" className="h-7 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold gap-1">
                    <span>Take Exam</span>
                    <ArrowRight className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 2-Column Grid: Community Forum & Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Community Forum Discussions */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-cyan-400" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Community Forum & Discussions
                </CardTitle>
                <CardDescription className="text-xs">
                  Connect with partner engineers, share citation prompts, and benchmark multi-agent workflows.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {postList.map((post) => (
              <div
                key={post.id}
                className="p-3 rounded-xl border border-border/60 bg-surface-elevated/50 flex items-center justify-between gap-3 hover:bg-surface-elevated transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <h5 className="font-medium text-foreground text-xs truncate">
                    {post.title}
                  </h5>
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ThumbsUp className="w-3 h-3" />
                      {post.upvotes} upvotes
                    </span>
                    <span>•</span>
                    <span>General Discussion</span>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="h-7 text-xs shrink-0 gap-1 hover:text-primary">
                  <ExternalLink className="w-3 h-3" />
                  Read
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Platform Webinars & Events */}
        <Card className="border border-border/60 bg-surface-elevated/40">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-400" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Virtual Workshops & Webinars
                </CardTitle>
                <CardDescription className="text-xs">
                  Live architectural sessions hosted by Dyvin AI engineering leadership and partner specialists.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-2.5">
            {eventList.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl border border-border/60 bg-surface-elevated/50 flex items-center justify-between gap-3 hover:bg-surface-elevated transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-1.5">
                    <Badge className="bg-purple-500/10 text-purple-400 border border-purple-500/20 text-[10px] px-1.5 py-0 font-semibold">
                      {evt.eventType}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(evt.scheduledAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h5 className="font-medium text-foreground text-xs mt-1 truncate">
                    {evt.title}
                  </h5>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs shrink-0 border-border/60 gap-1 hover:text-primary">
                  <span>Register</span>
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
