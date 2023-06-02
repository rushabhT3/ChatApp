const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const entryRoutes = require("./routes/entry");
const sequelize = require("./util/database");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", entryRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log(`Chat app: listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error synchronizing with database:", error);
  });
