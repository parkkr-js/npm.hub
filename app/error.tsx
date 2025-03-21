"use client";

export default function ErrorComponent({ reset }: { reset: () => void }) {
	return (
		<div>
			<h2>Something went wrong!</h2>
			<button type="button" onClick={() => reset()}>
				Try again
			</button>
		</div>
	);
}
