require("dotenv").config();
const app = require("./app");

app.listen(5001, "0.0.0.0", () => {
  console.log("✅ Server running on http://localhost:5001");
});
