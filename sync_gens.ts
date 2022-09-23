export const map = <A, B>(fn: (a0: A, i: number) => B) =>
	function* (
		iter: Iterable<A> | Generator<A>,
	) {
		let count = 0;
		for (const item of iter) {
			yield fn(item, count);
			count += 1;
		}
	};

export const enumerate = function* <A>(iter: Iterable<A> | Generator<A>) {
	let counter = 0;
	for (const item of iter) {
		yield [counter, item] as [number, A];
		counter += 1;
	}
};

export const toArray = function <A>(iter: Iterable<A> | Generator<A>) {
	let counter = 0;
	const arr = [];
	for (const item of iter) {
		arr[counter] = item;
		counter++;
	}
	return arr;
};

export const fromIter = function* <A>(iter: Iterable<A>) {
	yield* Array.from(iter);
};

export const take = (amnt: number) =>
	function* <A>(
		iter: Iterable<A> | Generator<A>,
	): Generator<A> {
		let counter = 0;
		for (const item of iter) {
			if (counter >= amnt) break;
			yield item;
			counter += 1;
		}
	};

export const tap = <A>(fn: (a0: A) => void) =>
	function* (
		iter: Iterable<A> | Generator<A>,
	): Generator<A> {
		for (const item of iter) {
			fn(item);
			yield item;
		}
	};

export const flatten = function* <A>(
	iter: Iterable<A[]> | Generator<A[]>,
): Generator<A> {
	for (const item of iter) {
		for (let i = 0; i < item.length; i++) {
			yield item[i];
		}
	}
};

export const merge = <A>(iters: (Iterable<A> | Generator<A>)[]): Generator<A> =>
	(function* () {
		for (const iter of iters) yield* iter;
	})();

export const partition = <T>(fn: (a0: T) => boolean) =>
	function* (iter: Iterable<T> | Generator<T>) {
		let chunk: T[] = [];
		for (const item of iter) {
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
	function* (iter: Iterable<T> | Generator<T>) {
		for (const item of iter) {
			if (fn(item)) {
				yield item;
			}
		}
	};

export const consume = function <T>(iter: Iterable<T> | Generator<T>) {
	for (const _ of iter) {
		//
	}
};

export const fold = <Acc, T>(init: Acc, fn: (acc: Acc, curr: T) => Acc) =>
	function (iter: Iterable<T> | Generator<T>) {
		let initialValue = init;
		for (const item of iter) {
			initialValue = fn(initialValue, item);
		}
		return initialValue;
	};

export function* zip<T1, T2>(
	[i1, i2]: [IterableIterator<T1>, IterableIterator<T2>],
) {
	for (;;) {
		const results = ([i1, i2] as const).map((i) => i.next().value);
		if (results.some((x) => x === undefined)) return;
		yield results;
	}
}
