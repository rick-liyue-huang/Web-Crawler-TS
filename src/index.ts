
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import router from './router';

// 当我们使用中间件的时候，对 req或者 res 做了修改之后，实际上类型并不能改变
// 这时候可以通过定义 custom.d.ts文件融合之前的.d.ts文件
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.userName = 'rick';
//   next(); // 中间件 将信息传入到下面的路由里面
// });
app.use(
  cookieSession({
    name: 'session',
    keys: ['rick huang'],
    maxAge: 24 * 60 * 60 * 1000
  })
);
app.use(router);

app.listen(7001, () => {
  console.log('server is running');
});