function walk(o, r, p) {
    const ks = Object.keys(o);
    for (let i = 0; i < ks.length; i++) {
        const k = ks[i];
        const v = o[k];
        if (typeof v === 'object' && !Array.isArray(v)) {
            walk(v, r, p ? `${p}.${k}` : k);
        } else {
            r[p ? `${p}.${k}` : k] = v;
        }
    }
}

function flattenObject(obj) {
    const result = {};
    walk(obj, result, '');
    return result;
}

module.exports = flattenObject;
