function iosCopyToClipboard(el) {
    var oldContentEditable = el.contentEditable,
        oldReadOnly = el.readOnly,
        range = document.createRange();

    el.contentEditable = true;
    el.readOnly = false;
    range.selectNodeContents(el);

    var s = window.getSelection();
    s.removeAllRanges();
    s.addRange(range);

    el.setSelectionRange(0, 999999); // A big number, to cover anything that could be inside the element.

    el.contentEditable = oldContentEditable;
    el.readOnly = oldReadOnly;

    document.execCommand('copy');
}

async function fallbackCopyTextToClipboard(text, funcOnTrue) {
    var textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        //var successful = document.execCommand('copy');						
        //var successful = document.execCommand('copy', false, null);
        var successful = false;        
        if(!successful) {
            iosCopyToClipboard(textArea);
        }
        if(successful && funcOnTrue) funcOnTrue();
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}
async function copyTextToClipboard(text, funcOnTrue) {
    let useClipboard = false;
    try {
        useClipboard = navigator.clipboard;
    } catch (error) {
        
    }					
    if (!useClipboard) {
        await fallbackCopyTextToClipboard(text, funcOnTrue);
        return;
    }
    
    //await Homey.alert('copyTextToClipboard (not fallback)');
    navigator.clipboard.writeText(text).then(function() {
        console.log('Async: Copying to clipboard was successful!');
        if(funcOnTrue) funcOnTrue();
    }, async function(err) {
        console.error('Async: Could not copy text: ', err);
        //await Homey.alert(err);
        await fallbackCopyTextToClipboard(text, funcOnTrue);
    });
}
