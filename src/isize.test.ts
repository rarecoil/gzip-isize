import { ISize } from './isize';
import { spawnSync } from 'child_process';
import { resolve, join } from 'path';

// Get ISIZE from `tar` in order to check our own calculation
const getCompressionInfoFromGzip = (filePath:string):Array<number> => {
    let result = spawnSync('/usr/bin/env', ['gzip', '-l', filePath], { stdio: 'pipe' });
    let stdout = result.stdout.toString().split("\n");
    let re = new RegExp("\\s+(?<comp>\\d+)\\s+(?<uncomp>\\d+)");
    if (stdout.length === 3) {
        let matches = re.exec(stdout[1]);
        if (matches.groups) {
            return [parseInt(matches.groups.comp),
                    parseInt(matches.groups.uncomp)];
        }
        return [-1, -1];
    } else {
        throw new Error(`gzip on this system doesn't give the expected output`);
    }
};

const testFile = resolve(join(__dirname, '..', 'test', 'file.tgz'));


it('passes the test file', async () => {
    let isizeInfo = await ISize.get(testFile);
    expect(isizeInfo.compressedSize).toBe(146);
    expect(isizeInfo.originalSize).toBe(10240);
});

