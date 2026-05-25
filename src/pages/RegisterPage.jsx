import RegisterForm from '../components/forms/RegisterForm.jsx';
import Button from '../components/ui/Button.jsx';

const AUTH_BANNER_SRC = "src/assets/img/login-banner-bg.png";

const RegisterPage = () => {
  return (
    <div className="center-container">
      <div className="login login--register">
        <div className="login__wrapper login__wrapper--stretch">
          <div className="login__banner">
            <div className="login__banner__info">
              <h2>
                Добро пожаловать
              </h2>
              <span>Создайте аккаунт и арендуйте автомобиль</span>
              <div className="login__banner__info__register">
                Уже есть аккаунт?
                <Button
                  href="/login"
                  label="Войти"
                  mode="transparent"
                  location="login-banner"
                />
              </div>
            </div>
            <div className="login__banner__img">
              <img src={AUTH_BANNER_SRC} alt="" />
            </div>
          </div>

          <div className="login__form">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
