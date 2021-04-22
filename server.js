import express  from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

const __dirname = path.resolve();

app.use(cors());

app.use("/static", express.static(path.resolve(__dirname,  "frontend")));

app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname,  "frontend", "index.html"));
});

app.listen(PORT, ()=>{
    console.log(`running on ${PORT}....`);
})