import { readLines, run, Stream } from "../deps.ts";

const intoLines = (
	lines: Promise<ReadableStreamDefaultReader<Uint8Array>>,
): Promise<AsyncIterableIterator<string>> => lines.then(Stream.readerFromStreamReader)
	.then(readLines)

export const openLinesFromFile = (name: string): Promise<AsyncIterableIterator<string>> =>
	intoLines(
		Deno
			.open(name)
			.then((f) => f.readable.getReader()),
	);

export const openLinesFromURL = (url: string): Promise<AsyncIterableIterator<string>> =>
	intoLines(
		fetch(url)
			.then((f) => f.body!.getReader()),
	);

export const openLinesFromStdout = async function* (
	script: string,
	allowFail = true,
) {
	const opts = {
		stdout: "piped" as const,
		stderr: "inherit" as const,
		allowFail,
	};
	const tempfile = await Deno.makeTempFile();
	await Deno.writeTextFile(
		tempfile,
		`#!/bin/bash
${allowFail ? "" : "set -euo pipefail"}
IFS=$'\\n\\t'
${script}`,
	);
	yield* run(`bash ${tempfile}`, opts).toIterable();
	await Deno.remove(tempfile);
};
