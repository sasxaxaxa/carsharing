import LoginForm from "../components/forms/LoginForm.jsx";
import Button from "../components/ui/Button.jsx";

const LoginPage = () => {
  return (
    <>
      <div className="center-container">
        <div className="login">
          <div className="login__wrapper">
            <div className="login__banner">
              <div className="login__banner__info">
                <h2>
                  Добро пожаловать!
                  <br />
                </h2>
                <span>Войдите, чтобы арендовать автомобиль</span>
                <div className="login__banner__info__register">
                  Нет аккаунта?

                  <Button
                    href="/register"
                    label="Зарегистрируйтесь"
                    mode="transparent"
                    location="login-banner"
                  />
                </div>
              </div>
              <div className="login__banner__img">
                <img src="src/assets/img/login-banner-bg.png" alt="" width="984" height="720"/>
              </div>
            </div>
            <div className="login__form">
              <LoginForm />
              <div>
                <span>Или</span>
                <Button
                  type="submit"
                  mode="transparent"
                  label="продолжить без регистрации"
                  location="login-banner"
                  href="/home"
                />
              </div>
            </div>
            </div>
        </div>
      </div>
    </>
  )
}
export default LoginPage;