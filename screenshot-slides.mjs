import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

const SCREENSHOT_DIR = 'slide-screenshots';
mkdirSync(SCREENSHOT_DIR, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

await page.goto('http://localhost:8000', { waitUntil: 'networkidle' });
await page.waitForTimeout(1500);

// Get total slide count
const totalSlides = await page.evaluate(() => Reveal.getTotalSlides());
console.log(`Total slides: ${totalSlides}`);

// Navigate to first slide
await page.evaluate(() => Reveal.slide(0, 0, 0));
await page.waitForTimeout(500);

let slideIndex = 0;
while (true) {
	// Advance through all fragments on this slide first
	const hasFragments = await page.evaluate(() => {
		const fragments = Reveal.getCurrentSlide().querySelectorAll('.fragment:not(.visible)');
		return fragments.length > 0;
	});

	if (hasFragments) {
		// Show all fragments before screenshotting
		await page.evaluate(() => {
			const fragments = Reveal.getCurrentSlide().querySelectorAll('.fragment');
			fragments.forEach(f => f.classList.add('visible'));
		});
		await page.waitForTimeout(300);
	}

	const indices = await page.evaluate(() => Reveal.getIndices());
	const filename = `${SCREENSHOT_DIR}/slide-${String(slideIndex).padStart(2, '0')}-h${indices.h}-v${indices.v}.png`;
	await page.screenshot({ path: filename });
	console.log(`Captured: ${filename}`);

	// Check if we're on the last slide
	const isEnd = await page.evaluate(() => Reveal.isLastSlide());
	if (isEnd) break;

	await page.evaluate(() => Reveal.next());
	await page.waitForTimeout(500);
	slideIndex++;
}

await browser.close();
console.log('Done!');
