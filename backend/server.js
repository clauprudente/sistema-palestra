const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
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
        const senhaHash = await bcrypt.hash(senha, 10);
        await conexao.execute(
            'INSERT INTO usuarios (email, nome, senha) VALUES (?, ?, ?)',
            [email, nome, senhaHash]
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
        let senhaCorreta = false;

        if (verificaUsuario.senha) {
            senhaCorreta = await bcrypt.compare(senha, verificaUsuario.senha).catch(() => false);
            if (!senhaCorreta && verificaUsuario.senha === senha) {
                senhaCorreta = true;
                const novaSenhaHash = await bcrypt.hash(senha, 10);
                await conexao.execute('UPDATE usuarios SET senha = ? WHERE email = ?', [novaSenhaHash, email]);
            }
        }

        if (!senhaCorreta) {
            return res.json({
                message: "Senha inválida!", tipoMensagem:
                    'danger'
            });
        }
        const userData = {
            id: verificaUsuario.ID,
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

app.post('/api/admin', async (req, res) => {
    const { titulo, descricao, nomePalestrante, localEvento, dataEvento } =
        req.body;
    const dadosEvento = [titulo, descricao, nomePalestrante, localEvento,
        dataEvento];
    try {
        console.log(dadosEvento);
        await conexao.execute("INSERT INTO palestra(titulo, descricao,nomePalestrante, localEvento, dataEvento) VALUES(?,?,?,?,?)", dadosEvento);
        res.status(201).json({ message: "Evento cadastrado com sucesso!" });
    } catch (error) {
        console.log(`Erro interno: ${error}`);
        res.status(500).json({ message: 'Erro ao cadastrar evento!' })
    }
})

app.get("/api/palestras", async (req, res) => {
    try {
        const [rows] = await conexao.execute("SELECT * FROM palestra");
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: "Erro interno" });
    }
});

app.post("/api/inscricao", async (req, res) => {
    const { idUsuario, idPalestra } = req.body;
    try {
        await conexao.execute(
            "INSERT INTO inscricoes (idUsuario, idPalestra) VALUES (?,?)",
            [idUsuario, idPalestra]
        );
        res.status(201).json({ message: "Inscrição realizada :)" });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(400).json({
                message: "Você já se inscreveu nesse evento!"
            });
        } else {
            res.status(500).json({
                message: "Erro ao realizar a inscrição :("
            });
        }
    }
});
const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));