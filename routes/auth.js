const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Хэширование паролей
const jwt = require('jsonwebtoken'); // Создание и проверка JWT
const User = require('../models/user'); // Модель пользователя

router.post('/register', async (req, res) => {
  // 1. Получаем данные пользователя из запроса
  const { username, password } = req.body;

  // 2. Проверяем, существует ли уже пользователь с таким именем
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  // 3. Хэшируем пароль
  const hashedPassword = await bcrypt.hash(password, 10);

  // 4. Создаем нового пользователя
  const user = new User({
    username,
    password: hashedPassword
  });

  // 5. Сохраняем пользователя в БД  
  try {
    await user.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  // 1. Получаем данные пользователя из запроса
  const { username, password } = req.body;

  // 2. Находим пользователя в базе данных
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(401).json({ error: 'Invalid username or password' }); 
  }

  // 3. Сравниваем пароли
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid username or password' });
  }

 // 4. Генерация JWT токена:
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); 
  res.json({ token });
});

module.exports = router;