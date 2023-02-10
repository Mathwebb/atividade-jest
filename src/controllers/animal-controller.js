const fs = require('fs');
const animalsData = require('../data/animals.json');
const { nanoid } = require('nanoid');

exports.post = (req, res, next) => {
  // Formato da requisição: /animais?nome=Dog&especie=Cachorro&idade=4
  // Dados recebidos
  const nome = req.query.nome;
  const especie = req.query.especie;
  const idade = req.query.idade;

  // Validações
  if (isNaN(idade)) {
    res.status(400).send({'mensagem': 'A idade do animal deve ser um número.'});
  }

  if (nome.length <= 1){
    res.status(400).send({'mensagem': 'O nome do animal deve ter pelo menos dois caracteres'})
  }

  // Novo animal a ser inserido
  const novoAnimal = {
    'id': nanoid(),
    'nome': nome,
    'especie': especie,
    'idade': idade,
  }

  // Persistência
  animalsData.push(novoAnimal);
  fs.writeFileSync('src/data/animals.json', JSON.stringify(animalsData));

  // Envio de resposta indicando sucesso
  res.status(201).send(novoAnimal);
};

exports.get = (req, res, next) => {
  // Retorna todos os animais cadastrados
  res.status(200).send(animalsData);
};