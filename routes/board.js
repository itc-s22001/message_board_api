import express from "express";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

const pageSize = 5;

/**
 * ログインチェック処理をするミドルウェア
 */
const loginCheck = (req, res, next) => {
    if (!req.user) {
        req.session.returnTo = "/boards";
        res.redirect("/users/login");
        return;
    }
    next();
};

/**
 * メッセージ一覧ページ
 */
router.get("/:page?", loginCheck, async (req, res, next) => {
    // ページ番号をパラメータから取る。なければデフォルトは 1
    const page = +req.params.page || 1;
    // メッセージ取ってくる
    const messages = await prisma.message.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: [
            {createdAt: "desc"}
        ],
        include: {
            account: true
        }
    });
    const data = {
        title: "Boards",
        user: req.user,
        content: messages,
        page
    };
    res.render("boards/index", data);
});

export default router;

