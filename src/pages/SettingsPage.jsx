import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '../components/layouts/PageLayout.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { updateProfile } from '../api/users.js';
import { ApiError } from '../api/http.js';
import Button from '../components/ui/Button.jsx';

const LICENSE_OPTIONS = [
  { value: 'A', label: 'A — мотоциклы' },
  { value: 'B', label: 'B — легковые авто' },
  { value: 'C', label: 'C — грузовые' },
];

const SettingsPage = () => {
  const { user, isAuthenticated, loading, logout, refreshProfile } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [licenseCategory, setLicenseCategory] = useState('B');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      setRefreshing(true);
      refreshProfile().finally(() => setRefreshing(false));
    }
  }, [isAuthenticated, refreshProfile]);

  useEffect(() => {
    if (user?.license_category) {
      setLicenseCategory(user.license_category);
    }
  }, [user?.license_category]);

  const handleSaveLicense = async (e) => {
    e.preventDefault();
    setSaveError('');
    setSaveMessage('');
    setSaving(true);

    try {
      await updateProfile({ license_category: licenseCategory });
      await refreshProfile();
      setSaveMessage('Категория прав обновлена');
    } catch (err) {
      setSaveError(err instanceof ApiError ? err.message : 'Не удалось сохранить');
    } finally {
      setSaving(false);
    }
  };

  const hasLocation =
    user?.last_latitude != null &&
    user?.last_longitude != null &&
    user.last_latitude !== '' &&
    user.last_longitude !== '';

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
              <dt>Последняя геопозиция</dt>
              <dd>
                {hasLocation
                  ? `${user.last_latitude}, ${user.last_longitude}`
                  : 'Не сохранена (откройте карту на главной)'}
              </dd>
              <dt>Верификация</dt>
              <dd>{user.is_verified ? 'Подтверждён' : 'Ожидает проверки'}</dd>
            </dl>

            <form className="settings__form" onSubmit={handleSaveLicense}>
              <label>
                Изменить категорию прав
                <select
                  value={licenseCategory}
                  onChange={(e) => setLicenseCategory(e.target.value)}
                >
                  {LICENSE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" disabled={saving}>
                {saving ? 'Сохранение...' : 'Сохранить'}
              </button>
              {saveMessage && <p className="settings__success">{saveMessage}</p>}
              {saveError && <p className="settings__error">{saveError}</p>}
            </form>

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
