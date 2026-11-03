import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';

// Read only two known members from the pinned tarball. No package installation,
// lifecycle scripts, filesystem extraction, or executable upstream code.
export function readArchive(archive, integrity) {
  const actual = 'sha512-'+createHash('sha512').update(archive).digest('base64');
  if (actual !== integrity) throw new Error('Lefff archive integrity mismatch');
  const tar = gunzipSync(archive, {maxOutputLength:16*1024*1024});
  const members = new Map();
  for (let offset = 0; offset+512 <= tar.length;) {
    const header = tar.subarray(offset,offset+512);
    if (header.every(byte => byte === 0)) break;
    const name = header.subarray(0,100).toString().replace(/\0.*$/s,'');
    const size = parseInt(header.subarray(124,136).toString().replace(/\0.*$/s,'').trim(),8);
    if (!Number.isSafeInteger(size) || size < 0 || offset+512+size > tar.length) throw new Error('Invalid tar member size');
    if (['package/dist/conjugations.json','package/dist/LICENSE'].includes(name)) {
      if (members.has(name) || ![0,48].includes(header[156])) throw new Error('Duplicate or non-file source member');
      members.set(name,tar.subarray(offset+512,offset+512+size).toString('utf8'));
    }
    offset += 512+Math.ceil(size/512)*512;
  }
  if (members.size !== 2) throw new Error('Missing source data or license');
  return {data:JSON.parse(members.get('package/dist/conjugations.json')),license:members.get('package/dist/LICENSE')};
}
