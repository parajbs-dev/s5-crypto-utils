/**
 * Pad the file size to the nearest block size.
 * @param initialSize - The initial size of the file.
 * @returns The padded file size.
 * @throws {Error} If an overflow is detected.
 */
export declare function padFileSizeDefault(initialSize: number): number;
/**
 * Checks if the given size is a valid padded block size.
 * @param size - The size to check.
 * @returns {boolean} True if the size is a valid padded block size, false otherwise.
 * @throws {Error} If an overflow is detected.
 */
export declare function checkPaddedBlock(size: number): boolean;
//# sourceMappingURL=padding.d.ts.map