const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if(!user) {
    return response.status(404).json({ error: "User not found !"});
  }

  request.user = user;

  return next();

}

app.post('/users', (request, response) => {

      const { name, username } = request.body;

      const userAlreadyExists = users.some((user) => user.username === username);

      if(userAlreadyExists) {
        return response.status(400).json({ error: "User already exists!"});
      }

      const user = {
        id: uuidv4(),
        name,
        username,
        todos: []
      }

      users.push(user);

      return response.status(201).json(user);


});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  
    const { user } = request;

    return response.json(user.todos);


});

app.post('/todos', checksExistsUserAccount, (request, response) => {

    const { title, deadline } = request.body;

    const { user } = request;

    const addTodo = {
        id: uuidv4(),
        title,
        done: false,
        deadline: new Date(deadline),
        created_at: new Date()

    };

    user.todos.push(addTodo);

    return response.status(201).json(addTodo);


});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {

    const { user } = request;
    const { title, deadline } = request.body;
    const { id } = request.params;

    const updateTodo = user.todos.find(updateTodo => updateTodo.id === id);

    if(!updateTodo) {
      return response.status(404).json({ error: 'Todo not found ! '});
    }

    updateTodo.title = title;
    updateTodo.deadline = new Date(deadline);

    return response.json(updateTodo);
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {

  const { user } = request;
  const { id } = request.params;

  const updateTodo = user.todos.find(updateTodo => updateTodo.id === id);

  if (!updateTodo) {
    return response.status(404).json({error: 'Todo not found !'});
  }

  updateTodo.done = true;

  return response.json(updateTodo);

});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  
      const { user } = request;
      const { id } = request.params;

      const todoExists = user.todos.find(todoExists => todoExists.id === id);

      if(!todoExists) {
        return response.status(404).json({ error: 'Todo not fount !'});
      }

      user.todos.splice(todoExists, 1);

      return response.status(204).json({ error: 'Todo deleted!' });


});

module.exports = app;