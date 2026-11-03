import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
// Check a user-visible accessibility property across both palettes, not a snapshot.
const luminance = hex => {
 const channels=hex.match(/[a-f0-9]{2}/gi).map(c=>parseInt(c,16)/255).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4);
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
};
const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
test('light and dark text palettes meet normal-text contrast on their surfaces', () => {
 const css=readFileSync(new URL('../src/styles.css',import.meta.url),'utf8');
 const [light,dark]=[...css.matchAll(/:root(?:\[data-theme="dark"\])?\s*\{([^}]+)\}/g)].map(m=>Object.fromEntries([...m[1].matchAll(/--([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map(m=>[m[1],m[2]])));
 for(const [name,palette] of [['light',light],['dark',dark]]) {
  // Orange endings are bold 22 px large text, for which 3:1 applies.
  for(const background of ['bg','soft']) assert.ok(contrast(light.orange,palette[background])>=3,`${name}: orange endings on ${background}`);
  for(const foreground of ['ink','muted','accent']) for(const background of ['bg','surface','soft','accent-soft']) {
   const ratio=contrast(palette[foreground],palette[background]);assert.ok(ratio>=4.5,`${name}: ${foreground} on ${background}: ${ratio}`);
  }
 }
});
