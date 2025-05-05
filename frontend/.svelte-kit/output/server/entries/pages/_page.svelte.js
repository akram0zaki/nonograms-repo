import { c as create_ssr_component, b as createEventDispatcher, d as each, f as add_attribute, e as escape, n as null_to_empty, v as validate_component } from "../../chunks/ssr.js";
import { d as derived, w as writable } from "../../chunks/index.js";
const currentNonogram = writable(null);
const availableNonograms = writable([]);
const searchResults = writable([]);
const appMode = writable("view");
const isDirty = writable(false);
const newGridRows = writable(5);
const newGridCols = writable(5);
const editorBoardState = writable([]);
const playBoardState = writable([]);
const statusMessage = writable("");
const puzzleSolved = derived(
  [currentNonogram, playBoardState],
  ([$currentNonogram, $playBoardState]) => {
    if (!$currentNonogram || !$playBoardState.length)
      return false;
    const { board } = $currentNonogram;
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[r].length; c++) {
        if (board[r][c] && $playBoardState[r][c] !== "filled" || !board[r][c] && $playBoardState[r][c] === "filled") {
          return false;
        }
      }
    }
    return true;
  }
);
function calculateDescriptors(board) {
  if (!board.length || !board[0].length) {
    return { rows: [], columns: [] };
  }
  const rows = board.length;
  const cols = board[0].length;
  const rowDescriptors = board.map((row) => {
    const descriptors = [];
    let count = 0;
    for (let c = 0; c < row.length; c++) {
      if (row[c]) {
        count++;
      } else if (count > 0) {
        descriptors.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      descriptors.push(count);
    }
    if (descriptors.length === 0) {
      descriptors.push(0);
    }
    return descriptors;
  });
  const colDescriptors = [];
  for (let c = 0; c < cols; c++) {
    const descriptors = [];
    let count = 0;
    for (let r = 0; r < rows; r++) {
      if (board[r][c]) {
        count++;
      } else if (count > 0) {
        descriptors.push(count);
        count = 0;
      }
    }
    if (count > 0) {
      descriptors.push(count);
    }
    if (descriptors.length === 0) {
      descriptors.push(0);
    }
    colDescriptors.push(descriptors);
  }
  return {
    rows: rowDescriptors,
    columns: colDescriptors
  };
}
const NonogramSelector_svelte_svelte_type_style_lang = "";
const css$4 = {
  code: ".selector-container.svelte-1x70pkp.svelte-1x70pkp{padding:10px;background-color:#f8f8f8;border:1px solid #ddd;border-radius:4px}.selector-row.svelte-1x70pkp.svelte-1x70pkp{display:flex;align-items:center;margin-bottom:10px;gap:10px}label.svelte-1x70pkp.svelte-1x70pkp{font-weight:bold;min-width:100px}select.svelte-1x70pkp.svelte-1x70pkp,input.svelte-1x70pkp.svelte-1x70pkp{flex-grow:1;padding:8px;border:1px solid #ccc;border-radius:4px}button.svelte-1x70pkp.svelte-1x70pkp{padding:8px 16px;background-color:#4a90e2;color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold}button.svelte-1x70pkp.svelte-1x70pkp:hover{background-color:#3a80d2}button.svelte-1x70pkp.svelte-1x70pkp:disabled{background-color:#cccccc;cursor:not-allowed}.search-results.svelte-1x70pkp.svelte-1x70pkp{margin-top:10px;margin-bottom:15px;border:1px solid #ddd;border-radius:4px;padding:10px;background-color:white}.search-results.svelte-1x70pkp h4.svelte-1x70pkp{margin-top:0;margin-bottom:8px}.search-results.svelte-1x70pkp ul.svelte-1x70pkp{list-style-type:none;padding:0;margin:0}.search-results.svelte-1x70pkp li.svelte-1x70pkp{padding:5px 10px;cursor:pointer;border-radius:3px}.search-results.svelte-1x70pkp li.svelte-1x70pkp:hover{background-color:#f0f0f0}.search-results.svelte-1x70pkp li.selected.svelte-1x70pkp{background-color:#e2f0ff;font-weight:bold}",
  map: null
};
const NonogramSelector = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  createEventDispatcher();
  let selectedNonogram = "";
  let searchQuery = "";
  let availableNonogramsValue = [];
  let searchResultsValue = [];
  availableNonograms.subscribe((value) => availableNonogramsValue = value);
  searchResults.subscribe((value) => searchResultsValue = value);
  $$result.css.add(css$4);
  return `<div class="selector-container svelte-1x70pkp"><div class="selector-row svelte-1x70pkp"><label for="nonogram-select" class="svelte-1x70pkp" data-svelte-h="svelte-dn6dk6">Load:</label> <select id="nonogram-select" ${availableNonogramsValue.length === 0 ? "disabled" : ""} class="svelte-1x70pkp">${availableNonogramsValue.length === 0 ? `<option value="" data-svelte-h="svelte-1ou2syi">No nonograms available</option>` : `${each(availableNonogramsValue, (name) => {
    return `<option${add_attribute("value", name, 0)}>${escape(name)}</option>`;
  })}`}</select> <button ${"disabled"} class="svelte-1x70pkp">Load Selected</button></div> <div class="selector-row svelte-1x70pkp"><label for="search-input" class="svelte-1x70pkp" data-svelte-h="svelte-1flsu2w">Search by Clues:</label> <input id="search-input" type="text" placeholder="Enter clue (e.g., '1,2,3' or '1 2 3')" ${""} class="svelte-1x70pkp"${add_attribute("value", searchQuery, 0)}></div> ${searchResultsValue.length > 0 ? `<div class="search-results svelte-1x70pkp"><h4 id="search-results-heading" class="svelte-1x70pkp" data-svelte-h="svelte-1jg0gl6">Search Results:</h4> <ul role="listbox" aria-labelledby="search-results-heading" class="svelte-1x70pkp">${each(searchResultsValue, (name) => {
    return `<li role="option"${add_attribute("aria-selected", selectedNonogram === name, 0)} tabindex="0" class="${["svelte-1x70pkp", selectedNonogram === name ? "selected" : ""].join(" ").trim()}">${escape(name)} </li>`;
  })}</ul></div>` : ``} <div class="selector-row svelte-1x70pkp"><button class="svelte-1x70pkp" data-svelte-h="svelte-y5fk5w">New Puzzle</button></div> </div>`;
});
const NonogramGrid_svelte_svelte_type_style_lang = "";
const css$3 = {
  code: ".grid-container.svelte-2gupkd.svelte-2gupkd{overflow:auto;margin:0;padding:0}.grid.svelte-2gupkd.svelte-2gupkd{display:grid;gap:1px;background-color:#ccc;border:1px solid #888}.cell.svelte-2gupkd.svelte-2gupkd,button.svelte-2gupkd.svelte-2gupkd{width:25px;height:25px;background-color:white;border:1px solid #ddd;box-sizing:border-box;cursor:pointer;display:flex;align-items:center;justify-content:center;user-select:none;padding:0;margin:0;font-size:1rem}button.svelte-2gupkd.svelte-2gupkd:focus{outline:2px solid #4a90e2;z-index:1}.cell.svelte-2gupkd.svelte-2gupkd:hover,button.svelte-2gupkd.svelte-2gupkd:hover{background-color:#f0f0f0}.cell.filled.svelte-2gupkd.svelte-2gupkd{background-color:#333}.cell.filled.svelte-2gupkd.svelte-2gupkd:hover{background-color:#555}.cell.marked.svelte-2gupkd.svelte-2gupkd{background-color:white}.cell.marked.svelte-2gupkd span.svelte-2gupkd{font-size:18px;font-weight:bold;color:#e74c3c}.border-bottom.svelte-2gupkd.svelte-2gupkd{border-bottom:2px solid #888}.border-right.svelte-2gupkd.svelte-2gupkd{border-right:2px solid #888}",
  map: null
};
const NonogramGrid = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let rows;
  let cols;
  let { board = [] } = $$props;
  let { mode = "view" } = $$props;
  createEventDispatcher();
  function getCellClass(cellValue, rowIndex, colIndex) {
    let classes = "cell";
    if ((rowIndex + 1) % 5 === 0 && rowIndex < rows - 1)
      classes += " border-bottom";
    if ((colIndex + 1) % 5 === 0 && colIndex < cols - 1)
      classes += " border-right";
    if (mode === "view") {
      if (cellValue === true || cellValue === "filled")
        classes += " filled";
    } else if (mode === "edit" || mode === "create") {
      if (cellValue === true)
        classes += " filled";
    } else if (mode === "play") {
      if (cellValue === "filled")
        classes += " filled";
      else if (cellValue === "marked")
        classes += " marked";
    }
    return classes;
  }
  if ($$props.board === void 0 && $$bindings.board && board !== void 0)
    $$bindings.board(board);
  if ($$props.mode === void 0 && $$bindings.mode && mode !== void 0)
    $$bindings.mode(mode);
  $$result.css.add(css$3);
  rows = board.length;
  cols = board.length > 0 ? board[0].length : 0;
  return `<div class="grid-container svelte-2gupkd"><div class="grid svelte-2gupkd" style="${"grid-template-columns: repeat(" + escape(cols, true) + ", 25px); grid-template-rows: repeat(" + escape(rows, true) + ", 25px);"}">${each(board, (row, rowIndex) => {
    return `${each(row, (cell, colIndex) => {
      return `<button type="button" class="${escape(null_to_empty(getCellClass(cell, rowIndex, colIndex)), true) + " svelte-2gupkd"}" aria-label="${"Cell row " + escape(rowIndex + 1, true) + ", column " + escape(colIndex + 1, true)}"${add_attribute("aria-pressed", cell === true || cell === "filled", 0)}>${mode === "play" && cell === "marked" ? `<span aria-hidden="true" class="svelte-2gupkd" data-svelte-h="svelte-wjzu5c">×</span>` : ``} </button>`;
    })}`;
  })}</div> </div>`;
});
const NonogramClues_svelte_svelte_type_style_lang = "";
const css$2 = {
  code: '.clues-container.svelte-1v0l4l{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto 1fr;grid-template-areas:"corner column-clues"\r\n            "row-clues grid-placeholder"}.top-left-corner.svelte-1v0l4l{grid-area:corner;background-color:#f0f0f0;border:1px solid #ccc}.column-clues.svelte-1v0l4l{grid-area:column-clues;display:flex;flex-direction:column}.column-clue-row.svelte-1v0l4l{display:flex;flex-direction:row}.row-clues.svelte-1v0l4l{grid-area:row-clues;display:flex;flex-direction:column}.row-clue.svelte-1v0l4l{display:flex;flex-direction:row;justify-content:flex-end}.clue-cell.svelte-1v0l4l{width:25px;height:25px;display:flex;align-items:center;justify-content:center;font-weight:bold;font-size:14px;color:#333}',
  map: null
};
const NonogramClues = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let maxRowClueLength;
  let maxColClueLength;
  let { rowClues = [] } = $$props;
  let { colClues = [] } = $$props;
  if ($$props.rowClues === void 0 && $$bindings.rowClues && rowClues !== void 0)
    $$bindings.rowClues(rowClues);
  if ($$props.colClues === void 0 && $$bindings.colClues && colClues !== void 0)
    $$bindings.colClues(colClues);
  $$result.css.add(css$2);
  maxRowClueLength = Math.max(...rowClues.map((row) => row.length), 0);
  maxColClueLength = Math.max(...colClues.map((col) => col.length), 0);
  return `<div class="clues-container svelte-1v0l4l"> <div class="top-left-corner svelte-1v0l4l"></div>  <div class="column-clues svelte-1v0l4l">${each(Array(maxColClueLength), (_, clueIdx) => {
    return `<div class="column-clue-row svelte-1v0l4l">${each(colClues, (colClue) => {
      return `<div class="clue-cell svelte-1v0l4l">${clueIdx >= maxColClueLength - colClue.length ? `${escape(colClue[clueIdx - (maxColClueLength - colClue.length)])}` : ``} </div>`;
    })} </div>`;
  })}</div>  <div class="row-clues svelte-1v0l4l">${each(rowClues, (rowClue) => {
    return `<div class="row-clue svelte-1v0l4l">${each(Array(maxRowClueLength), (_, clueIdx) => {
      return `<div class="clue-cell svelte-1v0l4l">${clueIdx >= maxRowClueLength - rowClue.length ? `${escape(rowClue[clueIdx - (maxRowClueLength - rowClue.length)])}` : ``} </div>`;
    })} </div>`;
  })}</div> </div>`;
});
const StatusBar_svelte_svelte_type_style_lang = "";
const css$1 = {
  code: ".status-bar.svelte-12xk65x{display:flex;justify-content:space-between;align-items:center;padding:10px;background-color:#f0f0f0;border:1px solid #ddd;border-radius:4px;margin-bottom:10px}.status-message.svelte-12xk65x{flex-grow:1}.success-message.svelte-12xk65x{color:#2ecc71;font-weight:bold;font-size:1.2em;animation:svelte-12xk65x-pulse 1.5s infinite}.info-message.svelte-12xk65x{color:#3498db}.nonogram-name.svelte-12xk65x{font-weight:bold}.mode-selector.svelte-12xk65x{display:flex;align-items:center;gap:10px}.mode-label.svelte-12xk65x{font-weight:bold}.mode-buttons.svelte-12xk65x{display:flex;gap:5px}button.svelte-12xk65x{padding:6px 12px;background-color:#f8f8f8;color:#333;border:1px solid #ccc;border-radius:4px;cursor:pointer;font-weight:normal}button.svelte-12xk65x:hover:not(:disabled){background-color:#e0e0e0}button.active.svelte-12xk65x{background-color:#4a90e2;color:white;border-color:#3a80d2;font-weight:bold}button.svelte-12xk65x:disabled{opacity:0.5;cursor:not-allowed}@keyframes svelte-12xk65x-pulse{0%{opacity:1}50%{opacity:0.7}100%{opacity:1}}",
  map: null
};
const StatusBar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { currentNonogramName = "" } = $$props;
  let appModeValue;
  let statusMessageValue;
  let puzzleSolvedValue;
  appMode.subscribe((value) => appModeValue = value);
  statusMessage.subscribe((value) => statusMessageValue = value);
  puzzleSolved.subscribe((value) => puzzleSolvedValue = value);
  if ($$props.currentNonogramName === void 0 && $$bindings.currentNonogramName && currentNonogramName !== void 0)
    $$bindings.currentNonogramName(currentNonogramName);
  $$result.css.add(css$1);
  return `<div class="status-bar svelte-12xk65x"><div class="status-message svelte-12xk65x">${puzzleSolvedValue ? `<div class="success-message svelte-12xk65x" data-svelte-h="svelte-1muy2iw">🎉 Puzzle Solved! Congratulations! 🎉</div>` : `${statusMessageValue ? `<div class="info-message svelte-12xk65x">${escape(statusMessageValue)}</div>` : `<div class="current-nonogram">${currentNonogramName ? `Current: <span class="nonogram-name svelte-12xk65x">${escape(currentNonogramName)}</span>` : `No nonogram loaded`}</div>`}`}</div> <div class="mode-selector svelte-12xk65x"><div class="mode-label svelte-12xk65x" data-svelte-h="svelte-8qisys">Mode:</div> <div class="mode-buttons svelte-12xk65x"><button ${!currentNonogramName ? "disabled" : ""} class="${["svelte-12xk65x", appModeValue === "play" ? "active" : ""].join(" ").trim()}">Play</button> <button ${!currentNonogramName ? "disabled" : ""} class="${["svelte-12xk65x", appModeValue === "edit" ? "active" : ""].join(" ").trim()}">Edit</button> <button class="${["svelte-12xk65x", appModeValue === "create" ? "active" : ""].join(" ").trim()}" data-svelte-h="svelte-k5o5tv">Create</button></div></div> </div>`;
});
const _page_svelte_svelte_type_style_lang = "";
const css = {
  code: ".app-container.svelte-1d5q74c.svelte-1d5q74c{max-width:1200px;margin:0 auto;padding:20px;font-family:Arial, sans-serif}header.svelte-1d5q74c.svelte-1d5q74c{text-align:center;margin-bottom:20px}h1.svelte-1d5q74c.svelte-1d5q74c{color:#333}main.svelte-1d5q74c.svelte-1d5q74c{background-color:white;border-radius:8px;box-shadow:0 2px 10px rgba(0, 0, 0, 0.1);padding:20px}.controls-bar.svelte-1d5q74c.svelte-1d5q74c{margin-bottom:20px}.nonogram-area.svelte-1d5q74c.svelte-1d5q74c{margin-top:20px}.nonogram-container.svelte-1d5q74c.svelte-1d5q74c{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto 1fr}.grid-area.svelte-1d5q74c.svelte-1d5q74c{grid-column:2;grid-row:2}.create-form.svelte-1d5q74c.svelte-1d5q74c{background-color:#f8f8f8;border:1px solid #ddd;border-radius:4px;padding:20px;margin-bottom:20px}.form-row.svelte-1d5q74c.svelte-1d5q74c{display:flex;align-items:center;margin-bottom:10px}.form-row.svelte-1d5q74c label.svelte-1d5q74c{width:100px;font-weight:bold}.form-row.svelte-1d5q74c input.svelte-1d5q74c{width:80px;padding:8px;border:1px solid #ccc;border-radius:4px}.edit-actions.svelte-1d5q74c.svelte-1d5q74c{margin:15px 0;padding:10px;background-color:#e8f4fd;border-radius:4px;display:flex;justify-content:space-between;align-items:center}.note.svelte-1d5q74c.svelte-1d5q74c{color:#777;font-style:italic;font-size:0.9em;margin:0 10px}.loading.svelte-1d5q74c.svelte-1d5q74c{text-align:center;padding:40px;font-size:1.2em;color:#666}footer.svelte-1d5q74c.svelte-1d5q74c{margin-top:30px;text-align:center;color:#666;font-size:0.9em}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let currentDescriptors;
  let currentNonogramValue;
  let editorBoardStateValue;
  let playBoardStateValue;
  let appModeValue;
  let isDirtyValue;
  let newGridRowsValue;
  let newGridColsValue;
  currentNonogram.subscribe((value) => currentNonogramValue = value);
  editorBoardState.subscribe((value) => editorBoardStateValue = value);
  playBoardState.subscribe((value) => playBoardStateValue = value);
  appMode.subscribe((value) => appModeValue = value);
  isDirty.subscribe((value) => isDirtyValue = value);
  newGridRows.subscribe((value) => newGridRowsValue = value);
  newGridCols.subscribe((value) => newGridColsValue = value);
  $$result.css.add(css);
  currentDescriptors = appModeValue === "edit" || appModeValue === "create" ? calculateDescriptors(editorBoardStateValue) : currentNonogramValue?.descriptors || { rows: [], columns: [] };
  return `${$$result.head += `<!-- HEAD_svelte-6iyx7p_START -->${$$result.title = `<title>Nonogram Editor</title>`, ""}<!-- HEAD_svelte-6iyx7p_END -->`, ""} <div class="app-container svelte-1d5q74c"><header class="svelte-1d5q74c" data-svelte-h="svelte-129wqqj"><h1 class="svelte-1d5q74c">Nonogram SPA Editor</h1></header> <main class="svelte-1d5q74c"> ${validate_component(StatusBar, "StatusBar").$$render(
    $$result,
    {
      currentNonogramName: currentNonogramValue?.name || ""
    },
    {},
    {}
  )}  <div class="controls-bar svelte-1d5q74c">${validate_component(NonogramSelector, "NonogramSelector").$$render($$result, {}, {}, {})}</div>  ${appModeValue === "create" && !editorBoardStateValue.length ? `<div class="create-form svelte-1d5q74c"><h3 data-svelte-h="svelte-lxn9d1">Create New Nonogram</h3> <div class="form-row svelte-1d5q74c"><label for="rows" class="svelte-1d5q74c" data-svelte-h="svelte-1v5jt2k">Rows:</label> <input id="rows" type="number" min="3" max="20" class="svelte-1d5q74c"${add_attribute("value", newGridRowsValue, 0)}></div> <div class="form-row svelte-1d5q74c"><label for="cols" class="svelte-1d5q74c" data-svelte-h="svelte-dfylde">Columns:</label> <input id="cols" type="number" min="3" max="20" class="svelte-1d5q74c"${add_attribute("value", newGridColsValue, 0)}></div> <button data-svelte-h="svelte-3miy8g">Create Grid</button></div>` : ``}  ${(appModeValue === "edit" || appModeValue === "create" && editorBoardStateValue.length > 0) && isDirtyValue ? `<div class="edit-actions svelte-1d5q74c"><button data-svelte-h="svelte-1b8xo17">Process Nonogram</button> <p class="note svelte-1d5q74c" data-svelte-h="svelte-wqxq8l">Note: In v1.0, nonograms are not saved to the backend.</p></div>` : ``}  ${(currentNonogramValue || appModeValue === "create" && editorBoardStateValue.length > 0) && appModeValue !== "loading" ? `<div class="nonogram-area svelte-1d5q74c"><div class="nonogram-container svelte-1d5q74c"> ${validate_component(NonogramClues, "NonogramClues").$$render(
    $$result,
    {
      rowClues: currentDescriptors.rows,
      colClues: currentDescriptors.columns
    },
    {},
    {}
  )}  <div class="grid-area svelte-1d5q74c">${appModeValue === "play" ? `${validate_component(NonogramGrid, "NonogramGrid").$$render(
    $$result,
    {
      board: playBoardStateValue,
      mode: appModeValue
    },
    {},
    {}
  )}` : `${appModeValue === "edit" ? `${validate_component(NonogramGrid, "NonogramGrid").$$render(
    $$result,
    {
      board: editorBoardStateValue,
      mode: appModeValue
    },
    {},
    {}
  )}` : `${appModeValue === "create" && editorBoardStateValue.length > 0 ? `${validate_component(NonogramGrid, "NonogramGrid").$$render(
    $$result,
    {
      board: editorBoardStateValue,
      mode: "create"
    },
    {},
    {}
  )}` : `${appModeValue === "view" && currentNonogramValue ? `${validate_component(NonogramGrid, "NonogramGrid").$$render(
    $$result,
    {
      board: currentNonogramValue.board,
      mode: "view"
    },
    {},
    {}
  )}` : ``}`}`}`}</div></div></div>` : `${appModeValue === "loading" ? `<div class="loading svelte-1d5q74c" data-svelte-h="svelte-sq2l2"><p>Loading...</p></div>` : ``}`}</main> <footer class="svelte-1d5q74c" data-svelte-h="svelte-1h3pyfb"><p>© 2025 Nonogram Editor - Version 1.0</p></footer> </div>`;
});
export {
  Page as default
};
