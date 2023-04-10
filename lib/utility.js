/**
 * Returns true for 1, "1" and "true" and false for every other value
 * @param {String|Number} value
 * @return {boolean}
 */
function isTrue(value) {
    if (value === 1 || value === '1' || value === 'true') {
        return true;
    }
    return false;
}

module.exports = { isTrue };
