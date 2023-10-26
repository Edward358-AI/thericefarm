/* Simplest Observer function */
const observe = (o, f) => new Proxy(o, { set: (a, b, c) => f(a, b, c) })
