export function compileRegex(input, flags = 'i') {
    try {
        return input ? new RegExp(input, flags) : null;
    } catch (e) {
        return null;
    }
}

export function highlight(text, re) {
    if (!re || !text) return text;
    // We need to match all occurrences for highlighting? regex usually has 'g' or input needs it?
    // User search is often simple.
    // However, replace with regex only replaces first unless global.
    // The compiled regex from search input might not have 'g'.
    // We can try to construct a new regex with 'g' if possible, or just use split/join if simple.
    // But since it's a RegExp object, we might not be able to easily add flags if passed in.
    // Let's assume global flag is desired for highlight, or we just highlight what we find.
    // Actually, String.prototype.replace(regex, ...) only replaces first match if no /g.
    // We can use new RegExp(re.source, re.flags + 'g') to ensure global.

    try {
        const globalRe = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
        return text.toString().replace(globalRe, m => `<mark>${m}</mark>`);
    } catch (e) {
        return text;
    }
}
