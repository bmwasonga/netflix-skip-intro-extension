class NetflixSkipper {
	private static readonly SKIP_BUTTON_SELECTOR =
		'button[data-uia="player-skip-intro"]';
	private static readonly CHECK_INTERVAL_MS = 1000;
	private skipCount: number = 0;
	private observer: MutationObserver;

	constructor() {
		this.observer = new MutationObserver(this.handleDomMutation.bind(this));
		this.initialize();
	}

	private initialize(): void {
		try {
			// Start observing the document body for changes
			this.observer.observe(document.body, {
				childList: true,
				subtree: true,
				attributes: true,
			});

			// Set up interval check
			setInterval(
				this.attemptSkip.bind(this),
				NetflixSkipper.CHECK_INTERVAL_MS
			);

			console.log('[Netflix Skipper] Initialized successfully');
		} catch (error) {
			console.error('[Netflix Skipper] Initialization error:', error);
		}
	}

	private handleDomMutation(mutations: MutationRecord[]): void {
		for (const mutation of mutations) {
			if (mutation.type === 'childList' || mutation.type === 'attributes') {
				this.attemptSkip();
			}
		}
	}

	private attemptSkip(): void {
		try {
			const skipButton = document.querySelector(
				NetflixSkipper.SKIP_BUTTON_SELECTOR
			) as HTMLButtonElement;

			if (
				skipButton &&
				skipButton.style.display !== 'none' &&
				skipButton.offsetParent !== null
			) {
				skipButton.click();
				this.skipCount++;
				console.log(
					`[Netflix Skipper] Successfully skipped intro #${this.skipCount}`
				);
			}
		} catch (error) {
			console.error('[Netflix Skipper] Error while attempting to skip:', error);
		}
	}
}

// Start the skipper when the page loads
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => new NetflixSkipper());
} else {
	new NetflixSkipper();
}
