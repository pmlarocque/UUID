interface UuidStatic {
    // Constants
    EMPTY: UuidInstance;

    // Constructor
    new(bytes?: number[]): UuidInstance;

    // Methods
    parse: (value: string) => UuidInstance;
    isUuid: (value: string) => boolean;
    areEqual: (guid1: UuidInstance, guid2: UuidInstance) => boolean;
    setVersion: (version: number) => void;
    setFormat: (format: string) => void;
    fromBase64: (b64: string, windowsMode?: boolean) => UuidInstance;
}

interface UuidInstance {
    toString: () => string;
    toJSON: () => string;
    isEqual: (other: UuidInstance) => boolean
}

declare module "uuid" {
    var uuid: UuidStatic;
    export = uuid;
}