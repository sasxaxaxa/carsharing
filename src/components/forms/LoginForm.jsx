import { useState } from 'react';
import Button from "../ui/Button.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Email:', email);
    console.log('Password:', password);
  };

  return (
    <div className="form__container">
      <h2>Войти</h2>
    <form onSubmit={handleSubmit} className="form form--login">
      <div>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          name="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <Button
        type="submit"
        mode="primary"
        label="Войти"
        location="login-form"
      />
    </form>
    </div>
  );
};

export default LoginForm;