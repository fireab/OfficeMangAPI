import { Readable } from "stream";

export const generateDataChunks = (responsePayload: any, chunkSize: number) => {
  let startIndex = 0;
  return new Readable({
    // The `read` function is called when the client is ready to consume more data
    read() {
      const endIndex = startIndex + chunkSize;
      const dataChunk = responsePayload.slice(startIndex, endIndex);
      if (dataChunk.length === 0) {
        this.push(null); // End of data
      } else {
        startIndex = endIndex;
        this.push(dataChunk);
      }
    },
  });
};
