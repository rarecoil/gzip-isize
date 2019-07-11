"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const isize_1 = require("./isize");
const child_process_1 = require("child_process");
const path_1 = require("path");
// Get ISIZE from `tar` in order to check our own calculation
const getCompressionInfoFromGzip = (filePath) => {
    let result = child_process_1.spawnSync('/usr/bin/env', ['gzip', '-l', filePath], { stdio: 'pipe' });
    let stdout = result.stdout.toString().split("\n");
    let re = new RegExp("\\s+(?<comp>\\d+)\\s+(?<uncomp>\\d+)");
    if (stdout.length === 3) {
        let matches = re.exec(stdout[1]);
        if (matches.groups) {
            return [parseInt(matches.groups.comp),
                parseInt(matches.groups.uncomp)];
        }
        return [-1, -1];
    }
    else {
        throw new Error(`gzip on this system doesn't give the expected output`);
    }
};
const testFile = path_1.resolve(path_1.join(__dirname, '..', 'test', 'file.tgz'));
it('gives the same file size info as `gzip -l`', () => __awaiter(this, void 0, void 0, function* () {
    let gzipInfo = getCompressionInfoFromGzip(testFile);
    let isizeInfo = yield isize_1.ISize.get(testFile);
    expect(isizeInfo.compressedSize).toBe(gzipInfo[0]);
    expect(isizeInfo.originalSize).toBe(gzipInfo[1]);
}));
//# sourceMappingURL=isize.test.js.map