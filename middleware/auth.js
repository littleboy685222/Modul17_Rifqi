const jwt = require('jsonwebtoken');


SECRET = process.env.SECRET
const Auth = {
    verifyToken(req, res, next){
        const tokenPM = req.cookies['JWT'];
        const {token} = req.body;
        console.log(token);
        if (token) {
            // 12. Lakukan jwt verify
            const decoded = jwt.verify(token, SECRET);
            req.data = decoded;
            return next()
        } else if(tokenPM){
            try{
              const decoded = jwt.verify(token, SECRET);
              req.data = decoded;
            } catch(err){
              return res.status(401).send("TOKEN SALAH");
            } return next();
        }
            else {
          res.status(403).send({message: 'Youre not authenticated, please login first'})
            console.log('Youre not authenticated');
        }
    
  }
}

module.exports = Auth;
