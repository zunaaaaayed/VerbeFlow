import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveTheme,sanitizeTheme} from '../src/colors.js';
import {applyTheme} from '../src/page-theme.js';
test('manual themes override browser preference and Auto follows it',()=>{
 assert.equal(resolveTheme('light',true),'light');assert.equal(resolveTheme('dark',false),'dark');
 assert.equal(resolveTheme('auto',true),'dark');assert.equal(resolveTheme('auto',false),'light');
 for(const value of [null,42,'blue',{},undefined])assert.equal(sanitizeTheme(value),'auto');
});
test('fixed palette theme switches logo contrast',()=>{const root={dataset:{}};applyTheme('dark',root);assert.deepEqual(root.dataset,{theme:'dark',logo:'white'});applyTheme('light',root);assert.equal(root.dataset.logo,'black');});
