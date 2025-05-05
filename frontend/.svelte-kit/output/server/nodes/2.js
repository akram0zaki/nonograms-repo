

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.d36550e5.js","_app/immutable/chunks/scheduler.3710c472.js","_app/immutable/chunks/index.d77e5ae1.js","_app/immutable/chunks/paths.6b98bd4d.js"];
export const stylesheets = ["_app/immutable/assets/2.06289e8f.css"];
export const fonts = [];
