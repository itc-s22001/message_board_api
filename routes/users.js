import express from "express";
import {check, validationResult} from "express-validator";
import {PrismaClient} from "@prisma/client";
import {calcHash, generateSalt} from "../util/auth.js";
import passport from "passport";


const router = express.Router();
const prisma = new PrismaClient();


/* GET users listing. */

router.get("/", (req, res, next) => {
    try {
        res.status(200).json({message: "logged in"});
    } catch (e) {
        res.status(401).json({message: "unauthenticated"});
    }
});

// ログイン
// router.get("/login", (req, res, next) => {
//    const data = {
//        title: "ログイン",
//    };
// });

// ログイン処理
router.post("/login", passport.authenticate("local", {
    failureRedirect: "/users/error",
    failureMessage: true,
    keepSessionInfo: true
}),(req, res, next) => {
    // ログインに成功したときだけ実行される
    return res.status(200).json({message: "ログインOK"});
});
router.get("/error", (req, res, next) => {
    // ログイン失敗専用の経路
    return res.status(401).json({message: "name and/or password is invalid"});
});

// ログアウト処理
router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        // if (err) {
        //     return next(err);
        // }
        // res.redirect("/users/login")
        res.json({message: "logout"})
    });
});

// 新規登録
router.get("/signup", (req, res, next) => {
    const data = {
        title: "ユーザ新規登録",
        name: "",
        // errors: []
    };
    res.status(200).json(data);
});

// 新規登録処理
router.post("/signup", async (req, res, next) => {
    const result = validationResult(req);

    if (!result.isEmpty()) {
        const error = result.array();
        const data = {
            title: "Users/Signup",
            name: req.body.name,
            error,
        };
        res.render("users/signup", data);
        return;
    }
    const {name, password} = req.body;
    const salt = generateSalt();
    const hashedPassword = calcHash(password, salt);
    await prisma.user.create({
        data: {
            name,
            password: hashedPassword,
            salt
        }
    });
    res.status(200).json({m: "登録完了"})
});

export default router;
