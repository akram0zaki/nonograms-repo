export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.668abe8e.js","app":"_app/immutable/entry/app.d1e12752.js","imports":["_app/immutable/entry/start.668abe8e.js","_app/immutable/chunks/scheduler.3710c472.js","_app/immutable/chunks/singletons.1acb1e79.js","_app/immutable/chunks/paths.6b98bd4d.js","_app/immutable/entry/app.d1e12752.js","_app/immutable/chunks/scheduler.3710c472.js","_app/immutable/chunks/index.d77e5ae1.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
