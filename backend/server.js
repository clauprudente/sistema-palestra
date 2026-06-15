const express = require('express');
const cors = require('cors');
const conexao = require('./db')

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/cadastro', async (req, res) => {
    const { email, nome, senha } = req.body;
    try {
        // Verifica se o email já está cadastrado
        const [usuarios] = await conexao.execute("SELECT * FROM usuarios WHERE email = ? ", [email]);
        if (usuarios.length > 0) {
            return res.status(400).json({
                message: 'Este email já está cadastrado'
            });
        }
        await conexao.execute(
            'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)',
            [email, nome, senha]
        );
        res.status(201).json({ message: "Usuário cadastrado com sucesso!" });
    } catch (error) {
        30
        res.status(500).json({
            message: `Erro ao cadastrar: ${error.message}`
        });
    }
});

app.post('/api/login', async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [usuario] = await conexao.execute("SELECT * FROM usuarios WHERE email = ? ", [email]);
        if (usuario.length === 0) {
            return res.json({
                message: 'Email ou senha inválidos',
                tipoMensagem: 'danger'
            })
        }
        const verificaUsuario = usuario[0];
        if (verificaUsuario.senha !== senha) {
            return res.json({
                message: "Senha inválida!", tipoMensagem:
                    'danger'
            });
        }
        const userData = {
            email: verificaUsuario.email,
            nome: verificaUsuario.nome,
            admin: verificaUsuario.admin,
        }
        res.json({
            message: 'Login realizado com sucesso!', userData,
            tipoMensagem: 'success'
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao logar!' })
    }
})

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));