// Pure light/dark classification. No webpage colors become extension UI colors.
export const rgb = color => color.match(/[\da-f]{2}/gi).map(n=>parseInt(n,16));
const channel = n => (n/=255)<=.04045 ? n/12.92 : ((n+.055)/1.055)**2.4;
export function luminance(color) {
  const c=rgb(color).map(channel);
  return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
export function contrast(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function detectPageScheme(pixels) {
  let light=0,dark=0;
  for(let i=0;i<pixels.length;i+=4) {
    if(pixels[i+3]<128) continue;
    const l=.2126*channel(pixels[i])+.7152*channel(pixels[i+1])+.0722*channel(pixels[i+2]);
    if(l>.179) light++;else dark++;
  }
  return light+dark ? (light>=dark?'light':'dark') : null;
}
export function resolveTheme(preference,pageScheme,browserDark=false) {
  if(preference==='light' || preference==='dark') return preference;
  return pageScheme==='light' || pageScheme==='dark' ? pageScheme : browserDark?'dark':'light';
}
export const sanitizeTheme = value => ['auto','light','dark'].includes(value) ? value : 'auto';
