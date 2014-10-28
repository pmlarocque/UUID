var Uuid = require("../dist/CommonJS/uuid");

describe("The Uuid", function() {
    describe("isUuid method", function () {
        it("recognizes a valid Uuid", function () {
            expect(Uuid.isUuid("2F5773C8-D8B9-4EA4-AB55-C62365FD4750")).toBe(true);
        });

        it("recognizes a Uuid regardless of capitalization", function() {
            expect(Uuid.isUuid("2f5773c8-D8B9-4eA4-Ab55-C62365FD4750")).toBe(true);
        });

        it("recognizes a Uuid with or without hyphens", function() {
            expect(Uuid.isUuid("2f5773c8D8B94eA4-Ab55-C62365FD4750")).toBe(true);
        });

        it("recognizes a Uuid with braces hyphens", function() {
            expect(Uuid.isUuid("{2f5773c8D8B94eA4-Ab55-C62365FD4750}")).toBe(true);
        });

        it("recognizes the empty Uuid", function() {
            expect(Uuid.isUuid("00000000-0000-0000-0000-000000000000")).toBe(true);
        });

        it("rejects a Uuid if it's too short", function() {
            expect(Uuid.isUuid("2f5773c8-D8B9-4eA4-Ab55-C62365FD475")).toBe(false);
        });

        it("rejects a Uuid if it's too long", function() {
            expect(Uuid.isUuid("2f5773c8-D8B9-4eA4-Ab55-C62365FD4750d")).toBe(false);
        });

        it("rejects a Uuid if it's null", function() {
            expect(Uuid.isUuid(null)).toBe(false);
        });
        it("rejects a Uuid if it's undefined", function() {
            expect(Uuid.isUuid(undefined)).toBe(false);
        });

        it("rejects a Uuid if it's a number", function() {
            expect(Uuid.isUuid(null)).toBe(false);
        });

        it("rejects a Uuid if it's an array", function() {
            expect(Uuid.isUuid(null)).toBe(false);
        });

        it("rejects a Uuid if it's an object", function() {
            expect(Uuid.isUuid(null)).toBe(false);
        });

        it("rejects a Uuid if it contains non-hex letters", function() {
            expect(Uuid.isUuid("2G5773C8-D8B9-4EA4-AB55-C62365FD4750")).toBe(false);
        });

        it("rejects a Uuid if it contains invalid characters", function() {
            expect(Uuid.isUuid("2!5773C8-D8B9-4EA4-AB55-C62365FD4750")).toBe(false);
        });

        it("rejects a Uuid if it's an empty string", function() {
            expect(Uuid.isUuid("")).toBe(false);
        });
    });

    describe("setFormat method", function () {
        it("rejects a random string", function () {
            expect(Uuid.setFormat.bind(null, "randomString")).toThrow();
        });

        it("rejects an empty string", function () {
            expect(Uuid.setFormat.bind(null, "")).toThrow();
        });

        it("rejects null", function () {
            expect(Uuid.setFormat.bind(null, null)).toThrow();
        });

        it("rejects undefined", function () {
            expect(Uuid.setFormat.bind(null, undefined)).toThrow();
        });

        it("accepts 'UpperCase'", function () {
            Uuid.setFormat("UpperCase");
            // No expect necessary, an exception is thrown if the value is rejected.
        });

        it("accepts 'LowerCase'", function () {
            Uuid.setFormat("LowerCase");
            // No expect necessary, an exception is thrown if the value is rejected.
        });

        it("accepts 'Braces'", function () {
            Uuid.setFormat("Braces");
            // No expect necessary, an exception is thrown if the value is rejected.
        });
    });
    describe("toString method", function () {
        beforeEach(function () {
            Uuid.setVersion(4);
        });

        it("returns the right value in UpperCase format", function() {
            Uuid.setFormat("UpperCase");

            var guid = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid.toString()).toBe("C49A03F6-B220-44CC-AC54-DF1CB694DB8B");
        });

        it("returns the right value in LowerCase format", function() {
            Uuid.setFormat("LowerCase");

            var guid = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid.toString()).toBe("c49a03f6-b220-44cc-ac54-df1cb694db8b");
        });

        it("returns the right value in Braces format", function() {
            Uuid.setFormat("Braces");

            var guid = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid.toString()).toBe("{C49A03F6-B220-44CC-AC54-DF1CB694DB8B}");
        });
    });

    describe("constructor", function() {
        beforeEach(function () {
            Uuid.setVersion(4);
            Uuid.setFormat("LowerCase");
        });

        var v4matcher = new RegExp("^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$");

        it("returns a valid Uuid", function() {
            var guid = new Uuid();
            expect(Uuid.isUuid(guid.toString())).toBe(true);
        });

        it("returns a valid Uuid in version 4", function() {
            for (var i = 0; i < 100; i++) { // Since Guids are random, we create a large number to make sure
                var guid = new Uuid();
                expect(v4matcher.test(guid.toString())).toBe(true);
            }
        });

        it("adjust an byte array correctly in version 4", function() {
            var guid = new Uuid([196, 154, 3, 246, 178, 32, 255, 204, 255, 84, 223, 28, 182, 148, 219, 139]);
            expect(v4matcher.test(guid.toString())).toBe(true);
        });
    });

    describe("isEqual method", function() {
        it("returns true when Guids are equal", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid1.isEqual(guid2)).toBe(true);
            expect(guid2.isEqual(guid1)).toBe(true);
        });

        it("returns false when Guids are not equal", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = new Uuid([193, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid1.isEqual(guid2)).toBe(false);
            expect(guid2.isEqual(guid1)).toBe(false);
        });

        it("returns false when compared to something else", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(guid1.isEqual(null)).toBe(false);
            expect(guid1.isEqual(undefined)).toBe(false);
            expect(guid1.isEqual([])).toBe(false);
            expect(guid1.isEqual({})).toBe(false);
            expect(guid1.isEqual("")).toBe(false);
            expect(guid1.isEqual("string")).toBe(false);
            expect(guid1.isEqual(1)).toBe(false);
            expect(guid1.isEqual(true)).toBe(false);
        });
    });

    describe("areEqual method", function() {
        it("returns true when Guids are equal", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(Uuid.areEqual(guid1, guid2)).toBe(true);
            expect(Uuid.areEqual(guid2, guid1)).toBe(true);
        });

        it("returns false when Guids are not equal", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = new Uuid([193, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(Uuid.areEqual(guid1, guid2)).toBe(false);
            expect(Uuid.areEqual(guid2, guid1)).toBe(false);
        });

        it("returns false when compared to something else", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            expect(Uuid.areEqual(guid1, null)).toBe(false);
            expect(Uuid.areEqual(guid1, undefined)).toBe(false);
            expect(Uuid.areEqual(guid1, [])).toBe(false);
            expect(Uuid.areEqual(guid1, {})).toBe(false);
            expect(Uuid.areEqual(guid1, "")).toBe(false);
            expect(Uuid.areEqual(guid1, "string")).toBe(false);
            expect(Uuid.areEqual(guid1, 1)).toBe(false);
            expect(Uuid.areEqual(guid1, true)).toBe(false);

            expect(Uuid.areEqual(null, guid1)).toBe(false);
            expect(Uuid.areEqual(undefined)).toBe(false);
            expect(Uuid.areEqual([], guid1)).toBe(false);
            expect(Uuid.areEqual({}, guid1)).toBe(false);
            expect(Uuid.areEqual("", guid1)).toBe(false);
            expect(Uuid.areEqual("string", guid1)).toBe(false);
            expect(Uuid.areEqual(1, guid1)).toBe(false);
            expect(Uuid.areEqual(true, guid1)).toBe(false);
        });
    });

    describe("parse method", function () {
        beforeEach(function () {
            Uuid.setVersion(4);
            Uuid.setFormat("LowerCase");
        });

        it("parses a guid correctly", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = Uuid.parse("c49a03f6-b220-44cc-ac54-df1cb694db8b");
            expect(guid1.isEqual(guid2)).toBe(true);
        });

        it("parses an guid correctly regardless of casing", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = Uuid.parse("c49a03F6-B220-44cc-ac54-df1cb694db8b");
            expect(guid1.isEqual(guid2)).toBe(true);
        });

        it("parses an upper guid correctly with or without braces", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = Uuid.parse("{c49a03f6-b220-44cc-ac54-df1cb694db8b");
            expect(guid1.isEqual(guid2)).toBe(true);
        });

        it("parses an upper guid correctly with or without dashes", function () {
            var guid1 = new Uuid([196, 154, 3, 246, 178, 32, 68, 204, 172, 84, 223, 28, 182, 148, 219, 139]);
            var guid2 = Uuid.parse("c49a03f6-b22044ccac54-df1cb694db8b");
            expect(guid1.isEqual(guid2)).toBe(true);
        });
    });

    describe("fromBase64 method", function () {
        beforeEach(function () {
            Uuid.setVersion(4);
            Uuid.setFormat("LowerCase");
        });

        it("parses a guid correctly", function () {
            var guid1 = Uuid.fromBase64("qkOjnCB2V0mRu9WTlq3oFg==", true);
            var guid2 = Uuid.parse("9ca343aa-7620-4957-91bb-d59396ade816");
            expect(guid1.toString()).toBe(guid2.toString());
        });
    });
});