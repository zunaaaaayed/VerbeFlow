import { VERBS } from '../src/data/verbs.js';
import { TENSES } from '../src/data/tenses.js';
import { validateData, validateVariants } from '../src/validate.js';
const errors = [...validateData(),...validateVariants()];
if (errors.length) { console.error(errors.join('\n')); process.exitCode = 1; }
else console.log(`Validated ${VERBS.length} verbs × ${Object.keys(TENSES).length} tenses and ${VERBS.length * Object.keys(TENSES).length} bilingual examples (impersonal gaps explicit).`);
