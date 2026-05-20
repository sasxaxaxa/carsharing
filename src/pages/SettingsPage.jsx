import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layouts/PageLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import Button from '../components/ui/Button.jsx';

const SettingsPage = () => {
  const { user, isAuthenticated, loading, logout, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      setRefreshing(true);
      refreshProfile().finally(() => setRefreshing(false));
    }
  }, [isAuthenticated, refreshProfile]);

  return (
    <PageLayout>
      <section className="settings">
        <h1>Настройки</h1>

        {loading && <p>Загрузка...</p>}

        {!loading && !isAuthenticated && (
          <p>
            <Link to="/login">Войдите</Link>, чтобы управлять профилем.
          </p>
        )}

        {!loading && isAuthenticated && user && (
          <div className="settings__card">
            <h2>Профиль</h2>
            {refreshing && <p className="settings__hint">Обновление...</p>}
            <dl className="settings__list">
              <dt>Email</dt>
              <dd>{user.email}</dd>
              <dt>Телефон</dt>
              <dd>{user.phone || '—'}</dd>
              <dt>Имя</dt>
              <dd>{[user.first_name, user.last_name].filter(Boolean).join(' ') || '—'}</dd>
              <dt>Категория прав</dt>
              <dd>{user.license_category_display || user.license_category || '—'}</dd>
              <dt>Верификация</dt>
              <dd>{user.is_verified ? 'Подтверждён' : 'Ожидает проверки'}</dd>
            </dl>
            <Button
              type="button"
              mode="primary"
              label="Выйти"
              location="login-form"
              onClick={logout}
            />
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default SettingsPage;
