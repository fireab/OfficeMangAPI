import { NextFunction, Request, Response } from "express";
import { ImagePathResolver } from "../helpers/upload/PathResolver";
import { Ad } from "../models/Ad.model";
import { BadRequestError } from "../errors/Errors";

class AdController {
  static async addAD(req: Request, res: Response, next: NextFunction) {
    try {
      let title = req.body.title;
      let description = req.body.description;
      console.log("title", title);
      console.log("description", description);

      if (!title) {
        throw new BadRequestError(["title is required"]);
      }
      if (!description) {
        throw new BadRequestError(["description is required"]);
      }

      if (!req.file) {
        throw new BadRequestError(["ad is required"]);
      }

      let path: string = "";
      let fileType: string = "unknown"; // default

      if (req.file) {
        // Resolve file path (your custom function)
        path = ImagePathResolver(req.file);
        path = path.split("/").pop() || "";

        // Detect by MIME type first (safer than extension)
        const mimeType = req.file.mimetype;

        if (mimeType.startsWith("image/")) {
          fileType = "image";
        } else if (mimeType.startsWith("video/")) {
          fileType = "video";
        } else {
          // fallback → check extension
          const ext = path.split(".").pop()?.toLowerCase();
          const imageExts = [
            "png",
            "jpg",
            "jpeg",
            "gif",
            "webp",
            "svg",
            "heic",
            "heif",
          ];
          const videoExts = [
            "mp4",
            "webm",
            "ogg",
            "mov",
            "avi",
            "wmv",
            "mpeg",
            "3gp",
            "3g2",
            "mkv",
            "flv",
            "m4v",
          ];

          if (ext && imageExts.includes(ext)) {
            fileType = "image";
          } else if (ext && videoExts.includes(ext)) {
            fileType = "video";
          }
        }
      }

      await Ad.create({
        type: fileType,
        title: title,
        description: description,
        src: path,
      });

      res.status(200).json({
        message: "success",
        fileName: path,
        fileType: fileType,
      });
    } catch (error) {
      console.error("Error in addAD:", error);
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Fetching all ads...");

      const data = await Ad.findAll();

      // Format the data
      const formattedData = data.map((item) => {
        const i = item.toJSON();
        return {
          id: i.id,
          type: i.type,
          src: `http://localhost:2000/public/${i.src}`,
          description: i.description,
          title: i.title,
        };
      });

      // Return the formatted data
      res.status(200).json(formattedData);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    let id = req.params.id;
    if (!id) {
      return next(new BadRequestError(["id is required"]));
    }
    try {
      const ad = await Ad.findByPk(id);
      if (!ad) {
        return next(new BadRequestError(["Ad not found"]));
      }
      await ad.destroy();
      res.status(200).json({ message: "Ad deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}
export default AdController;
