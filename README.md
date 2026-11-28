# BonVoy

Aplicação web para consultar e gerenciar pacotes de viagem. Projeto acadêmico da disciplina Desenvolvimento Web Front-End, do curso de Ciência da Computação da Universidade FUMEC.

## Tecnologias

- Angular
- TypeScript
- JSON-Server
- Bootstrap 5

## Funcionalidades em desenvolvimento

- Listagem dos pacotes cadastrados
- Busca de pacotes por destino
- Visualização dos detalhes de um pacote
- Exclusão de um pacote com confirmação
- Cadastro e edição de pacotes
- Login e página inicial

## Como executar

É necessário ter Node.js e npm instalados. Na primeira vez, abra o terminal na pasta do projeto e instale as dependências:

```bash
npm install
```

Inicie a API em um terminal:

```bash
npm run api
```

Deixe esse terminal aberto. Em outro terminal, ainda na pasta do projeto, inicie o Angular:

```bash
ng serve -o
```

A aplicação será aberta em `http://localhost:4200`. A API do JSON-Server fica em `http://localhost:3000`. Os dados de demonstração ficam no arquivo `db.json`. A coleção de pacotes pode ser consultada em `http://localhost:3000/pacotes`.

## Campos dos pacotes

Cada pacote possui `id`, `titulo`, `destino`, `descricao`, `imagem`, `preco`, `duracao`, `hospedagem` e `transporte`.

## Equipe

O BonVoy foi desenvolvido em colaboração por Júlia Caroline, Ana Paula Rodrigues e Mariana Fuchs.
