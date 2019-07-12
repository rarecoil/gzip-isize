export declare class ISize {
    /**
     * Get GZip size statistics from the GZIP file's ISIZE record.
     * This is sometimes not entirely accurate.
     *
     * @param filePath:string The file path to load.
     * @returns GZipCompressionInfo
     */
    static get(filePath: string): Promise<GZipCompressionInfo>;
    protected static getCompressedFileSize(filePath: string): Promise<number>;
    protected static getIsize(filePath: string, fileSize: number): Promise<number>;
}
export interface GZipCompressionInfo {
    name: string;
    originalSize: number;
    compressedSize: number;
    compressionRatio: number;
    compressionRatioPercent: number;
}
export declare class GZipError extends Error {
}
