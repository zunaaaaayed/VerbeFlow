import {choices,view,TENSES,selectionForMatch} from './demo.js';
import {WAITLIST_URL} from './config.js';
import {subject} from '../shared/engine.js';
const $=id=>document.getElementById(id);
let selected='parler';
for(const [id,t] of Object.entries(TENSES)) $('tense').add(new Option(t.label,id));
function render(){
 const v=view(selected,$('tense').value);
 $('demo-title').textContent=selected;
 $('coverage').textContent=v.reference?'Reference entry · five simple tenses · independent review pending':'Learning entry · six tenses';
 $('forms').replaceChildren();
 v.forms.forEach((f,i)=>{const row=document.createElement('div');const p=document.createElement('span');p.textContent=v.reference&&i===0&&/^h/i.test(f.text)?'je / j’':subject(i,f.text);const word=document.createElement('strong');word.append(document.createTextNode(f.stem));const ending=document.createElement('em');ending.textContent=f.ending;word.append(ending);row.append(p,word);$('forms').append(row);});
 $('rule').textContent=v.explanation;
 $('sentence').textContent=v.example?.french??'Examples and meanings are not yet reviewed for this reference entry.';
 $('translation').textContent=v.example?.english??'';
}
$('search').addEventListener('input',()=>{
 const query=$('search').value,matches=choices(query);$('matches').replaceChildren();
 $('search-status').textContent=!query.trim()?'':matches.length?'Choose a matching verb or interpretation below. Up to 30 choices shown.':'No match in this offline collection. Try an infinitive such as parler, or j’avais.';
 for(const m of matches){const b=document.createElement('button');b.type='button';b.textContent=m.tense?`${m.infinitive} · ${TENSES[m.tense].label} · ${m.label}`:m.infinitive;b.addEventListener('click',()=>{const s=selectionForMatch(m,$('tense').value);selected=s.selected;$('tense').value=s.tense;render();$('matches').replaceChildren();$('search').value='';$('search-status').textContent='';$('demo-title').focus();});$('matches').append(b);}
});
$('demo-form').addEventListener('submit',e=>{e.preventDefault();const c=choices($('search').value);if(c.length===1){const s=selectionForMatch(c[0],$('tense').value);selected=s.selected;$('tense').value=s.tense;render();$('matches').replaceChildren();$('search-status').textContent='';$('demo-title').focus();}});
$('tense').addEventListener('change',render);
$('menu').addEventListener('click',()=>{const open=$('menu').getAttribute('aria-expanded')!=='true';$('menu').setAttribute('aria-expanded',String(open));$('navigation').classList.toggle('open',open);});
$('navigation').addEventListener('click',e=>{if(e.target.closest('a')){$('navigation').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('matches').replaceChildren();$('navigation').classList.remove('open');$('menu').setAttribute('aria-expanded','false');}});
$('theme').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme!=='dark';document.documentElement.dataset.theme=dark?'dark':'light';$('theme').setAttribute('aria-pressed',String(dark));});
if(WAITLIST_URL){const u=new URL(WAITLIST_URL);if(u.protocol==='https:'){$('interest-link').href=u.href;$('interest-link').hidden=false;$('interest-state').textContent='Signup happens on an external provider’s website. Review its privacy notice before sharing your email.';}}
render();
