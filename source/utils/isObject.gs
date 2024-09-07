function isObject_(object) {
    return object !== null && typeof object === 'object' && !Array.isArray(object) && typeof object !== 'function';
}
