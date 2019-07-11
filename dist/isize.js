"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const util_1 = require("util");
const closeAsync = util_1.promisify(fs.close);
const openAsync = util_1.promisify(fs.open);
const readAsync = util_1.promisify(fs.read);
const statAsync = util_1.promisify(fs.stat);
const SIZE_ISIZE = 4;
class ISize {
    /**
     * Get GZip size statistics from the GZIP file's ISIZE record.
     * This is sometimes not entirely accurate.
     *
     * @param filePath:string The file path to load.
     * @returns GZipCompressionInfo
     */
    static get(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let compressedSize = yield ISize.getCompressedFileSize(filePath);
                let originalSize = yield ISize.getIsize(filePath, compressedSize);
                let compressionRatio = (compressedSize / originalSize);
                let compressionRatioPct = parseFloat((100 - compressionRatio * 100).toFixed(1));
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
        });
    }
    static getCompressedFileSize(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let stats = yield statAsync(filePath);
            return stats.size;
        });
    }
    static getIsize(filePath, fileSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let fd = yield openAsync(filePath, 'r');
            let iSize = Buffer.alloc(SIZE_ISIZE);
            yield readAsync(fd, iSize, 0, SIZE_ISIZE, fileSize - SIZE_ISIZE);
            yield closeAsync(fd);
            // iSize now contains modulo 2^32
            // GZip byte ordering is little-endian
            return iSize.readInt32LE(0);
        });
    }
}
exports.ISize = ISize;
class GZipError extends Error {
}
exports.GZipError = GZipError;
;
//# sourceMappingURL=isize.js.map