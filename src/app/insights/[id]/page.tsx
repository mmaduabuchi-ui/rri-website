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
					<img
						src={article.cover_url}
						alt={`Cover image for ${article.title}`}
						className="mt-8 max-h-128 w-full rounded-2xl object-cover"
					/>
				)}

				<div className="mt-8 whitespace-pre-wrap text-base leading-8 text-slate-700">
					{article.body}
				</div>
			</article>
		</main>
	);
}
