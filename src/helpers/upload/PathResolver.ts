import path from "path";
import async from "async";

/**
 * Single Image Path Resolver
 *
 * @param {File} file
 */
export const ImagePathResolver = (file: Express.Multer.File): string => {
  if (file) {
    return path.join(file.destination, file.filename);
  }
  return null;
};

/**
 * Multiple Image Path Resolver
 *
 * @param {File} file
 */
export const ImagesPathResolver = (files: any): Promise<string[]> => {
  let images: string[] = [];

  return new Promise((resolve, reject) => {
    async.eachOfSeries(
      files,
      (file: Express.Multer.File, key: number, callback: Function) => {
        images.push(path.join(file.destination, file.filename));
        callback();
      },
      (error) => {
        if (error) {
          reject(error);
        } else {
          resolve(images);
        }
      }
    );
  });
};
export const ImagePathResolverForFields = (files: any) => {
  console.log("pathe log:::::", files);

  let images: any = {};

  let imageJson = JSON.parse(JSON.stringify(files));
  Object.keys(imageJson).forEach((key) => {
    if (Array.isArray(imageJson[key])) {
      imageJson[key].forEach((image: any) => {
        images[key] = image.path;
      });
    }
  });
  return images;
};
export const getFileExtension=(filePath:string)=>{
  const parts = filePath.split('.');
  return parts[parts.length - 1];
}