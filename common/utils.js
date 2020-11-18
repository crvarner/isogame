export function unique_id () {
    return Math.random().toString(36).substr(2, 9);
}

export function now () {
    const [secs, nanos] = process.hrtime()
    return secs + (nanos / 1000000000.0)
}

export default {
    now,
    unique_id
}
