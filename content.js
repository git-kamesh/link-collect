
//  --  main -- 
console.log('--- Click Listen - content script ---');
window.onload = listenEvents; // attach events

// -- utitls --
const EVENT_TYPE = 'event';

let events_map = {
    'mouse': ['pointerdown'],
    'key': ['keydown'],
    'scroll': ['scroll'],
    'input': ['input'],
    'screen': ['resize']
};

function listenEvents() {
    for(let event_type in events_map) {
        let handler = (ev)=> handleEvent(ev, event_type);
        events_map[event_type].forEach(event => window.addEventListener(event, handler, true));
    }
}

function handleEvent(event, event_type) {
    let event_handlers = {
        'mouse': handleMouseEvent,
        'key': handleKeyEvent,
        'scroll': handleScroll,
        'input': handleInput,
        'screen': handleScreenEvent
    };
    let payload = event_handlers[event_type](event);

    payload && console.log( payload );
}

function handleMouseEvent({ type, target, pointerType : device }) {
    let event_type = (target.tagName === 'A' && type === 'pointerdown')? 'link-click' : type;
    let el_css_path = cssPath(target);

    return {
        type: EVENT_TYPE,
        data: {
            type: event_type,
            target: el_css_path,
            device 
        }
    };
}

function handleKeyEvent({ code, type, target, altKey, ctrlKey, metaKey, shiftKey }) {
    
    if(target.nodeName === 'INPUT') return;

    let key_combinations = { altKey, ctrlKey, metaKey, shiftKey };
    let el_css_path = cssPath(target);

    return {
        type: EVENT_TYPE, 
        data: {
            type,
            code,
            target: el_css_path,
            key_combinations
        }
    };
}

function handleScroll({ target, type }) {
    
    target = target === document ? (document.scrollingElement || document.documentElement) : target;

    let x = target.scrollLeft;
    let y = target.scrollTop;
    let el_css_path = cssPath(target);

    return {
        type: EVENT_TYPE,
        data: {
            type,
            x, y,
            target: el_css_path 
        }
    };
}

function handleInput({ target, type, inputType: input_type }) {
    let el_css_path = cssPath(target);

    return {
        type: EVENT_TYPE,
        data: {
            type, 
            value: target.value,
            input_type,
            target: el_css_path 
        }
    }
}

function handleScreenEvent({ type }) {
    let body = document.body;
    
    return {
        type: EVENT_TYPE,
        data: {
            type,
            width: body.clientWidth,
            height: body.clientHeight
        }
    }
}

// taken from : https://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
function cssPath(el) {
    if (!(el instanceof Element)) return;
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path.unshift(selector);
            break;
        } else {
            var sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type("+nth+")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}
