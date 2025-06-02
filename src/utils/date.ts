import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/site.config";

export function getFormattedDate(
	date: Date | undefined,
	options?: Intl.DateTimeFormatOptions,
): string {
	if (date === undefined) {
		return "Invalid Date";
	}

	return new Intl.DateTimeFormat(siteConfig.date.locale, {
		...(siteConfig.date.options as Intl.DateTimeFormatOptions),
		...options,
	}).format(date);
}

export function collectionDateSort(
	a: CollectionEntry<"bytes" | "beats" | "books">,
	b: CollectionEntry<"bytes" | "beats" | "books">,
) {
	// Primary sort by date (newest first)
	const dateComparison = b.data.publishDate.getTime() - a.data.publishDate.getTime();
	
	// If dates are equal, sort by weight (higher weight first)
	if (dateComparison === 0) {
		const weightA = a.data.weight ?? 0;
		const weightB = b.data.weight ?? 0;
		return weightB - weightA;
	}
	
	return dateComparison;
}
