const express = require("express");
const app = express();
require("dotenv/config");

const cors = require("cors");

const {default : mongoose} =  require("mongoose");

app.use(cors({origin: true}));
app.use(express.json());


app.get("/" , (req, res) => {
    return res.json("Hi umer.")
})

//User Authentication Routes
const userRoute = require("./routes/auth");
app.use("/api/users/", userRoute);

// Artist links
const artistsRoutes = require("./routes/artist");
app.use("/api/artists/", artistsRoutes);

// Album links
const albumRoutes = require("./routes/albums");
app.use("/api/albums/", albumRoutes);

// Songs links
const songRoutes = require("./routes/songs");
app.use("/api/songs/", songRoutes);

mongoose.connect(process.env.Db_String, {useNewUrlParser : true});
mongoose.connection
.once("open", () => console.log("Conneted Successfully"))
.on("error", (error) => 
{
    console.log(`Error: ${error}`); 
})

app.listen(4000, ()=> console.log("Listening to port 4000"));