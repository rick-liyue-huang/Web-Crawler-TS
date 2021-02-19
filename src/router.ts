
import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction, response } from 'express';
import Crawler from './utils/crawler';
import Analyzer from './utils/analyzer';
import { getResponseData } from './utils/util';

// modify the .d.ts declare file
interface RequestWithBody extends Request {
  body: {
    [propname: string]: string | undefined;
  }
}

const router = Router();

const checkLogin = (req: RequestWithBody, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    next();
  } else {
    res.json(getResponseData(null, 'login first'));
  }
}

router.get('/', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    res.send(`
    <html>
      <body>
        <a href='/getData'>getData</a>
        <a href='/showData'>showData</a>
        <a href='/logout'>logout</a>
      </body>
    </html>
  `)
  } else {
    res.send(`
    <html>
      <body>
        <form method='post' action='/login'>
          <input type='password' name='password' />
          <button>login</button>
        </form>
      </body>
    </html>
  `);
  }
  
});

router.post('/login', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : false;
  if (isLogin) {
    // res.send('login already');
    res.json(getResponseData(false, 'login already'));
  } else {
    if (password === '123' && req.session) {
      req.session.login = true;
      // res.send('login successfully');
      res.json(getResponseData(true))
    }
    else {
      // res.send('login fail');
      res.json(getResponseData(false, 'login fail'));
    }
  }
});

router.get('/logout', (req: RequestWithBody, res: Response) => {
  if (req.session) {
    req.session.login = undefined;
  } 
  // res.redirect('/');
  res.json(getResponseData(true));
});

router.get('/getdata', checkLogin, (req: RequestWithBody, res: Response) => {
  // const { password } = req.body;
  // const isLogin = req.session ? req.session.login : false;
  /*if (password === '123') {*/
  // if (isLogin) {  
    const secret = `x3b174jsx`;
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    // res.send('getData successful');
    res.json(getResponseData(true));
  // }
  // else {
  //   // res.send(`${req.userName} password err`);
  //   res.send(`login first and then get data`);
  // }
  
});

router.get('/showdata', checkLogin, (req: RequestWithBody, res: Response) => {
  // const isLogin = req.session ? req.session.login : false;
  // if (isLogin) {
    try {
      const position = path.resolve(__dirname, '../data/course.json');
      const result = fs.readFileSync(position, 'utf-8');
      // res.json(JSON.parse(result));
      res.json(getResponseData(JSON.parse(result)));
    } catch(e) {
      // res.send('not shown yet');
      res.json(getResponseData(false, 'no data'));
    }
  // }
  // else {
  //   res.send('not login yet');
  // }
  
});

export default router;