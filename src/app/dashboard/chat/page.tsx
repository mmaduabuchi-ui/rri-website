// src/app/dashboard/chat/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatRoom, { type ChatMessage } from "@/components/chat/ChatRoom";

export const dynamic = "force-dynamic";

const INITIAL_LIMIT = 50;

type SenderInfo = {
  id: string;
  name: string | null;
  email: string | null;
};

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAdmin = profile?.role === "admin";

  const { data: rawMessages, error: messagesError } = await supabase
    .from("messages")
    .select("id, sender_id, body, created_at")
    .order("created_at", { ascending: false })
    .limit(INITIAL_LIMIT);

  if (messagesError) {
    throw new Error(`Unable to load messages: ${messagesError.message}`);
  }

  const messages = ((rawMessages ?? []) as ChatMessage[]).slice().reverse();

  const senderIds = Array.from(
    new Set(messages.map((m) => m.sender_id)),
  );

  let senders: SenderInfo[] = [];
  if (senderIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, name, email")
      .in("id", senderIds);
    senders = (profiles ?? []) as SenderInfo[];
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3D] sm:text-4xl">
            Member Chat
          </h1>
          <p className="mt-2 text-gray-600">
            A shared space for Realiseans to talk, share, and support each
            other.
          </p>
        </header>

        <ChatRoom
          initialMessages={messages}
          senders={senders}
          currentUserId={user.id}
          isAdmin={isAdmin}
        />
      </div>
    </main>
  );
}