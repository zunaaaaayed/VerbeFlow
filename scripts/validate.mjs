import { validateData } from '../src/validate.js';
const errors = validateData();
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log('Validated 50 verbs × 6 tenses × 6 persons and 300 bilingual examples.');
