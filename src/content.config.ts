import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

const postSchema = ({ image }: { image: any }) =>
	baseSchema.extend({
		description: z.string(),
		coverImage: z
			.object({
				alt: z.string(),
				src: image(),
			})
			.optional(),
		// Book cover (self-hosted, optimized at build). Used on book review pages.
		cover: image().optional(),
		draft: z.boolean().default(false),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		// Date shown on the post and used for sorting (e.g. when it was originally written).
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		// Optional date the post actually goes live on the site. Defaults to publishDate.
		// Use this to display an earlier date (e.g. a cross-post's original date) while
		// keeping the post hidden until later.
		liveDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		seriesId: z.string().optional(),
		orderInSeries: z.number().optional(),
		weight: z.number().optional(),
		// Overall star rating (0–5, halves allowed). Used on book listing rows.
		rating: z.number().min(0).max(5).optional(),
		// Conference talk / recorded presentation. When set, the post page embeds the
		// video above the body and listings mark the entry as a talk.
		talk: z
			.object({
				// YouTube video ID or any YouTube URL (watch, youtu.be, embed, shorts, live).
				// A `t=` / `start=` parameter (e.g. `t=18812`, `t=5h13m32s`) sets where the
				// embed starts playing, for talks inside a longer livestream.
				youtube: z.string().transform((val, ctx) => {
					const video = parseYouTubeUrl(val);
					if (!video) {
						ctx.addIssue({ code: z.ZodIssueCode.custom, message: `Not a YouTube URL or ID: ${val}` });
						return z.NEVER;
					}
					return video;
				}),
				// Where the talk was given, e.g. "KubeCon EU 2025".
				event: z.string(),
				// Full URL, or a site path for decks under public/ (e.g. "/slides/<post-slug>.pdf").
				slides: z.string().url().or(z.string().startsWith("/")).optional(),
			})
			.optional(),
	});

function parseYouTubeUrl(val: string): { id: string; start?: number } | undefined {
	const trimmed = val.trim();
	if (/^[\w-]{11}$/.test(trimmed)) return { id: trimmed };
	const match = trimmed.match(
		/(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/,
	);
	if (!match?.[1]) return undefined;
	const time = trimmed.match(/[?&](?:t|start)=(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?(?:&|$)/);
	const start = time ? Number(time[1] ?? 0) * 3600 + Number(time[2] ?? 0) * 60 + Number(time[3] ?? 0) : 0;
	return start > 0 ? { id: match[1], start } : { id: match[1] };
}


const bytes = defineCollection({
	loader: glob({ base: "./src/content/bytes", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});

const beats = defineCollection({
	loader: glob({ base: "./src/content/beats", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});

const books = defineCollection({
	loader: glob({ base: "./src/content/books", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});


export const collections = { bytes, beats, books };
