
# 🚨 Rede Alerta

> Cada minuto conta.

O **Rede Alerta** é uma plataforma de utilidade pública criada para ajudar na localização de pessoas desaparecidas através da tecnologia, da colaboração comunitária e da rápida disseminação de informações.

---

## 🌐 Acesse o projeto

👉 https://redealerta.ong.br

---

## 💡 Sobre o projeto

O Rede Alerta nasceu com um objetivo simples:

**conectar pessoas, informações e ação em situações de desaparecimento.**

A plataforma permite que qualquer pessoa:
- Cadastre um desaparecimento
- Compartilhe informações relevantes
- Ajude na divulgação
- Colabore com pistas e denúncias

Tudo isso de forma **gratuita, acessível e rápida**.

---

## ⚙️ Funcionalidades

### 👤 Público geral
- Cadastro de pessoas desaparecidas
- Visualização de casos publicados
- Página detalhada de cada caso
- Envio de informações (anônimo ou identificado)
- Compartilhamento direto para redes sociais

### 🛠️ Painel administrativo
- Login protegido
- Moderação de casos (aprovar / rejeitar / encerrar)
- Visualização de denúncias recebidas
- Controle do status dos casos

---

## 🧠 Arquitetura do projeto

O projeto é dividido em duas partes principais:

### 🖥️ Frontend
- React + Vite
- Tailwind CSS
- Axios

### ⚙️ Backend
- FastAPI (Python)
- SQLAlchemy
- Uvicorn

---

## 🚀 Como rodar localmente

### 🔧 Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload

Acesse:

http://127.0.0.1:8000/docs
💻 Frontend
cd frontend
npm install
npm run dev

Crie um arquivo .env:

VITE_API_URL=http://127.0.0.1:8000
🌍 Deploy
Frontend
Vercel
Backend
Render
🔐 Variáveis de ambiente
Backend
SECRET_KEY=uma-chave-segura
ADMIN_USERNAME=admin
ADMIN_PASSWORD=senha
Frontend
VITE_API_URL=https://seu-backend.onrender.com
⚠️ Observações importantes
O projeto utiliza SQLite para desenvolvimento
Uploads são armazenados localmente (modo dev)
Para produção futura:
Banco recomendado: PostgreSQL
Storage recomendado: S3 ou equivalente
🤝 Contribuição

Este é um projeto de impacto social.
Contribuições são extremamente bem-vindas.

Você pode ajudar com:

melhorias de código
design/UX
performance
segurança
divulgação
Como contribuir:
Faça um fork
Crie uma branch:
git checkout -b minha-feature
Commit suas alterações
Abra um Pull Request
📣 Objetivo

O objetivo do Rede Alerta é se tornar uma rede nacional de apoio à localização de pessoas desaparecidas.

🧑‍💻 Autor

Projeto idealizado e desenvolvido por:

João Santos

❤️ Apoie o projeto

Se você acredita na causa:

Compartilhe
Divulgue
Contribua
Ajude alguém a ser encontrado
📌 Licença

Este projeto é de uso livre para fins sociais e educacionais.

🚨 Rede Alerta — Cada minuto conta.
