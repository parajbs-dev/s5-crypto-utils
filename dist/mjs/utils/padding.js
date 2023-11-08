/**
 * Pad the file size to the nearest block size.
 * @param initialSize - The initial size of the file.
 * @returns The padded file size.
 * @throws {Error} If an overflow is detected.
 */
export function padFileSizeDefault(initialSize) {
    const kib = 1024;
    // Only iterate to 53 (the maximum safe power of 2).
    for (let n = 0; n < 53; n++) {
        if (initialSize <= (1 << n) * 80 * kib) {
            const paddingBlock = (1 << n) * 4 * kib;
            let finalSize = initialSize;
            if (finalSize % paddingBlock !== 0) {
                finalSize = initialSize - (initialSize % paddingBlock) + paddingBlock;
            }
            return finalSize;
        }
    }
    // Prevent overflow.
    throw new Error("Could not pad file size, overflow detected.");
}
/**
 * Checks if the given size is a valid padded block size.
 * @param size - The size to check.
 * @returns {boolean} True if the size is a valid padded block size, false otherwise.
 * @throws {Error} If an overflow is detected.
 */
export function checkPaddedBlock(size) {
    const kib = 1024;
    // Only iterate to 53 (the maximum safe power of 2).
    for (let n = 0; n < 53; n++) {
        if (size <= (1 << n) * 80 * kib) {
            const paddingBlock = (1 << n) * 4 * kib;
            return size % paddingBlock === 0;
        }
    }
    throw new Error("Could not check padded file size, overflow detected.");
}
