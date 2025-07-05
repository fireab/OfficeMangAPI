import { Model } from "sequelize";

export function toJsonRowFormat(data: Model | Model[]): object | object[] {
  if (Array.isArray(data)) {
    return data.map((instance) => instance.toJSON());
  } else {
    return data.toJSON();
  }
}

export default toJsonRowFormat;
