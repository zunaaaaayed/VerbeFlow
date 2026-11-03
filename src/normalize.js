// Shared by curated and reference lookup so accents and apostrophes behave alike.
export const normalize = s => s.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[’']/g,"'").replace(/\s+/g,' ').replace(/\s*'\s*/g,"'");
