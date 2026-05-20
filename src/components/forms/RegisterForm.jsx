import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { ApiError } from '../../api/http.js';

const RegisterForm = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: '',
    phone: '',
    password: '',
    first_name: '',
    last_name: '',
    license_category: 'B',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Не удалось зарегистрироваться');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="form__container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit} className="form form--login">
        {error && <p className="form__error">{error}</p>}

        <div>
          <input
            type="text"
            name="first_name"
            placeholder="Имя"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="text"
            name="last_name"
            placeholder="Фамилия"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <input
            type="tel"
            name="phone"
            placeholder="Телефон (+79991234567)"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <select
            name="license_category"
            value={form.license_category}
            onChange={handleChange}
            required
          >
            <option value="A">A — мотоциклы</option>
            <option value="B">B — легковые авто</option>
            <option value="C">C — грузовые</option>
          </select>
        </div>

        <div>
          <input
            type="password"
            name="password"
            placeholder="Пароль"
            value={form.password}
            onChange={handleChange}
            required
            minLength={6}
          />
        </div>

        <Button
          type="submit"
          mode="primary"
          label={submitting ? 'Регистрация...' : 'Зарегистрироваться'}
          location="login-form"
          disabled={submitting}
        />
      </form>
    </div>
  );
};

export default RegisterForm;
