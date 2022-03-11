// taken from : https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
var cssPath = function(el) {
    if (!(el instanceof Element)) return;
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
        } else {
            var sib = el, nth = 1;
            while (sib.nodeType === Node.ELEMENT_NODE && (sib = sib.previousSibling) && nth++);
            selector += ":nth-child("+nth+")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}

console.log('--- Click Listen - content script ---');

document.addEventListener('mousedown', function(event) {
    let path = cssPath(event.target);
    console.log('Click element path',  path);
});
