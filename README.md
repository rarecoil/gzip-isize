# gzip-isize

[![Build Status](https://travis-ci.org/rarecoil/gzip-isize.svg?branch=master)](https://travis-ci.org/rarecoil/gzip-isize) [![Known Vulnerabilities](https://snyk.io/test/github/rarecoil/gzip-isize/badge.svg?targetFile=package.json)](https://snyk.io/test/github/rarecoil/gzip-isize?targetFile=package.json)


### Get GZIP file size statistics without extracting the file.

This module uses the GZIP ISIZE record in order to get size and
compression ratio statistics for a GZIPped file. This module is useful
for validation when trying to get a sense of what a GZip file will
decompress to without actually attempting to decompress it.

Other popular modules get the size by actually doing the work, which can
lead to issues with [decompression bomb attacks](https://en.wikipedia.org/wiki/Zip_bomb).
While not entirely reliable, the ISIZE record gives you some
understanding of what you may be decompressing before you run yourself
out of RAM or disk space.

## Usage

gzip-isize is written in TypeScript, and thus works well with
TypeScript-based applications. However, it is easy to use in the
traditional Node.js way:

````js
const isz = require('../dist/isize.js').ISize;

isz.get('../test/file.tgz')
    .then((result) => {
        console.log(result);
    });
````

#### TypeScript

````ts
import { ISize, GZipCompressionInfo, GZipError } from 'gzip-isize';

try {
    let fileInfo:GZipCompressionInfo = await ISize.get('/path/to/tarball.tgz');

    console.info(`Compression info for ${fileInfo.name}`);
    console.info(`Original file size: ${fileInfo.originalSize} bytes`);
    console.info(`Compressed size: ${fileInfo.compressedSize} bytes`);
    console.info(`Compression ratio: ${fileInfo.compressionRatio}`);
    console.info(`Compression ratio percent: ${fileInfo.compressionRatioPercent})%`);
}
catch (e:GZipError) {
    console.error(`Decompression error: ${e}`);
}
````

## Additional Resources

* https://www.forensicswiki.org/wiki/Gzip#File_header
* https://tools.ietf.org/html/rfc1952

## License

MIT.
&copy; 2019 rarecoil.
