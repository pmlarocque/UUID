UUID
====

UUIDs (and GUIDs) as first class javascript citizens.
Based on the internal implementation of [node-uuid](https://github.com/broofa/node-uuid)
and the public interface of [uuid-lib](https://github.com/dandean/uuid-lib).

Currently supports only V4 UUIDs.

# Random method

Tries to use the latest libraries cryptographic-level libraries, and falls back to Math.random
if nothing else is available.

# Usage

## Instantiation

* `var uuid = new Uuid()`: Returns a random Uuid.
* `var uuid = new Uuid(byteArray)`: Returns an Uuid based on the provided bytes.
* `Uuid.parse(string)`: Return an Uuid based on the provided string.
* `Uuid.EMPTY`: Returns the empty Uuid.
* `Uuid.fromBase64(string, windowsMode? = false)`: Return an Uuid from a Base64 representation.
  Since Windows' Guids are partly stored as little-endians, windows mode simulate that behavior.

## Comparison

* `Uuid.isUuid(string)`: Check string for validity.
* `Uuid.areEqual(uuid1, uuid2)`: True if both Uuids have the same internal bit representation.
* `uuid.isEqual(other)`: True if both Uuids have the same internal bit representation.

## Output

* `Uuid.toString()`: Returns a string reprensation according to the selected format.
* `Uuid.toJSON()`: Idem.

## Configuration

* `Uuid.setVersion`: Currently only supports 4.
* `Uuid.setFormat`: The output format for toString and toJSON. Does not impact `new`, `parse` and `isGuid`.
  Supported formats are:
    - UpperCase (default)
    - LowerCase
    - Braces

# Import

Code is available as either an AMD or CommonJS package. TypeScript definition file is provided.