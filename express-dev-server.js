const express = require('express')
const app = express()
const path = require('path')

console.log("\nLocal express server starting ...\n\n")

app.set('port', 3000);
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', function (req, res) {
    res.sendFile(
        path.join(__dirname, 'index.html')
    )
})

app.listen(3000)
console.log("Dev server running - view weather app ay http://localhost:3000\n\n")
console.log("Ctrl + C to exit\n")
