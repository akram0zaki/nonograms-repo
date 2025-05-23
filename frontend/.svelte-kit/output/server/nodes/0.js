import * as universal from '../entries/pages/_layout.js';

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/+layout.js";
export const imports = ["_app/immutable/nodes/0.d1a85f16.js","_app/immutable/chunks/scheduler.3710c472.js","_app/immutable/chunks/index.d77e5ae1.js"];
export const stylesheets = ["_app/immutable/assets/0.c2bb8d17.css"];
export const fonts = [];
