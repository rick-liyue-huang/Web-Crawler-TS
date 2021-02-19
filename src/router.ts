
import { Router, Request, Response } from 'express';

import Crawler from './crawler';
import Analyzer from './analyzer';

// modify the .d.ts declare file
interface RequestWithBody extends Request {
  body: {
    [propname: string]: string | undefined;
  }
}

const router = Router();

router.get('/', (req: RequestWithBody, res: Response) => {
  res.send(`
    <html>
      <body>
        <form method='post' action='/getdata'>
          <input type='password' name='password' />
          <button>submit</button>
        </form>
      </body>
    </html>
  `)
});

router.post('/getdata', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  if (password === '123') {
    const secret = `x3b174jsx`;
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = Analyzer.getInstance();
    new Crawler(url, analyzer);
    res.send('getData successful');
  }
  else {
    res.send(`${req.userName} password err`);
  }
  
});

export default router;