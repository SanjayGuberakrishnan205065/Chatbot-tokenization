const express = require('express');
const natural = require('natural');
const app = express();

// Middleware to handle form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Tokenizer using 'natural' library
const tokenizer = new natural.WordTokenizer();

// Home route to take user input
app.get('/', (req, res) => {
    res.send(`
        <form action="/tokenize" method="post">
            <label>Enter a sentence:</label>
            <input type="text" name="sentence" />
            <button type="submit">Tokenize, Plot, and Predict</button>
        </form>
    `);
});

// Route to handle tokenization and plotting
app.post('/tokenize', (req, res) => {
    const sentence = req.body.sentence;
    const tokens = tokenizer.tokenize(sentence);

    // Token information for plotting
    const x = [];
    const y = [];
    const z = [];

    // Generate 3D plot data based on token index, length, and random value
    tokens.forEach((token, index) => {
        x.push(index);              // X-axis: Token index
        y.push(token.length);       // Y-axis: Token length
        z.push(Math.random() * 10); // Z-axis: Random value
    });

    // Prediction: average token length
    const avgTokenLength = tokens.reduce((acc, token) => acc + token.length, 0) / tokens.length;
    const predictedTokenLength = avgTokenLength.toFixed(2);

    // Serve the response with embedded plot
    res.send(`
        <h1>3D Token Plot</h1>
        <p>Tokens: ${tokens.join(', ')}</p>
        <p>Prediction: The predicted next token length is: ${predictedTokenLength} characters</p>
        <div id="plot"></div>

        <!-- Plotly.js for 3D plot -->
        <script src="https://cdn.plot.ly/plotly-2.35.2.min.js"></script>
        <script>
            const trace = {
                x: ${JSON.stringify(x)},
                y: ${JSON.stringify(y)},
                z: ${JSON.stringify(z)},
                mode: 'markers+text',
                marker: {
                    size: 12,
                    line: { color: 'rgba(217, 217, 217, 0.14)', width: 0.5 },
                    opacity: 0.8
                },
                text: ${JSON.stringify(tokens)},
                textposition: 'top center',
                type: 'scatter3d'
            };

            const layout = {
                title: '3D Token Plot',
                scene: {
                    xaxis: { title: 'Token Index' },
                    yaxis: { title: 'Token Length' },
                    zaxis: { title: 'Random Z' }
                }
            };

            Plotly.newPlot('plot', [trace], layout);
        </script>
    `);
});

// Start the server
const port = 3000;
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
});
