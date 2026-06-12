import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import ffmpegPath from 'ffmpeg-static';
import { spawnSync } from 'node:child_process';

const mediaDir = path.resolve('public/imagenes');

const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp', '.tif', '.tiff']);
const videoExtensions = new Set(['.mp4', '.mov', '.avi', '.mkv', '.m4v', '.webm']);

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unitIndex = 0;

  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex += 1;
  }

  return `${value.toFixed(2)} ${units[unitIndex]}`;
}

function formatReduction(original, optimized) {
  if (!original) return 'n/a';
  const reduction = ((original - optimized) / original) * 100;
  return `${reduction.toFixed(1)}%`;
}

async function optimizeImage(fileName) {
  const inputPath = path.join(mediaDir, fileName);
  const outputPath = path.join(mediaDir, `${path.parse(fileName).name}.avif`);
  const image = sharp(inputPath).rotate();
  const metadata = await image.metadata();
  const attempts = [
    {
      label: 'original',
      pipeline: image.clone(),
      options: {
        quality: 50,
        effort: 5,
        chromaSubsampling: '4:4:4',
      },
    },
    {
      label: 'ajustada',
      pipeline: image.clone().resize({
        width: Math.min(metadata.width ?? 2200, 2200),
        withoutEnlargement: true,
      }),
      options: {
        quality: 45,
        effort: 4,
        chromaSubsampling: '4:2:0',
      },
    },
  ];

  let lastError;

  for (const attempt of attempts) {
    try {
      await attempt.pipeline.avif(attempt.options).toFile(outputPath);
      const [before, after] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
      const suffix = attempt.label === 'original' ? '' : ` | modo ${attempt.label}`;
      console.log(
        `IMG ${fileName} -> ${path.basename(outputPath)} | ${formatBytes(before.size)} -> ${formatBytes(after.size)} | ahorro ${formatReduction(before.size, after.size)}${suffix}`,
      );
      return;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function optimizeVideo(fileName) {
  const inputPath = path.join(mediaDir, fileName);
  const outputPath = path.join(mediaDir, `${path.parse(fileName).name}.webm`);
  const profiles = [
    { label: 'hd', width: 1280, height: 720, crf: 40, audioBitrate: '64k' },
    { label: 'mid', width: 960, height: 540, crf: 42, audioBitrate: '48k' },
    { label: 'sd', width: 720, height: 404, crf: 45, audioBitrate: '48k' },
  ];
  const generatedFiles = [];
  let bestResult;

  for (const profile of profiles) {
    const tempOutputPath = path.join(mediaDir, `${path.parse(fileName).name}.${profile.label}.webm`);
    const args = [
      '-y',
      '-i',
      inputPath,
      '-map',
      '0:v:0',
      '-map',
      '0:a?',
      '-vf',
      `scale=${profile.width}:${profile.height}:force_original_aspect_ratio=decrease`,
      '-c:v',
      'libvpx-vp9',
      '-pix_fmt',
      'yuv420p',
      '-crf',
      String(profile.crf),
      '-b:v',
      '0',
      '-deadline',
      'good',
      '-cpu-used',
      '4',
      '-row-mt',
      '1',
      '-tile-columns',
      '2',
      '-frame-parallel',
      '1',
      '-c:a',
      'libopus',
      '-b:a',
      profile.audioBitrate,
      tempOutputPath,
    ];

    const result = spawnSync(ffmpegPath, args, {
      stdio: 'inherit',
    });

    if (result.status !== 0) {
      throw new Error(`La conversion de video fallo para ${fileName} con perfil ${profile.label}`);
    }

    const stats = await fs.stat(tempOutputPath);
    generatedFiles.push(tempOutputPath);

    if (!bestResult || stats.size < bestResult.size) {
      bestResult = {
        path: tempOutputPath,
        size: stats.size,
        profile: profile.label,
      };
    }
  }

  await fs.rm(outputPath, { force: true });
  await fs.rename(bestResult.path, outputPath);

  for (const generatedFile of generatedFiles) {
    if (generatedFile !== bestResult.path) {
      await fs.rm(generatedFile, { force: true });
    }
  }

  const [before, after] = await Promise.all([fs.stat(inputPath), fs.stat(outputPath)]);
  console.log(
    `VID ${fileName} -> ${path.basename(outputPath)} | ${formatBytes(before.size)} -> ${formatBytes(after.size)} | ahorro ${formatReduction(before.size, after.size)} | perfil ${bestResult.profile}`,
  );
}

async function main() {
  const entries = await fs.readdir(mediaDir);
  const images = entries.filter((file) => imageExtensions.has(path.extname(file).toLowerCase()));
  const videos = entries.filter((file) => {
    const extension = path.extname(file).toLowerCase();
    return videoExtensions.has(extension) && extension !== '.webm';
  });

  console.log(`Procesando ${images.length} imagenes y ${videos.length} videos en ${mediaDir}`);

  for (const image of images) {
    await optimizeImage(image);
  }

  for (const video of videos) {
    await optimizeVideo(video);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
