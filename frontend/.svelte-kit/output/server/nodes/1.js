

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.25aedeca.js","_app/immutable/chunks/scheduler.3710c472.js","_app/immutable/chunks/index.d77e5ae1.js","_app/immutable/chunks/singletons.1acb1e79.js","_app/immutable/chunks/paths.6b98bd4d.js"];
export const stylesheets = [];
export const fonts = [];
