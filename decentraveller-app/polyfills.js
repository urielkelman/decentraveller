import bigInt from 'big-integer';

// Polyfill for global BigInt
if (typeof BigInt === 'undefined') {
    global.BigInt = bigInt;
}
