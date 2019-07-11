import * as fs from 'fs';
import { promisify } from 'util';

const closeAsync = promisify(fs.close);
const openAsync = promisify(fs.open);
const readAsync = promisify(fs.read);
const statAsync = promisify(fs.stat);

const SIZE_ISIZE = 4;

export class ISize {

    /**
     * Get GZip size statistics from the GZIP file's ISIZE record.
     * This is sometimes not entirely accurate.
     *
     * @param filePath:string The file path to load.
     * @returns GZipCompressionInfo
     */
    public static async get(filePath:string):Promise<GZipCompressionInfo> {
        try {
            let compressedSize = await ISize.getCompressedFileSize(filePath);
            let originalSize = await ISize.getIsize(filePath, compressedSize);
            let compressionRatio = (compressedSize / originalSize);
            let compressionRatioPct = parseFloat((100 - compressionRatio*100).toFixed(1));

            return {
                name: filePath,
                originalSize: originalSize,
                compressedSize: compressedSize,
                compressionRatio: compressionRatio,
                compressionRatioPercent: compressionRatioPct
            };
        }
        catch (e) {
            throw new GZipError(`Could not get ISIZE: ${e.toString()}`);
        }
    }

    protected static async getCompressedFileSize(filePath:string):Promise<number> {
        let stats = await statAsync(filePath);
        return stats.size;
    }

    protected static async getIsize(filePath:string, fileSize:number):Promise<number> {
        let fd = await openAsync(filePath, 'r');
        let iSize = Buffer.alloc(SIZE_ISIZE);
        await readAsync(
            fd,
            iSize,
            0,
            SIZE_ISIZE,
            fileSize - SIZE_ISIZE
        );
        await closeAsync(fd);
        // iSize now contains modulo 2^32
        // GZip byte ordering is little-endian
        return iSize.readInt32LE(0);
    }

}

export interface GZipCompressionInfo {
    name:string;
    originalSize:number;
    compressedSize:number;
    compressionRatio:number;
    compressionRatioPercent:number;
}

export class GZipError extends Error {};
