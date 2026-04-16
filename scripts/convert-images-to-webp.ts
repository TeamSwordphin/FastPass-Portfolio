import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ENABLE_RESIZE = false;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const IMAGE_DIR = path.join(__dirname, '../public/images');
const OUTPUT_ROOT = path.join(IMAGE_DIR, 'webp');
const CWEBP_PATH = path.join(__dirname, '../tools/cwebp.exe');

const maxWidth = 800;
const maxHeight = 600;

function isImage(file: string): boolean {
	const ext = path.extname(file).toLowerCase();
	return ['.png', '.jpg', '.jpeg'].includes(ext);
}

function getAllImageFiles(dir: string): string[] {
	let results: string[] = [];
	const list = fs.readdirSync(dir);

	for (const file of list) {
		const fullPath = path.join(dir, file);
		const stat = fs.statSync(fullPath);
		if (stat.isDirectory()) {
			results = results.concat(getAllImageFiles(fullPath));
		} else if (isImage(fullPath)) {
			results.push(fullPath);
		}
	}

	return results;
}

function getOutputPath(imagePath: string): string {
	const relativePath = path.relative(IMAGE_DIR, imagePath);
	const parsed = path.parse(relativePath);
	const newPath = path.join(OUTPUT_ROOT, parsed.dir, `${parsed.name}.webp`);
	return newPath;
}

function ensureDirectoryExists(filePath: string) {
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, {
			recursive: true,
		});
	}
}

function convertImage(imagePath: string, outputPath: string): Promise<void> {
	return new Promise((resolve, reject) => {
		ensureDirectoryExists(outputPath);

		console.log(`\nConverting: ${imagePath} -> ${outputPath}`);

		const args = ['-q', '80'];

		if (ENABLE_RESIZE) {
			args.push('-resize', maxWidth.toString(), maxHeight.toString());
		}

		args.push(imagePath, '-o', outputPath);

		const subprocess = spawn(CWEBP_PATH, args);

		subprocess.stdout.on('data', (data) => console.log(`stdout: ${data}`));
		subprocess.stderr.on('data', (data) => console.error(`stderr: ${data}`));

		subprocess.on('error', (err) => {
			console.error(`Failed to start process for ${imagePath}:`, err);
			reject(err);
		});

		subprocess.on('close', (code) => {
			if (code === 0) {
				console.log(`✅ Converted: ${path.relative(process.cwd(), outputPath)}`);
				resolve();
			} else {
				console.error(`❌ Failed: ${imagePath} (exit code ${code})`);
				reject(new Error(`cwebp exited with code ${code}`));
			}
		});
	});
}

async function main() {
	const imageFiles = getAllImageFiles(IMAGE_DIR).filter((f) => !f.includes('/webp/'));

	if (imageFiles.length === 0) {
		console.log('No PNG or JPG images found.');
		return;
	}

	console.log(`Found ${imageFiles.length} image(s). Checking for conversions...\n`);

	for (const file of imageFiles) {
		const outputPath = getOutputPath(file);

		if (fs.existsSync(outputPath)) {
			console.log(`Skipping (already converted): ${path.relative(process.cwd(), outputPath)}`);
			continue;
		}

		try {
			await convertImage(file, outputPath);
		} catch {
			// already logged
		}
	}
}

main().catch((err) => {
	console.error('Unexpected error:', err);
	process.exit(1);
});
