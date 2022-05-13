// 请按需更改下述配置
// configurations, change on need
const conf = {
  // 要使用的打印机，填入由Windows指派的打印机名称
  // name of printer assigned by Windows
  printer: 'HP DeskJet 2600 series',

  // 服务器不活动多久后可以开始清理文件？
  // 默认是10分钟
  // period of server inactivity before it can
  // start automatic file cleaning
  // default is 10 minutes
  inactiveTimeout: 10 * 60 * 1000,

  // 文件上传后多久可以被清理？
  // 默认是1小时
  // age of file upon upload before it can be
  // automatically removed
  // default is 1 hour
  fileTimeout: 60 * 60 * 1000,

  // 若双面打印任务的第二步（翻面）始终没有执行，
  // 多久之后丢弃此任务？
  // 默认是10分钟
  // period of time before a duplex action to
  // be cleaned if confirmation of stage two
  // (flipping paper) stays undelivered
  // default is 10 minutes
  duplexTimeout: 10 * 60 * 1000,

  // 隔多久执行一次自动维护检查？
  // 默认是60秒
  // interval of automatic maintenance
  // default is 60 seconds
  maintenanceInterval: 60 * 1000,
};

// koa utils
const Koa = require('koa');
const app = new Koa();
const json = require('koa-json');
const cors = require('@koa/cors');
app.use(cors());
const onerror = require('koa-onerror');
const koaBody = require('koa-body')();
const upload = require('@koa/multer')();
const koaStatic = require('koa-static');
const KoaRouter = require('koa-router');
const logger = require('koa-logger');

// non-koa utils
const PdfParser = require('pdf2json');
const { print } = require('pdf-to-printer');
const { v4 } = require('uuid');
const { readdir, rm, writeFile } = require('fs/promises');
const { existsSync } = require('fs');

// global variables
let duplex = {
  active: false,
  path: [],
  mono: false,
  uuid: 'siltra',
  created: Date.now(),
};
let lastActive = Date.now();

// PDF Parser promise wrap
function parsePDF(data) {
  return new Promise((resolve, reject) => {
    let pdfParser = new PdfParser();
    pdfParser.on('pdfParser_dataError', (errData) =>
      reject(errData.parserError),
    );
    pdfParser.on('pdfParser_dataReady', (pdfData) => resolve(pdfData));
    pdfParser.loadPDF(data);
  });
}

// automatic maintenance
setInterval(async () => {
  if (Date.now() - lastActive > conf.inactiveTimeout) {
    let files = await readdir('./upload');
    for (let i = 0; i < files.length; i++) {
      let splitted = files[i].split('.');
      if (
        splitted[1] == 'pdf' &&
        Date.now() - parseInt(splitted[0]) > conf.fileTimeout
      ) {
        console.log('rm:' + splitted[0].toString());
        rm('./upload/' + files[i], { force: true });
      }
    }
  }
  if (Date.now() - duplex.created > conf.duplexTimeout) {
    duplex.active = false;
  }
}, conf.maintenanceInterval);

// routes
const router = KoaRouter();
router.get('/api/status', async (ctx, next) => {
  if (duplex.active) {
    ctx.body = { duplex };
  } else
    ctx.body = {
      duplex: {
        active: false,
      },
    };
  return next;
});
router.post('/api/upload', upload.single('file'), async (ctx, next) => {
  lastActive = Date.now();
  console.log(ctx.request.file);
  let buffer = ctx.request.file.buffer;
  let path = './upload/' + Date.now() + '.pdf';
  writeFile(path, buffer);
  return (ctx.body = {
    success: true,
    path: path,
  });
});
router.post('/api/print', koaBody, async (ctx, next) => {
  lastActive = Date.now();
  if (duplex.active)
    return (ctx.body = { success: false, err: 'duplexOperating' });
  let config = ctx.request.body.config;
  if (!config.paths) {
    return (ctx.body = { success: false, err: 'emptyList' });
  }
  for (let v = 0; v < config.paths.length; v++) {
    if (!existsSync(config.paths[v])) {
      return (ctx.body = { success: false, err: 'fileMissing' });
    }
  }
  if (config.duplex) {
    duplex.active = true;
    duplex.paths = config.paths;
    duplex.mono = config.mono;
    duplex.uuid = v4();
    duplex.created = Date.now();
    for (let i = 0; i < config.paths.length; i++) {
      let data = await parsePDF(config.paths[i]);
      if (data.Pages.length % 2 == 1) {
        await print('./blank.pdf', {
          printer: conf.printer,
        });
      }
      let p = 2;
      let a = [];
      while (p <= data.Pages.length) {
        a.push(p);
        p += 2;
      }
      if (a.length) {
        await print(config.paths[i], {
          printer: conf.printer,
          pages: a.join(','),
          monochrome: config.mono,
        });
      }
    }
    ctx.body = {
      success: true,
      uuid: duplex.uuid,
    };
  } else {
    for (let i = 0; i < config.paths.length; i++) {
      await print(config.paths[i], {
        printer: conf.printer,
        monochrome: config.mono,
      });
    }
    return (ctx.body = {
      success: true,
    });
  }
});
router.post('/api/duplex', koaBody, async (ctx, next) => {
  lastActive = Date.now();
  if (!duplex.active)
    return (ctx.body = { success: false, err: 'duplexNotOperating' });
  for (let i = 0; i < duplex.paths.length; i++) {
    let data = await parsePDF(duplex.paths[i]);
    let p = 1;
    let a = [];
    while (p <= data.Pages.length) {
      a.push(p);
      p += 2;
    }
    await print(duplex.paths[i], {
      printer: conf.printer,
      pages: a.join(','),
      monochrome: duplex.mono,
    });
  }
  duplex.active = false;
  return (ctx.body = {
    success: true,
  });
});
app.use(router.routes()).use(router.allowedMethods());

// error handler
onerror(app);

// middlewares
app.use(json());
app.use(logger());
app.use(koaStatic(__dirname + '/public', { extensions: ['html'] }));

// logger
app.use(async (ctx, next) => {
  const start = new Date();
  await next();
  const ms = new Date() - start;
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`);
});

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx);
});

module.exports = app;
