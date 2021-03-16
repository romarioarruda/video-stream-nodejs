const express = require('express')
const fs = require('fs')

const app = express()

app.get('/', (req, resp) => {
    resp.sendFile(__dirname + '/index.html')
})

app.get('/video', (req, resp) => {
    const range = req.headers.range
    if(!range) {
        resp.status(400).send('Requires Range Header')
    }

    const videoPath = './videos/bigbuck.mp4'
    const videoSize = fs.statSync(videoPath).size

    const chunk_size = 10 ** 6 //cerca de 1MB

    const start = Number(range.replace(/\D/g, ''))
    const end = Math.min(start + chunk_size, videoSize - 1)

    const contentLength = end - start + 1
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4"
    }

    resp.writeHead(206, headers)

    const videoStream = fs.createReadStream(videoPath, { start, end })
    
    videoStream.pipe(resp)
})


const port = 8000
app.listen(port, () => {
    console.log(`Escutando na porta ${port}`)
})