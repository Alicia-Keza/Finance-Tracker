 
 export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch (e) {
        return null;
    }
}

export function highlight(text, re) {
    if (!re || !text) return text;

    try {
        const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
        return text.toString().replace(globalRe, m => `<mark>${m}</mark>`);
    } catch (e) {
        return text;
    }
}
