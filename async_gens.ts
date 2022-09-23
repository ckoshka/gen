export const map = <A, B>(fn: (a0: A, i: number) => B) =>
	async function* (iter: AsyncIterable<A> | AsyncGenerator<A>) {
		let count = 0;
		for await (const item of iter) {
			yield fn(item, count);
			count += 1;
		}
	};

export const enumerate = async function* <A>(
	iter: AsyncIterable<A> | AsyncGenerator<A>,
) {
	let counter = 0;
	for await (const item of iter) {
		yield [counter, item] as [number, A];
		counter += 1;
	}
};

export const toArray = async function <A>(
	iter: AsyncIterable<A> | AsyncGenerator<A>,
) {
	let counter = 0;
	const arr = [];
	for await (const item of iter) {
		arr[counter] = item;
		counter++;
	}
	return arr;
};

export const fromIter = async function*<A>(iter: Iterable<A>) {
	yield* Array.from(iter)
}

export const take = (amnt: number) =>
	async function* <A>(
		iter: AsyncIterable<A> | AsyncGenerator<A>,
	): AsyncIterable<A> {
		let counter = 0;
		for await (const item of iter) {
			if (counter >= amnt) break;
			yield item;
			counter += 1;
		}
	};

export const flatten = async function* <A>(
	iter: AsyncIterable<A[]> | AsyncGenerator<A[]>,
) {
	for await (const item of iter) {
		for (let i = 0; i < item.length; i++) {
			yield item[i];
		}
	}
};

export const merge = <A>(
	iters: (AsyncIterable<A> | AsyncGenerator<A>)[],
): AsyncIterable<A> =>
	(async function* () {
		for (const iter of iters) {
			yield* iter;
		}
	})();

export const partition = <T>(fn: (a0: T) => boolean) =>
	async function* (iter: AsyncIterable<T> | AsyncGenerator<T>) {
		let chunk: T[] = [];
		for await (const item of iter) {
			if (fn(item)) {
				yield chunk;
				chunk = [];
			} else {
				chunk.push(item);
			}
		}
		yield chunk;
	};

export const filter = <T>(fn: (a0: T) => boolean) =>
	async function* (iter: AsyncIterable<T> | AsyncGenerator<T>) {
		for await (const item of iter) {
			if (fn(item)) {
				yield item;
			}
		}
	};

export const fold = <Acc, T>(init: Acc, fn: (acc: Acc, curr: T) => Acc) =>
	async function (iter: AsyncIterable<T> | AsyncGenerator<T>) {
		let initialValue = init;
		for await (const item of iter) {
			initialValue = fn(initialValue, item);
		}
		return initialValue;
	};

export async function* zip<T1, T2>(
	[i1, i2]: [AsyncIterableIterator<T1>, AsyncIterableIterator<T2>],
) {
	for (;;) {
		const results = await Promise.all(
			([i1, i2] as const).map((i) => i.next().then((n) => n.value)),
		) as [T1, T2];
		if (results.some((x) => x === undefined)) return;
		yield results;
	}
}

