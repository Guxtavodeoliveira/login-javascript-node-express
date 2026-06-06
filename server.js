import express from 'express'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import path from 'path'
import bcrypt from 'bcrypt'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

const app = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.json())

app.get('/config', (req, res) => {
    res.json({
        supabaseUrl: process.env.SUPABASE_URL,
        supabaseKey: process.env.SUPABASE_KEY
    })
})

app.post('/cadastrar', async (req, res) => {
    const { email, senha } = req.body
    const saltRounds = 10
    const hashSenha = await bcrypt.hash(senha, saltRounds)

    const { data, error } = await supabase
        .from('usuarios')
        .insert({ email: email, senha: hashSenha })

    if (error) {
        return res.status(500).json({ sucesso: false, mensagem: 'Erro ao cadastrar usuario' })
    }

    res.json({ sucesso: true, mensagem: 'Cadastro realizado com sucesso' })
})

app.post('/login', async (req, res) => {
    const { email, senha } = req.body

    const { data, error } = await supabase
        .from('usuarios')
        .select('*').eq('email', email)

    if (data.length === 0) {
        return res.status(401).json({ sucesso: false, mensagem: 'Usuario ou Senha Incorreto!' })
    }

    const senhaCorreta = await bcrypt.compare(senha, data[0].senha)

    if (!senhaCorreta) {
        return res.status(401).json({ sucesso: false, mensagem: 'Usuario ou Senha Incorreto!' })
    }

    res.json({ sucesso: true, mensagem: 'Login com sucesso' })
})

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`)
})