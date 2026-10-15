// src/components/chat/ChatRoom.tsx
"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";

export type ChatMessage = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type SenderInfo = {
  id: string;
  name: string | null;
  email: string | null;
};

type Props = {
  initialMessages: ChatMessage[];
  senders: SenderInfo[];
  currentUserId: string;
  isAdmin: boolean;
};

const MAX_LENGTH = 2000;

function timeLabel(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

function dayLabel(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(new Date(iso));
  } catch {
    return "";
  }
}

export default function ChatRoom({
  initialMessages,
  senders,
  currentUserId,
  isAdmin,
}: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [editBusy, setEditBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const senderMap = useMemo(() => {
    const map = new Map<string, SenderInfo>();
    senders.forEach((s) => map.set(s.id, s));
    return map;
  }, [senders]);

  function displayName(id: string): string {
    if (id === currentUserId) return "You";
    const s = senderMap.get(id);
    return s?.name ?? s?.email ?? "Member";
  }

  // Scroll to bottom on new messages (pause while editing)
  useEffect(() => {
    if (editingId) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, editingId]);

  // Realtime subscription: INSERT, UPDATE, DELETE
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("messages-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          const newMsg = payload.new as ChatMessage;
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "messages" },
        (payload) => {
          const updated = payload.new as ChatMessage;
          setMessages((prev) =>
            prev.map((m) => (m.id === updated.id ? updated : m)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "messages" },
        (payload) => {
          const oldMsg = payload.old as { id?: string };
          if (!oldMsg.id) return;
          setMessages((prev) => prev.filter((m) => m.id !== oldMsg.id));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const body = input.trim();
    if (!body) return;

    setError("");
    setSending(true);

    const tempId = `temp-${Date.now()}`;
    const optimistic: ChatMessage = {
      id: tempId,
      sender_id: currentUserId,
      body,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, optimistic]);
    setInput("");

    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Unable to send message.");
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setInput(body);
        return;
      }

      if (data?.message) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.message : m)),
        );
      }
    } catch {
      setError("Unable to send message.");
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
      setInput(body);
    } finally {
      setSending(false);
    }
  }

  function startEdit(m: ChatMessage) {
    setEditingId(m.id);
    setEditDraft(m.body);
    setError("");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft("");
  }

  async function saveEdit(id: string) {
    const trimmed = editDraft.trim();
    if (!trimmed) return;

    setEditBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/chat/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: trimmed }),
      });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        setError(data?.error ?? "Unable to edit message.");
        return;
      }

      if (data?.message) {
        const updated = data.message as ChatMessage;
        setMessages((prev) => prev.map((m) => (m.id === id ? updated : m)));
      }
      cancelEdit();
    } catch {
      setError("Unable to edit message.");
    } finally {
      setEditBusy(false);
    }
  }

  async function deleteMessage(id: string) {
    if (!window.confirm("Delete this message permanently?")) return;
    setError("");
    try {
      const res = await fetch(`/api/chat/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.error ?? "Unable to delete message.");
        return;
      }
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch {
      setError("Unable to delete message.");
    }
  }

  let lastDay = "";

  return (
    <div className="flex h-[70vh] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6">
        {messages.length === 0 ? (
          <p className="mt-12 text-center text-sm text-gray-500">
            No messages yet. Be the first to say hello.
          </p>
        ) : (
          messages.map((m) => {
            const isMine = m.sender_id === currentUserId;
            const canDelete = isMine || isAdmin;
            const day = dayLabel(m.created_at);
            const showDay = day !== lastDay;
            lastDay = day;
            const isEditing = editingId === m.id;

            return (
              <div key={m.id}>
                {showDay && (
                  <div className="my-4 text-center">
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                      {day}
                    </span>
                  </div>
                )}

                <div
                  className={`mb-3 flex ${
                    isMine ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`group max-w-[80%] rounded-2xl px-4 py-2.5 ${
                      isMine
                        ? "bg-[#1E824C] text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {!isMine && (
                      <p className="text-xs font-semibold text-[#1E824C]">
                        {displayName(m.sender_id)}
                      </p>
                    )}

                    {isEditing ? (
                      <div className="mt-1 w-full">
                        <textarea
                          value={editDraft}
                          onChange={(e) => setEditDraft(e.target.value)}
                          rows={2}
                          maxLength={MAX_LENGTH}
                          className="w-full resize-none rounded-lg border border-white/40 bg-white px-2 py-1.5 text-sm text-gray-900 outline-none focus:border-[#F7B500] focus:ring-2 focus:ring-[#F7B500]"
                        />
                        <div className="mt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            disabled={editBusy}
                            className={`text-[11px] font-semibold ${
                              isMine
                                ? "text-white/80 hover:text-white"
                                : "text-gray-600 hover:text-gray-900"
                            } disabled:opacity-60`}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => saveEdit(m.id)}
                            disabled={
                              editBusy ||
                              !editDraft.trim() ||
                              editDraft === m.body
                            }
                            className="rounded-md bg-[#F7B500] px-3 py-1 text-[11px] font-bold text-[#0B1B3D] hover:bg-[#dca200] disabled:opacity-60"
                          >
                            {editBusy ? "Saving…" : "Save"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-1 text-sm leading-6 whitespace-pre-wrap wrap-break-word">
                          {m.body}
                        </p>
                        <div className="mt-1 flex items-center justify-between gap-3">
                          <span
                            className={`text-[10px] ${
                              isMine ? "text-white/70" : "text-gray-500"
                            }`}
                          >
                            {timeLabel(m.created_at)}
                          </span>

                          {!m.id.startsWith("temp-") && (
                            <div className="flex items-center gap-2 opacity-0 transition group-hover:opacity-100">
                              {isMine && (
                                <button
                                  type="button"
                                  onClick={() => startEdit(m)}
                                  className={`text-[10px] font-semibold ${
                                    isMine
                                      ? "text-white/80 hover:text-white"
                                      : "text-gray-600 hover:text-gray-900"
                                  }`}
                                >
                                  Edit
                                </button>
                              )}
                              {canDelete && (
                                <button
                                  type="button"
                                  onClick={() => deleteMessage(m.id)}
                                  className={`text-[10px] font-semibold ${
                                    isMine
                                      ? "text-white/80 hover:text-white"
                                      : "text-red-600 hover:text-red-800"
                                  }`}
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 bg-gray-50 px-4 py-3 sm:px-6"
      >
        {error && (
          <p
            role="alert"
            className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
          >
            {error}
          </p>
        )}
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                (
                  e.currentTarget.form as HTMLFormElement | null
                )?.requestSubmit();
              }
            }}
            rows={1}
            maxLength={MAX_LENGTH}
            placeholder="Type a message… (Enter to send, Shift+Enter for a new line)"
            disabled={sending}
            className="flex-1 resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-[#0B1B3D] focus:ring-2 focus:ring-[#F7B500] disabled:bg-gray-100"
            style={{ maxHeight: "8rem" }}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#F7B500] px-5 text-sm font-bold text-[#0B1B3D] transition hover:bg-[#dca200] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {sending ? "…" : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}