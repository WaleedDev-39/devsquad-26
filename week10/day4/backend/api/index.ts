/* eslint-disable @typescript-eslint/no-var-requires */
// Use require() (not ES import) so esbuild doesn't statically compile the
// NestJS TypeScript source — esbuild lacks emitDecoratorMetadata support.
// Instead we load dist/main.js which was properly compiled by nest build.
// Note: nest build outputs to dist/ directly (not dist/src/) when api/ is
//       excluded from tsconfig.build.json.
require('reflect-metadata');

const main = require('../dist/main'); // ← correct path after nest build

export default main.default;

export const config = {
  api: {
    bodyParser: false, // Let multer handle multipart/form-data for /speech/to-text
  },
};
