import express from 'express';



const app = express();


const port = process.env.PORT || 3000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));



app.all('/*', function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
  res.setHeader('Access-Control-Allow-Credentials', "true");
  next();
});

app.all("",(res, req) => {
  console.log("HI");
})

app.get('/healthcheck', (req, res) => {
  res.status(200).send();
});

app.listen(port, () => {
  console.log(`
    ################################################
          🛡️  Server listening on port: ${port} 🛡️
    ################################################
  `);
  console.info('Writon Server Start');

})


// // api 요청 시 해당 경로가 없을 때
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });




export default app;




