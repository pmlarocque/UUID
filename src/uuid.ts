export = Uuid;
declare var require, global; // For NodeJS

var hexToByte = {};
var byteToHex = [];

for (var i = 0; i < 256; i++) {
    byteToHex[i] = (i + 0x100).toString(16).substr(1);
    hexToByte[byteToHex[i]] = i;
}

var randomGenerator: () => number[];

// Establish the root object, `window` in the browser, or `global` on the server.
var root = typeof global === 'undefined' ? window : global;

if (root.crypto && root.crypto.getRandomValues) { // Webkit, eventually FireFox and IE
    console.log("Using Web Crypto");
    randomGenerator = () => {
        var rnd = new Uint8Array(16);
        root.crypto.getRandomValues(rnd);
        return Array.prototype.slice.call(rnd, 0);
    };
} else if (root.msCrypto && root.msCrypto.getRandomValues) { // IE11
    console.log("Using IE11 Web Crypto");
    randomGenerator = () => {
        var rnd = new Uint8Array(16);
        root.msCrypto.getRandomValues(rnd);
        return Array.prototype.slice.call(rnd, 0);
    };
} else {
    // Try Node
    try {
        var randomBytes = require("crypto").randomBytes;
        console.log("Using NodeJS Crypto");
        randomGenerator = () => {
            var rnd = randomBytes(16);
            return Array.prototype.slice.call(rnd, 0); // ref: https://groups.google.com/forum/#!topic/nodejs/5AFLWNDg578
        };
    } catch(e)  {
        console.log("Using fallback random");
        randomGenerator = () => {
            // Fallback to default method, might be non-cryptographic
            var rnd = [];

            for (var i = 0, r; i < 16; i++) {
                if ((i & 0x03) == 0) r = Math.random() * 0x100000000;
                rnd[i] = r >>> ((i & 0x03) << 3) & 0xff;
            }

            return rnd;
        };
    }

}

class Uuid {
    private static _version: number = 4;
    private static _format: string = "UpperCase";
    private static validator: RegExp = /^\{?[a-f0-9]{8}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{4}-?[a-f0-9]{12}}?$/i;
    public static EMPTY: Uuid = new Uuid([0, 0, 0, 0, 0, 0, 0, 0, 0 ,0, 0, 0, 0, 0, 0, 0]);

    private _bytes: number[];

    private static randomGenerator = randomGenerator;

    constructor(bytes?: number[]) {
        if (bytes) {
            if (bytes.length !== 16) {
                throw new Error("Invalid bytes array");
            }
            bytes.forEach((byte:number) => {
                if (byte < 0 || byte > 255 || Math.floor(byte) !== byte) {
                    throw new Error("Invalid bytes array");
                }
            });

        } else {
            bytes = Uuid.randomGenerator();
        }

        switch (Uuid._version) {
            case 4:
                // Per 4.4, set bits for version and 'clock_seq_hi_and_reserved'
                bytes[6] = (bytes[6] & 0x0f) | 0x40;
                bytes[8] = (bytes[8] & 0x3f) | 0x80;
                break;
            default:
                throw new Error("Unsupported version");
        }

        this._bytes = bytes;
    }

    public toString = () : string => {
        var str = byteToHex[this._bytes[0]] + byteToHex[this._bytes[1]] +
            byteToHex[this._bytes[2]] + byteToHex[this._bytes[3]] + '-' +
            byteToHex[this._bytes[4]] + byteToHex[this._bytes[5]] + '-' +
            byteToHex[this._bytes[6]] + byteToHex[this._bytes[7]] + '-' +
            byteToHex[this._bytes[8]] + byteToHex[this._bytes[9]] + '-' +
            byteToHex[this._bytes[10]] + byteToHex[this._bytes[11]] +
            byteToHex[this._bytes[12]] + byteToHex[this._bytes[13]] +
            byteToHex[this._bytes[14]] + byteToHex[this._bytes[15]];

        switch (Uuid._format) {
            case "UpperCase":
                return str.toUpperCase();
                break;
            case "LowerCase":
                return str;
                break;
            case "Braces":
                return "{" + str.toUpperCase() + "}";
                break;
            default:
                throw new Error("Unsupported format");
        }
    };

    public toJSON = () : string => {
        return this.toString();
    }

    public isEqual = (other: Uuid): boolean => {
        if (!other || !this._bytes || !other._bytes || this._bytes.length !== other._bytes.length) {
            return false;
        } else {
            // Arrays are both the same length, no need to c
            for (var cpt = 0; cpt < this._bytes.length; cpt++) {
                if (this._bytes[cpt] !== other._bytes[cpt]) {
                    return false;
                }
            }

            return true;
        }
    };

    public static parse = (value: string) : Uuid => {
        if (!Uuid.isUuid(value)) {
            throw new Error("Invalid Uuid");
        } else {
            var buffer = [];
            var index = 0;
            value.toLowerCase().replace(/[0-9a-f]{2}/g, (oct: string) => {
                buffer[index] = hexToByte[oct];
                index++;
                return "";
            });

            return new Uuid(buffer);
        }
    };

    public static isUuid = (value: string): boolean => {
        return Uuid.validator.test(value);
    };

    public static areEqual = (guid1: Uuid, guid2: Uuid): boolean => {
        if (!guid1 || !guid2 || !guid1.isEqual) {
            return false;
        } else {
            return guid1.isEqual(guid2);
        }
    };

    public static setVersion = (version: number): void => {
        if (version !== 4) {
            throw new Error("Version not supported. Currently supported versions are: 4");
        } else {
            Uuid._version = version;
        }
    };

    public static setFormat = (format: string): void => {
        if (format !== "UpperCase" && format !== "LowerCase" && format !== "Braces") {
            throw new Error("Invalid format: must be 'LowerCase', 'UpperCase' or 'Braces'");
        } else {
            Uuid._format = format;
        }
    };

    private static decodeB64 = (char: string) : number => {
        var PLUS = '+'.charCodeAt(0);
        var SLASH = '/'.charCodeAt(0);
        var NUMBER = '0'.charCodeAt(0);
        var LOWER = 'a'.charCodeAt(0);
        var UPPER = 'A'.charCodeAt(0);

        var code = char.charCodeAt(0)
        if (code === PLUS)
            return 62 // '+'
        if (code === SLASH)
            return 63 // '/'
        if (code < NUMBER)
            return -1 //no match
        if (code < NUMBER + 10)
            return code - NUMBER + 26 + 26
        if (code < UPPER + 26)
            return code - UPPER
        if (code < LOWER + 26)
            return code - LOWER + 26
    };

    public static fromBase64 = (b64: string, windowsMode: boolean = false): Uuid => {
        if (b64.length !== 24) {
            throw new Error('Invalid string. Length must be a multiple of 24');
        }

        // base64 is 4/3 + up to two characters of the original data
        var bytes:number[] = [];

        var tmp;

        for (i = 0; i < 20; i += 4) {
            tmp = (Uuid.decodeB64(b64.charAt(i)) << 18) | (Uuid.decodeB64(b64.charAt(i + 1)) << 12) | (Uuid.decodeB64(b64.charAt(i + 2)) << 6) | Uuid.decodeB64(b64.charAt(i + 3))
            bytes.push((tmp & 0xFF0000) >> 16)
            bytes.push((tmp & 0xFF00) >> 8)
            bytes.push(tmp & 0xFF)
        }

        tmp = (Uuid.decodeB64(b64.charAt(i)) << 2) | (Uuid.decodeB64(b64.charAt(i + 1)) >> 4)
        bytes.push(tmp & 0xFF)

        if (windowsMode) {
            bytes = [
                bytes[3],
                bytes[2],
                bytes[1],
                bytes[0],
                bytes[5],
                bytes[4],
                bytes[7],
                bytes[6]
            ].concat(bytes.slice(8));
        }
        return new Uuid(bytes);
    };
}