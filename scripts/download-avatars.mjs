import fs from 'fs';
import path from 'path';

const PERSONAS_TO_FETCH = [
  { id: 'einstein', title: 'Albert_Einstein' },
  { id: 'hawking', title: 'Stephen_Hawking' },
  { id: 'buddha', title: 'The_Buddha' },
  { id: 'mahavira', title: 'Mahavira' },
  { id: 'tesla', title: 'Nikola_Tesla' },
  { id: 'edison', title: 'Thomas_Edison' },
  { id: 'linus', title: 'Linus_Torvalds' },
  { id: 'billgates', title: 'Bill_Gates' },
  { id: 'stevejobs', title: 'Steve_Jobs' },
  { id: 'socrates', title: 'Socrates' },
  { id: 'machiavelli', title: 'Niccolò_Machiavelli' },
  { id: 'chaplin', title: 'Charlie_Chaplin' },
  { id: 'hitler', title: 'Adolf_Hitler' },
];

const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

async function downloadAvatar(id, wikiTitle) {
  try {
    const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`;
    const res = await fetch(summaryUrl, {
      headers: {
        'User-Agent': 'CheckoArena/1.0 (https://checko.app; contact@checko.app)',
      },
    });

    if (!res.ok) {
      console.error(`Failed to fetch summary for ${id}: ${res.status}`);
      return;
    }

    const data = await res.json();
    const imageUrl = data.thumbnail?.source || data.originalimage?.source;

    if (!imageUrl) {
      console.warn(`No image found for ${id}`);
      return;
    }

    console.log(`Downloading ${id} from ${imageUrl}...`);
    const imgRes = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'CheckoArena/1.0 (https://checko.app; contact@checko.app)',
      },
    });

    if (!imgRes.ok) {
      console.error(`Failed image download for ${id}: ${imgRes.status}`);
      return;
    }

    const buffer = Buffer.from(await imgRes.arrayBuffer());
    const filePath = path.join(avatarsDir, `${id}.jpg`);
    fs.writeFileSync(filePath, buffer);
    console.log(`Saved ${id}.jpg (${buffer.length} bytes)`);
  } catch (err) {
    console.error(`Error downloading ${id}:`, err);
  }
}

async function main() {
  console.log('Downloading Wikipedia profile pictures to public/avatars/ ...');
  for (const item of PERSONAS_TO_FETCH) {
    await downloadAvatar(item.id, item.title);
  }
  console.log('Finished downloading all avatars!');
}

main();
