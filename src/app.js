const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];


app.get("/repositories", (request, response) => { 
  // Lista todos os repositórios sem filtro nehum
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {//neste caso não estou validando se ja existe o repositorio
  // na criação do recurso a rota recebe: title, url e techs, dentro do corpo da requisição
  const { title, url, techs } = request.body;

  const newRepository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(newRepository);
  
  return response.json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  // A rota deve alterar apenas o title, a url e as techs do repositório que possua o id igual ao id presente no parâmetro 
  const { id } = request.params;
  const { title, url, techs } = request.body;
  

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);//retorna o index do elmtno se ele acha ou -1

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'repository not found'});
  }

  const likes = repositories[repositoryIndex].likes;

  const repository = {
      id,
      title,
      url,
      techs,
      likes
  };
  repositories[repositoryIndex] = repository;//atualizamos o vetor na posição repositoryIndex!

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  // Deletar o repositório com o id presente nos parâmetros da rota;
  const { id } = request.params;

  repositoryIndex = repositories.findIndex(rep => rep.id == id);//retorna o indice ou -1

  if(repositoryIndex < 0) {
    return response.status(400).json({ error : "Repository not found"});
  }

  repositories.splice(repositoryIndex, 1); // apago um elemto a partir dessa posição

  //repositories[repositoryIndex] = [];
  return response.status(204).send(); ///cada vez que deletar colocar status 204 e enviar uma rspta vacia!

});

app.post("/repositories/:id/like", (request, response) => {
  /* A rota deve aumentar o número de likes do repositório específico escolhido através do id presente nos parâmetros da rota, 
  a cada chamada dessa rota, o número de likes deve ser aumentado em 1 */

  const { id } = request.params;

  const repository = repositories.find((rep) => rep.id == id);

  
  if (!repository) {
    return response.status(400).json({ error: "repository not found" });
  }

  let contador = parseInt(repository.likes) + 1;

  repository.likes = contador;

  return response.json(repository);

});

module.exports = app;
