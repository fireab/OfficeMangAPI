import config from "config";

import app from "./app";
// import logger from "./helpers/logger/Winston";

const PORT = 2000;

app.listen(PORT, '0.0.0.0', () => {
  // logger.info(
  //   `${config.get("name")} Running on port ${PORT}, using DB : ${config.get(
  //     "database.name"
  //   )}`
  // );
  console.log(
    `${config.get("name")} Running on port ${PORT}, using DB : ${config.get(
      "database.name"
    )}`
  );
});
export default app;
