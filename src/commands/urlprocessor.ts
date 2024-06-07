import type { Message } from "grammy/types";

export function detectURL(message: Message) {
	const entities = message.entities || message.caption_entities || [];

	const detected_urls: string[] = [];

	for (const entity of entities) {
		const { type, offset, length } = entity;
		if (!["text_link", "url"].includes(type)) {
			continue;
		}
		const text = message.text ?? message.caption;
		const url = text.substring(offset, offset + length);
		detected_urls.push(url);
	}
	return detected_urls;
}

export function processURL(url: string) {
	let result = url;

	if (!url.includes("http")) {
		result = `http://${url}`;
	}

	if (url.includes("ncbi.nlm.nih.gov") && !url.includes("?report=classic")) {
		result += "?report=classic";
	}

	return result;
}
