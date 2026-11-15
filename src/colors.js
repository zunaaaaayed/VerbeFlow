// Pure palette contrast utilities and browser-preference theme resolution.
export const rgb = color => color.match(/[\da-f]{2}/gi).map(n=>parseInt(n,16));
const channel = n => (n/=255)<=.04045 ? n/12.92 : ((n+.055)/1.055)**2.4;
export function luminance(color) {
  const c=rgb(color).map(channel);
  return .2126*c[0]+.7152*c[1]+.0722*c[2];
}
export function contrast(a,b) {const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);}
export function resolveTheme(preference,browserDark=false) {
  return preference==='light' || preference==='dark' ? preference : browserDark?'dark':'light';
}
export const sanitizeTheme = value => ['auto','light','dark'].includes(value) ? value : 'auto';
