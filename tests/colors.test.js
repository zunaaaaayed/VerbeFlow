import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPageScheme, resolveTheme, sanitizeTheme } from '../src/colors.js';
import { applyTheme } from '../src/page-theme.js';
test('page pixels produce only a light/dark classification, never a UI color',()=>{
 assert.equal(detectPageScheme([10,20,30,255,11,21,31,255,250,250,250,255]),'dark');
 assert.equal(detectPageScheme([240,230,220,255,255,255,255,255,0,0,0,255]),'light');
 assert.equal(detectPageScheme([]),null);assert.equal(detectPageScheme([0,0,0,0]),null);
});
test('manual themes override page detection; Auto falls back to browser preference',()=>{
 assert.equal(resolveTheme('light','dark',true),'light');
 assert.equal(resolveTheme('dark','light',false),'dark');
 assert.equal(resolveTheme('auto','dark',false),'dark');
 assert.equal(resolveTheme('auto','light',true),'light');
 assert.equal(resolveTheme('auto',null,true),'dark');
 assert.equal(resolveTheme('auto',null,false),'light');
 for(const value of [null,42,'blue',{},undefined])assert.equal(sanitizeTheme(value),'auto');
});
test('theme application selects a fixed theme and logo without copying page color values',()=>{
 const root={dataset:{}};applyTheme('dark',root);assert.deepEqual(root.dataset,{theme:'dark',logo:'white'});
 applyTheme('light',root);assert.deepEqual(root.dataset,{theme:'light',logo:'black'});
});
