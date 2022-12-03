const express = require('express')
const db = require('../db.config/db.config')
const jwt = require('jsonwebtoken');
// const Auth = require('./auth')
const cookieParser = require('cookie-parser');
require("dotenv").config();
const bcrypt = require('bcrypt');
const { use } = require('../router/router');
SECRET = process.env.SECRET


const register = async(req, res, next) => {
    // * 7. silahkan ubah password yang telah diterima menjadi dalam bentuk hashing
    const{username, email, password}=req.body
    const hashPassword= await bcrypt.hash(password,10)
    // 8. Silahkan coding agar pengguna bisa menyimpan semua data yang diinputkan ke dalam database
    try{
        await db.query(`INSERT INTO unhan_modul17 VALUES (DEFAULT, $1, $2,$3)`,[username, hashPassword,email])
        return res.send('INPUT BERHASIL')
    } catch (err){
        console.log(err.message)
        return res.status(500).send(err)

    }
}
  
const login = async(req, res, next) => {
    // 9. komparasi antara password yang diinput oleh pengguna dan password yang ada didatabase
    const{email,password}= req.body;
    try {
        const user = await db.query(`SELECT * FROM unhan_modul17 where email=$1;`,[email])
        if(user.rowCount>0){
            const validPass = await bcrypt.compare(password,user.rows[0].password)
    // 10. Generate token menggunakan jwt sign
            if (validPass) {
                let jwtSecretKey = process.env.SECRET;
                let data = {
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email:user.rows[0].email,
                    password:user.rows[0].password
                }
                const token = jwt.sign(data, jwtSecretKey);
    //11. kembalikan nilai id, email, dan username
                 res.cookie("JWT", token, {httpOnly: true,sameSite: "strict",}).status(200).json({
                    id: user.rows[0].id,
                    username: user.rows[0].username,
                    email:user.rows[0].email,
                    });
            } else {
                return res.status(400).send('PASSWORD SALAH')   
            }
        }else{
            return res.status(400).json({
                error: "USER TIDAK TERIDENTIFIKASI, SILAHKAN LOGIN",
            })
        }
    } catch (error) {
        return res.send('LOGIN GAGAL')
        
    }
}

const logout = async(req, res, next) => {
// 14. code untuk menghilangkan token dari cookies dan mengembalikan pesan "sudah keluar dari aplikasi"    
    try {
        res.clearCookie("JWT").send("LOGOUT BERHASIL");
        return res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)
    }
            
}
// 13. membuat verify\
const verify = async(req, res, next) => {
    try {
        res.send(req.data)
    } catch (err) {
        console.log(err.message);
        return res.status(500).send(err)    
    }
}

module.exports = {
    register,
    login,
    logout,
    verify
}
