const express = require("express");
const router = express.Router();
const { Op } = require("sequelize");
const { Board, BoardInfo, sequelize } = require("../models");
const { getViews } = require("../function/boardFunction.js");
const multer = require("multer");
const fs = require("fs");
const { ok } = require("assert");

// create
router.post("/", async (req, res) => {
    try {
        // req.body 객체로부터 다음의 속성들을 추출하여 변수에 할당
        const {tableINfoId, title, userNickname, description, created, views} = req.body;
        const query = `insert into board (tableINfoId, title, userNickname, description, created, views) values (${tableINfoId}, '${title}', '${userNickname}', '${description}', '${created}', ${views})`;
        // 비동기적으로 쿼리 실행, 그 결과를 기다릴 때 사용. 주로 'async' 함수 내부에서 사용
        await db.query(query);
        res.status(200);
    } 
    catch(e) {
        console.log(e);
        res.status(500);
    }
});

// read
router.get("/:id", async (req, res) => {
    try {
        const id = req.params.id; // url의 'id' 파라미터 값을 가져와서 id 변수에 할당
        const query = `select * from board where id = ${id}`;
        const [result] = await db.query(query); // DB 쿼리 받아옴. 'result' 배열에서 첫 번째 요소만 추출
        res.json(result); // json 형태로 반환하여 전달
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
});
// update
router.put("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const {title, userNickname} = req.body;
        const query = `update board set title = '${title}', userNickname = '${userNickname}' where id = ${id}`;
        await db.query(query);
        res.status(200);
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
});
//delete
router.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = `delete from board where id = ${id}`;
        await db.query(query);
        res.status(200);
    }
    catch(e) {
        console.log(e);
        res.status(500);
    }
});
