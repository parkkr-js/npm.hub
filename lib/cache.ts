import type { CacheItem, CacheOptions } from "@/types/common";

export class CacheManager<T> {
	private cache: Map<string, CacheItem<T>>;
	private maxSize: number;
	private expiryTime: number;

	constructor(options: CacheOptions = {}) {
		this.cache = new Map();
		this.maxSize = options.maxSize || 20;
		this.expiryTime = options.expiryTime || 1000 * 60 * 5;
	}

	set(key: string, data: T): void {
		this.cleanCache();

		this.cache.set(key, {
			data,
			timestamp: Date.now(),
		});

		if (this.cache.size > this.maxSize) {
			const oldestKey = Array.from(this.cache.keys())[0];
			this.cache.delete(oldestKey);
		}
	}

	get(key: string): T | null {
		this.cleanCache();

		const item = this.cache.get(key);
		if (!item) return null;

		if (Date.now() - item.timestamp > this.expiryTime) {
			this.cache.delete(key);
			return null;
		}

		return item.data;
	}

	has(key: string): boolean {
		this.cleanCache();
		return this.cache.has(key);
	}

	private cleanCache(): void {
		const now = Date.now();
		this.cache.forEach((value, key) => {
			if (now - value.timestamp > this.expiryTime) {
				this.cache.delete(key);
			}
		});
	}

	clear(): void {
		this.cache.clear();
	}

	size(): number {
		return this.cache.size;
	}
}
