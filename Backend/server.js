require("dotenv").config();

const app = require("./app");

app.listen(process.env.PORT, () => {
    console.log(`Server Running On ${process.env.PORT}`);
});