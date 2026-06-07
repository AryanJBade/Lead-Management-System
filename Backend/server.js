require("dotenv").config();

const app = require("./app");
const port = process.env.PORT || 5000;

app.listen(port, (err) => {
    if (err) {
        console.error("Server failed to start:", err);
        process.exit(1);
    }
    console.log(`Server Running On ${port}`);
});