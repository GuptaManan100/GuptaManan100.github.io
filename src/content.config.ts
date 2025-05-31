import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

function removeDupsAndLowerCase(array: string[]) {
	return [...new Set(array.map((str) => str.toLowerCase()))];
}

const baseSchema = z.object({
	title: z.string().max(60),
});

const postSchema = ({ image }) =>
	baseSchema.extend({
		description: z.string(),
		coverImage: z
			.object({
				alt: z.string(),
				src: image(),
			})
			.optional(),
		draft: z.boolean().default(false),
		ogImage: z.string().optional(),
		tags: z.array(z.string()).default([]).transform(removeDupsAndLowerCase),
		publishDate: z
			.string()
			.or(z.date())
			.transform((val) => new Date(val)),
		updatedDate: z
			.string()
			.optional()
			.transform((str) => (str ? new Date(str) : undefined)),
		seriesId: z.string().optional(),
		orderInSeries: z.number().optional(),
	});

const post = defineCollection({
	loader: glob({ base: "./src/content/post", pattern: "**/*.{md,mdx}" }),
	schema: postSchema,
});

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

const note = defineCollection({
	loader: glob({ base: "./src/content/note", pattern: "**/*.{md,mdx}" }),
	schema: baseSchema.extend({
		description: z.string().optional(),
		publishDate: z
			.string()
			.datetime({ offset: true }) // Ensures ISO 8601 format with offsets allowed (e.g. "2024-01-01T00:00:00Z" and "2024-01-01T00:00:00+02:00")
			.transform((val) => new Date(val)),
	}),
});

// Series
const series = defineCollection({
	loader: glob({ base: "./src/content/series", pattern: "**/*.{md,mdx}" }),
	schema: z.object({
		id: z.string(),
		title: z.string(),
		description: z.string(),
		featured: z.boolean().default(false), // Пометка для популярных серий
	}),
});
// End

// Series
export const collections = { post, bytes, beats, books, note, series };
