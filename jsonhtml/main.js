const sillyJSON = document.querySelector("textarea");
const sillyOutput = document.querySelector("iframe");

function add(node, parent) {
    const elems = {};
    
    for (const key in node) {
        const elemId = key.substring(
            0,
            key.includes(".")
                ? key.indexOf(".")
                : key.length
        );
        
        if (key.includes(".")) {
            let value = node[key];

            if (Array.isArray(value)) value = value.join(" ");
            
            elems[elemId].setAttribute(
                key.substring(key.indexOf(".") + 1),
                value
            );
        } else {
            const elementType = key.replace(/#.*$/, "");
            
            elems[elemId] = document.createElement(elementType);

            if (typeof node[key] === "string")
                elems[elemId].textContent = node[key];
            else
                add(node[key], elems[elemId]);
            
            parent.appendChild(elems[elemId]);
        }
    }
}

function makeSilly() {
    const parsed = JSON.parse(sillyJSON.value);
    const wrapper = document.createElement("div");

    add(parsed, wrapper);

    sillyOutput.srcdoc = wrapper.innerHTML;
}

sillyJSON.addEventListener("input", makeSilly);

makeSilly();
