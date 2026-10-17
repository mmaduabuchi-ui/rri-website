import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{ id: string }>;
};

const kindStyles: Record<string, string> = {
  emergency: "bg-red-100 text-red-800",
  announcement: "bg-yellow-100 text-yellow-800",
  news: "bg-gray-100 text-gray-700",
  article: "bg-blue-100 text-blue-800",
};

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function extractVimeoId(url: string): string | null {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

function ArticleMedia({
  type,
  url,
  caption,
}: {
  type: string;
  url: string | null;
  caption: string | null;
}) {
  if (!url || type === "none") return null;

  let content: React.ReactNode = null;

  if (type === "image") {
    content = (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={url}
        alt={caption ?? "Article media"}
        className="w-full rounded-2xl object-cover"
      />
    );
  } else if (type === "video") {
    const yt = extractYouTubeId(url);
    const vm = extractVimeoId(url);

    if (yt) {
      content = (
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${yt}`}
            title={caption ?? "Video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    } else if (vm) {
      content = (
        <div className="aspect-video w-full overflow-hidden rounded-2xl bg-black">
          <iframe
            src={`https://player.vimeo.com/video/${vm}`}
            title={caption ?? "Video"}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        </div>
      );
    } else {
      content = (
        <video
          controls
          preload="metadata"
          className="aspect-video w-full rounded-2xl bg-black"
        >
          <source src={url} />
          Your browser does not support video playback.
        </video>
      );
    }
  } else if (type === "audio") {
    content = (
      <audio controls preload="metadata" className="w-full">
        <source src={url} />
        Your browser does not support audio playback.
      </audio>
    );
  } else if (type === "link") {
    content = (
      <div className="rounded-2xl border border-gray-200 bg-[#F5F7FA] p-6 text-center">
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#1E824C] px-7 py-3 font-semibold text-white transition hover:bg-[#16663A]"
        >
          Open linked resource →
        </a>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="mt-8">
      {content}
      {caption && (
        <p className="mt-3 text-center text-xs italic text-gray-500">
          {caption}
        </p>
      )}
    </div>
  );
}

export default async function InsightPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("*")
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!article) notFound();

  const kind = String(article.kind ?? "article").toLowerCase();
  const badgeStyle = kindStyles[kind] ?? kindStyles.article;
  const date = article.published_at ?? article.created_at;
  const formattedDate = date
    ? new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(new Date(date))
    : null;

  return (
    <main className="min-h-screen bg-white px-6 py-12 text-[#0B1B3D] sm:py-16">
      <article className="mx-auto max-w-3xl">
        <Link
          href="/insights"
          className="inline-flex items-center text-sm font-semibold text-[#1E824C] transition hover:text-[#0B1B3D]"
        >
          <span aria-hidden="true" className="mr-2">
            ←
          </span>
          Back to Insights
        </Link>

        <header className="mt-8">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${badgeStyle}`}
          >
            {kind === "emergency" && (
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
              </span>
            )}
            {kind}
          </span>
          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
            {article.title}
          </h1>
          {formattedDate && (
            <time
              dateTime={new Date(date).toISOString()}
              className="mt-4 block text-sm text-slate-500"
            >
              {formattedDate}
            </time>
          )}
        </header>

        {article.cover_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.cover_url}
            alt={`Cover image for ${article.title}`}
            className="mt-8 max-h-128 w-full rounded-2xl object-cover"
          />
        )}

        <div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-700">
          {article.body}
        </div>

        <ArticleMedia
          type={article.media_type ?? "none"}
          url={article.media_url ?? null}
          caption={article.media_caption ?? null}
        />
      </article>
    </main>
  );
}