const express = require('express');

const server = express();

server.use(express.json());

const projects = [];

var requested = 0;


/** 
 * Crie um middleware que será utilizado em todas rotas que recebem o ID do projeto nos parâmetros da 
 * URL que verifica se o projeto com aquele ID existe. Se não existir retorne um erro, caso contrário 
 * permita a requisição continuar normalmente; 
 * */
function idExists(req, res, next){
   
   const { id } = req.params;
   
   if(!projects[id]){
      return res.send("O id informado não exite!");
   }

   next();
}


/** 
 * Crie um middleware global chamado em todas requisições que imprime (console.log) uma contagem de 
 * quantas requisições foram feitas na aplicação até então; 
 * */
function countRequest(req, res, next){
   
   requested++;

   console.log(`Requests: ${ requested }`);
   
   next();
}


/**
 * POST /projects: A rota deve receber id e title dentro corpo e, cadastrar um novo projeto dentro 
 * de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] }; Certifique-se de 
 * enviar tanto o ID quanto o título do projeto no formato string com àspas duplas.
 * */
server.post('/projects', countRequest, (req, res) => {

   const { id, title } = req.body;

   projects.push({
      id: id,
      title: title,
      tasks: []
   });

   return res.json(projects);
});


/**
 * GET /projects: Rota que lista todos projetos e suas tarefas;
 * */
server.get('/projects', countRequest, (req, res) => {
   return res.json(projects);
});


/**
 * PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
 * */
server.put('/projects/:id', countRequest, idExists, (req, res) => {

   const { id } = req.params;
   const { title } = req.body;

   projects[id].title = title; 

   return res.send('Título atualizado com sucesso!');
});


/**
 * DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
 * */
server.delete('/projects/:id', countRequest, idExists, (req, res) => {

   const { id } = req.params;

   projects.splice(id);

   return res.send("Projeto excluído com sucesso!");
});


/**
 * POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa no array 
 * de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
 * */
server.post('/projects/:id/tasks', countRequest, idExists, (req, res) => {

   const { id } = req.params;
   const { title } = req.body;

   projects[id].tasks.push(title);

   return res.json(projects[id].tasks);
});

server.listen(3333);