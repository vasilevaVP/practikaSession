const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Данные пользователей
let users = [];

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: '1234546789',
    resave: false,
    saveUninitialized: true,
  })
);

// Главная страница
app.get('/', (req, res) => {
  if (req.session.user) {
    res.redirect('/profile');
  } else {
    res.render('index');
  }
});

// Регистрация
app.post('/register', (req, res) => {
  const { username, password } = req.body;
  if (users.find((user) => user.username === username)) {
    res.send('Пользователь с таким именем уже существует');
  } else {
    users.push({ username, password });
    res.redirect('/profile');
  }
});

// Вход
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    req.session.user = user;
    res.redirect('/profile');
  } else {
    res.send('Неверный логин или пароль');
  }
});

// Профиль
app.get('/profile', (req, res) => {
  if (req.session.user) {
    res.render('profile', { user: req.session.user });
  } else {
    res.redirect('/');
  }
});

// Редактирование профиля
app.post('/profile/update', (req, res) => {
  if (req.session.user) {
    const { newUsername, newPassword } = req.body;
    const userIndex = users.findIndex(
      (user) => user.username === req.session.user.username
    );
    users[userIndex].username = newUsername;
    users[userIndex].password = newPassword;
    req.session.user.username = newUsername;
    req.session.user.password = newPassword;
    res.redirect('/profile');
  } else {
    res.redirect('/');
  }
});

// Выход
app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
});

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
