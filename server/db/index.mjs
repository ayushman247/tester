import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

mongoose
  .connect(
    "mongodb+srv://ayushman2407:Ayush247@cluster0.pmk6ew9.mongodb.net/"
  )
  .then(() => console.log("Connected mongo db"))
  .catch((e) => console.log(e));

  export default index;