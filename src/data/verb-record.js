export const regular = (infinitive, meaning, pattern, complement, translation) => ({
  infinitive, meaning, pattern, auxiliary: 'avoir', complement, translation,
});
export const irregular = (infinitive, meaning, present, futureStem, participle, subjunctive, complement, translation, auxiliary = 'avoir') => ({
  infinitive, meaning, pattern: 'irregular', auxiliary, present: present.split('|'),
  futureStem, participle, subjunctive: subjunctive.split('|'), complement, translation,
});
