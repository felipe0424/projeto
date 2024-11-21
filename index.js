const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

let transactions = []; // Array para armazenar transações

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos da pasta public
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rota para o formulário de lançamento
app.get('/', (req, res) => {
    const success = req.query.success === 'true';
    res.render('index', { success });
});

// Rota para adicionar uma nova transação
app.post('/add', (req, res) => {
    const { date, description, type, value } = req.body;

    // Adiciona a nova transação ao array
    transactions.push({
        date: new Date(date),
        description,
        type,
        value: parseFloat(value),
    });

    // Redireciona para a página de lançamentos com a mensagem de sucesso
    res.redirect('/?success=true');
});

// Rota para visualizar as transações
app.get('/relatorio', (req, res) => {
    // Calcular totais
    const totalEntradas = transactions
        .filter(trans => trans.type === 'Entrada')
        .reduce((acc, trans) => acc + trans.value, 0);
    const totalSaidas = transactions
        .filter(trans => trans.type === 'Saída')
        .reduce((acc, trans) => acc + trans.value, 0);
    
    // Verifica se a mensagem de exclusão deve ser mostrada
    const deleted = req.query.deleted === 'true'; 

    res.render('relatorio', { transactions, totalEntradas, totalSaidas, deleted });
});


// Rota para excluir uma transação
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
