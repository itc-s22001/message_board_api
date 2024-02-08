import express from "express";
import path from "path"
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import passportConfig from "./util/auth.js"


import indexRouter from "./routes/index.js";
import usersRouter from "./routes/users.js";
import boardRouter from "./routes/board.js";


const app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(import.meta.dirname, "routes")));
app.use(cors({credential: true, origin:'http://localhost:3000'}));

// session
app.use(session({
    secret: "WmU7moZxCF19ngUYorPpltEuJXbjz4a0Dy6a0fLhBt3nEtrI",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 60 * 60 * 1000}
}));

// passport
app.use(passport.authenticate("session"));
app.use(passportConfig(passport));

// cors
app.use(cors({
    origin: "http://localhost:3000", // 許可する 複数の場合は[]で指定する
    credential: true
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/board', boardRouter);


export  default app;
