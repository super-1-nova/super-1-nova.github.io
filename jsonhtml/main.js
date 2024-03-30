const jsonInput = document.querySelector("#rawJSONInput");
const jsonOutput = document.querySelector("iframe");
const rawHtml = document.querySelector("#rawHTMLOutput");
const saveButton = document.querySelector("#saveButton");
const loadSelect = document.querySelector("#loadSelect");

jsonInput.value = `{
    "html": {
        "head": {
            "style": "body { color: limegreen; font-family: sans-serif;}"
        },
        "body": {
            "h1": "Hello, World!",
            "h1.class": "helloWorld"
        }
    }
}`;

function add(node, parent) {
  try {
    const elems = {};

    for (const key in node) {
      const elemId = key.substring(
        0,
        key.includes(".") ? key.indexOf(".") : key.length
      );

      if (key.includes(".")) {
        let value = node[key];

        if (Array.isArray(value)) value = value.join(" ");

        elems[elemId].setAttribute(key.substring(key.indexOf(".") + 1), value);
      } else {
        const elementType = key.replace(/#.*$/, "");

        elems[elemId] = document.createElement(elementType);

        if (typeof node[key] === "string")
          elems[elemId].textContent = node[key];
        else add(node[key], elems[elemId]);

        parent.appendChild(elems[elemId]);
      }
    }
  } catch (e) {
    console.error(e);
    CrispyToast.error(e.message);
  }
}

function startParse() {
  try {
    const parsed = JSON.parse(jsonInput.value);
    const wrapper = document.createElement("div");

    add(parsed, wrapper);

    jsonOutput.srcdoc = wrapper.innerHTML;
    rawHtml.value = wrapper.innerHTML;
  } catch (e) {
    CrispyToast.error(e.message);
    console.error(e);
  }
}

jsonInput.addEventListener("input", startParse);

startParse();

// function copyToClipboard() {
//   rawHtml.select();
//   document.execCommand("copy");
//   CrispyToast.success("HTML copied to clipboard!");
// }

function copyRawJson() {
  jsonInput.select();
  document.execCommand("copy");
  CrispyToast.success("JSON copied to clipboard!");
}

function copyRawHTML() {
  rawHtml.select();
  document.execCommand("copy");
  CrispyToast.success("HTML copied to clipboard!");
}

saveButton.addEventListener("click", () => {
  const name = prompt("Name of save");
  if (!name) return CrispyToast.error("Failed to save, no name provided!");

  const saves = JSON.parse(localStorage.getItem("jsonhtml-saves") || "{}");
  saves[name] = jsonInput.value;
  localStorage.setItem("jsonhtml-saves", JSON.stringify(saves));
  CrispyToast.success("Saved!");
});

// load items from localStorage into select

const saves = JSON.parse(localStorage.getItem("jsonhtml-saves") || "{}");

for (const save in saves) {
  const option = document.createElement("option");
  option.value = save;
  option.textContent = save;
  loadSelect.appendChild(option);
}

loadSelect.addEventListener("change", () => {
  if (loadSelect.value == "choose") return;
  jsonInput.value = saves[loadSelect.value];
  startParse();
});

// document.getElementById("copyRawJson").addEventListener("click", copyRawJson);
// document.getElementById("copyRawHTML").addEventListener("click", copyRawHTML);
