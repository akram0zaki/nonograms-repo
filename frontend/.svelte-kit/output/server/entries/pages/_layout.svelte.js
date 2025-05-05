import { c as create_ssr_component } from "../../chunks/ssr.js";
const _layout_svelte_svelte_type_style_lang = "";
const css = {
  code: "body{margin:0;padding:0;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,\r\n            Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;background-color:#f5f5f5;color:#333}*{box-sizing:border-box}button{cursor:pointer}h1, h2, h3, h4, h5, h6{margin-top:0}",
  map: null
};
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `${slots.default ? slots.default({}) : ``}`;
});
export {
  Layout as default
};
