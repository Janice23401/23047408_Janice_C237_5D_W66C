const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'public/uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'virtualfitting'
});

connection.connect((err) => {
    if (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    } else {
        console.log('Database connected successfully.');
    }
});


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

async function getUserClothes(username) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM virtual_fitting';
        connection.query(sql, (error, results) => {
            if (error) {
                console.error('Database query error:', error.message);
                return reject(error);
            }
            resolve(results);
        });
    });
}

async function generateOutfit() {
    try {
        const clothes = await getUserClothes(); // Retrieves clothes from virtual_fitting table
        if (clothes.length < 3) {
            throw new Error('Not enough clothes to generate an outfit');
        }

        const randomItems = [];
        while (randomItems.length < 3) {
            const randomItem = clothes[Math.floor(Math.random() * clothes.length)];
            if (!randomItems.includes(randomItem)) {
                randomItems.push(randomItem);
            }
        }

        return randomItems;
    } catch (error) {
        console.error('Error generating outfit:', error.message);
        throw error;
    }
}

// Function to get user outfits from the database
function getUserOutfitsFromDatabase(callback) {
    const sql = 'SELECT * FROM virtual_fitting'; 

    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Database query error:', error.message);
            return callback(error, null);
        }
        callback(null, results);
    });
}

function isAuthenticated(req, res, next) {
    console.log('Checking authentication:', req.query.username);
    if (req.query.username) {
        next();
    } else {
        res.redirect('/login');
    }
}


app.get('/', (req, res) => {
    res.redirect('/home');
});

app.get('/home', (req, res) => {
    const username = 'current_user'; 
    const sql = 'SELECT * FROM virtual_fitting';
    connection.query(sql, (error, results) => {
        if (error) {
            console.error('Error fetching clothes:', error.message);
            return res.status(500).send('Error fetching clothes');
        }
        res.render('index', {
            clothes: results,
            username: username
        });
    });
});


app.get('/about', (req, res) => {
    const username = req.query.username;
    res.render('about', { username: username });
});

app.get('/upload', (req, res) => {
    res.render('upload', { title: 'Upload Clothes' });
});

app.post('/upload', isAuthenticated, upload.single('image'), (req, res) => {
    try {
        const { type_of_clothes, size, color, brand, username } = req.body;
        const image = req.file ? req.file.filename : null;

        if (!image) {
            return res.status(400).send('Image upload is required');
        }

        const sql = 'INSERT INTO virtual_fitting (type_of_clothes, size, color, brand, image, username) VALUES (?, ?, ?, ?, ?, ?)';
        connection.query(sql, [type_of_clothes, size, color, brand, image, username], (error) => {
            if (error) {
                console.error('Database insertion error:', error.message);
                return res.status(500).send('Error adding clothes');
            }
            res.redirect('/home?username=' + username);
        
        });
    } catch (err) {
        console.error('Unexpected error:', err.message);
        res.status(500).send('Unexpected server error');
    }
});



app.get('/login', (req, res) => {
    res.render('login', { title: 'Login', username: req.query.username || '' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        const sql = 'SELECT * FROM users WHERE username = ?';
        connection.query(sql, [username], (error, results) => {
            if (error) {
                console.error('Database query error:', error.message);
                return res.status(500).send('Internal server error');
            }
            if (results.length > 0) {
                bcrypt.compare(password, results[0].password, (err, result) => {
                    if (err) {
                        console.error('Password comparison error:', err);
                        return res.status(500).send('Internal server error');
                    }
                    if (result) {
                        res.redirect(`/home?username=${username}`);
                    } else {
                        res.status(401).send('Invalid credentials');
                    }
                });
            } else {
                res.status(401).send('Invalid credentials');
            }
        });
    } else {
        res.status(400).send('Username and password are required');
    }
});



app.get('/logout', (req, res) => {
    res.redirect('/login');
});

app.get('/clothes/:id', async (req, res) => {
    const id = req.params.id;
    const username = req.query.username; 

    if (!username) {
        return res.redirect('/login');
    }

    try {
        const results = await getUserClothes();
        const item = results.find(c => c.id === parseInt(id));
        if (item) {
            res.render('clothes', { item, username });
        } else {
            res.status(404).send('Clothes not found');
        }
    } catch (error) {
        console.error('Error retrieving clothes by ID:', error.message);
        res.status(500).send('Error retrieving clothes by ID');
    }
});




app.get('/addClothes', (req, res) => {
    const username = req.query.username;
    if (!username) {
        return res.redirect('/login');
    }
    res.render('addClothes', { username });
});

app.post('/addClothes', async (req, res) => {
    const { username, type_of_clothes, size, color, brand, image } = req.body;

    const sql = 'INSERT INTO virtual_fitting (username, type_of_clothes, size, color, brand, image) VALUES (?, ?, ?, ?, ?, ?)';
    connection.query(sql, [username, type_of_clothes, size, color, brand, image], (error) => {
        if (error) {
            console.error('Error inserting clothes:', error.message);
            return res.status(500).send('Error adding clothes');
        }
        res.redirect('/selectClothes?username=' + username);
    });
});

app.get('/register', (req, res) => {
    res.render('register', { username: req.query.username || '', body: '<h1>Register</h1><form action="/register" method="POST"><div class="mb-3">...</div></form>' });
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        bcrypt.hash(password, saltRounds, (err, hash) => {
            if (err) {
                console.error('Hashing error:', err);
                return res.status(500).send('Internal server error');
            }
            const sql = 'INSERT INTO users (username, password) VALUES (?, ?)';
            connection.query(sql, [username, hash], (error) => {
                if (error) {
                    console.error('Database query error:', error.message);
                    return res.status(500).send('Internal server error');
                }
                res.redirect('/login');
            });
        });
    } else {
        res.status(400).send('Username and password are required');
    }
});

app.get('/editClothes/:id', async (req, res) => {
    const clothesId = req.params.id;
    console.log('Requested clothes ID:', clothesId);

    try {
        const results = await getUserClothes();
        console.log('Retrieved clothes:', results);
        
        const clothes = results.find(c => c.id === parseInt(clothesId));
        if (clothes) {
            res.render('editClothes', { clothes, username: req.query.username, title: 'Edit Clothes' });
        } else {
            console.log('Clothes not found with ID:', clothesId);
            res.status(404).send('Clothes not found');
        }
    } catch (error) {
        console.error('Error fetching clothes:', error.message);
        res.status(500).send('Error fetching clothes');
    }
});


app.post('/updateClothes/:id', upload.single('image'), (req, res) => {
    const clothesId = req.params.id;
    const { type_of_clothes, size, color, brand, existingImage } = req.body;
    const image = req.file ? req.file.filename : existingImage;

    const sql = 'UPDATE virtual_fitting SET type_of_clothes = ?, size = ?, color = ?, brand = ?, image = ? WHERE id = ?';
    connection.query(sql, [type_of_clothes, size, color, brand, image, clothesId], (error) => {
        if (error) {
            console.error('Error updating clothes:', error.message);
            return res.status(500).send('Error updating clothes');
        }
        res.redirect('/home?username=' + req.query.username);
    });
});

app.post('/deleteClothes/:id', (req, res) => {
    const clothesId = req.params.id;
    console.log('Deleting clothes with ID:', clothesId);

    // Ensure the SQL query targets the specific record
    const sql = 'DELETE FROM virtual_fitting WHERE id = ?';

    connection.query(sql, [clothesId], (error) => {
        if (error) {
            console.error('Error deleting clothes:', error.message);
            return res.status(500).send('Error deleting clothes');
        }
        res.redirect('/home?username=' + req.query.username);
    });
});



app.get('/outfit', (req, res) => {
    getUserOutfitsFromDatabase((error, outfits) => {
        if (error) {
            console.error('Error fetching outfits:', error.message);
            return res.status(500).send('Error fetching outfits');
        }

        // Render the outfit page with the fetched outfits
        res.render('outfit', { outfit: outfits });
    });
});

app.get('/generate-outfit', async (req, res) => {
    console.log('Request to /generate-outfit'); // Log to confirm route is hit
    try {
        const outfit = await generateOutfit();
        console.log('Generated Outfit:', outfit); // Log outfit data
        res.render('outfit', { outfit: outfit });
    } catch (error) {
        console.error('Error generating outfit:', error.message);
        res.status(500).send('Error generating outfit');
    }
});



// Handle 404 - Not Found
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});