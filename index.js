const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

let transactions = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    const success = req.query.success === 'true';
    res.render('index', { success });
});

app.post('/add', (req, res) => {
    const { date, description, type, value } = req.body;

    transactions.push({
        date: new Date(date),
        description,
        type,
        value: parseFloat(value),
    });

    res.redirect('/?success=true');
});

app.get('/relatorio', (req, res) => {
    const totalEntradas = transactions
        .filter(trans => trans.type === 'Entrada')
        .reduce((acc, trans) => acc + trans.value, 0);
    const totalSaidas = transactions
        .filter(trans => trans.type === 'Saída')
        .reduce((acc, trans) => acc + trans.value, 0);
    
    const deleted = req.query.deleted === 'true'; 

    res.render('relatorio', { transactions, totalEntradas, totalSaidas, deleted });
});

app.post('/delete/:index', (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < transactions.length) {
        transactions.splice(index, 1);
        res.redirect('/relatorio?deleted=true');
    } else {
        res.status(404).send('Transaction not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
