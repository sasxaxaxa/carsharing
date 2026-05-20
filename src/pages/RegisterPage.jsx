import RegisterForm from '../components/forms/RegisterForm.jsx';
import Button from '../components/ui/Button.jsx';

const RegisterPage = () => {
  return (
    <div className="center-container">
      <div className="login">
        <div className="login__wrapper">
          <RegisterForm />
          <div className="login__redirect">
            Уже есть аккаунт?{' '}
            <Button href="/login" label="Войти" mode="transparent" location="login-banner" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
