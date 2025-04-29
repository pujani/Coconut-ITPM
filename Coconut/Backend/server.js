const express = require('express');
const {dbConnection} = require('./config/db');
const productroute = require('./route/productroute');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const coconutroute = require('./route/coconutroute');
const diseaseroute = require('./route/diseaseroute');
const landroute = require('./route/landroute');
const noteroute = require('./route/Noteroute');
const session = require('express-session');
const {store} = require('./config/db');
const authuserroute = require('./route/authuserroute');
const path = require('path');
const massegeroute = require('./route/massegeroute');


dbConnection();

app.use(session({
    secret: '2455455@Malinga',
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
        secure: false,
        maxAge:  60 * 60 * 1000 
    }
}));


app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req,res) => res.send("hii mali"));

app.use("/api/product", productroute);
app.use("/api/coconut", coconutroute);
app.use("/api/disease", diseaseroute);
app.use("/api/land", landroute);
app.use("/api/note", noteroute);
app.use("/api/authuser", authuserroute);
app.use("/api/massege", massegeroute);

const PORT = 5001;
app.listen(PORT, (req,res) => console.log("server is connected by port " + PORT));

