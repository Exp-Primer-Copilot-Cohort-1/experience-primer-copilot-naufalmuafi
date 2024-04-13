// Create web server
// Create a web server that listens on port 3000 and serves the comments.html file. Use the fs module to read the file and send it to the client.
// Use the fs module to read the comments.json file and send it to the client as JSON.
// If the client sends a POST request to the /comments endpoint, read the comments.json file, parse it, and add the new comment to the comments array. Then write the comments array back to the comments.json file.

const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const server = http.createServer((req, res) => {
    const { pathname } = url.parse(req.url);
    
    if (pathname === '/comments') {
        if (req.method === 'GET') {
            // Read comments.json file and send it as JSON
            fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
                if (err) {
                    res.statusCode = 500;
                    res.end('Internal Server Error');
                } else {
                    res.setHeader('Content-Type', 'application/json');
                    res.end(data);
                }
            });
        } else if (req.method === 'POST') {
            let body = '';
            
            req.on('data', (chunk) => {
                body += chunk;
            });
            
            req.on('end', () => {
                // Parse the request body and add new comment to comments array
                const newComment = JSON.parse(body);
                
                fs.readFile(path.join(__dirname, 'comments.json'), 'utf8', (err, data) => {
                    if (err) {
                        res.statusCode = 500;
                        res.end('Internal Server Error');
                    } else {
                        const comments = JSON.parse(data);
                        comments.push(newComment);
                        
                        // Write comments array back to comments.json file
                        fs.writeFile(path.join(__dirname, 'comments.json'), JSON.stringify(comments), (err) => {
                            if (err) {
                                res.statusCode = 500;
                                res.end('Internal Server Error');
                            } else {
                                res.statusCode = 201;
                                res.end('Comment added successfully');
                            }
                        });
                    }
                });
            });
        }
    } else {
        // Serve comments.html file
        const filePath = path.join(__dirname, 'comments.html');
        
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                res.statusCode = 500;
                res.end('Internal Server Error');
            } else {
                res.setHeader('Content-Type', 'text/html');
                res.end(data);
            }
        });
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});