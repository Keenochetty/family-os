import type { AIChat } from "@/types";

export type AICommand = {
  id: string;
  label: string;
  prompt: string;
};

export type AISaveAction = {
  id: string;
  label: string;
  reviewRequired: boolean;
  target: "calendar" | "records" | "family" | "health" | "moment";
};

export const mockAICommands: AICommand[] = [
  { id: "add-event", label: "Add event", prompt: "Create a reviewable calendar event." },
  { id: "summarize-week", label: "Summarize week", prompt: "Summarize this week from reviewed records." },
  { id: "scan-help", label: "Explain scan", prompt: "Explain a scan result with source and safety wording." },
  { id: "family-plan", label: "Family plan", prompt: "Draft a family care plan without sharing automatically." },
];

export const mockAIChats: AIChat[] = [
  {
    category: "family",
    createdAt: "2026-07-02T08:00:00.000Z",
    id: "chat-family-week",
    messages: [
      { id: "m1", role: "user", content: "Help me plan Liam's health tasks for Saturday.", createdAt: "2026-07-02T08:00:00.000Z" },
      {
        id: "m2",
        role: "assistant",
        content: "I prepared a Saturday plan. Please review the event, person, visibility, and parent approval before saving.",
        createdAt: "2026-07-02T08:00:04.000Z",
        reviewedBeforeSave: false,
      },
    ],
    ownerUserId: "user-keeno",
    privacy: { level: "private" },
    title: "Saturday family plan",
    updatedAt: "2026-07-02T08:00:04.000Z",
  },
  {
    category: "documents",
    createdAt: "2026-07-01T16:20:00.000Z",
    id: "chat-document-review",
    messages: [
      { id: "m1", role: "user", content: "Summarize this doctor note after I upload it.", createdAt: "2026-07-01T16:20:00.000Z" },
      {
        id: "m2",
        role: "assistant",
        content: "I can summarize it after upload. Medical details stay private unless you explicitly share them.",
        createdAt: "2026-07-01T16:20:05.000Z",
      },
    ],
    ownerUserId: "user-keeno",
    privacy: { level: "private" },
    title: "Doctor note summary",
    updatedAt: "2026-07-01T16:20:05.000Z",
  },
];

export const mockAISaveActions: AISaveAction[] = [
  { id: "save-calendar", label: "Save event", reviewRequired: true, target: "calendar" },
  { id: "save-record", label: "Save to records", reviewRequired: true, target: "records" },
  { id: "create-task", label: "Create task", reviewRequired: true, target: "family" },
  { id: "create-moment", label: "Create Moment", reviewRequired: true, target: "moment" },
];
