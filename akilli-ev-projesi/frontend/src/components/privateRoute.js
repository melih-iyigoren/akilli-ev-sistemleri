import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, role }) => {
  const kullaniciStr = localStorage.getItem('kullanici');

  // localStorage henüz yüklenmediyse bekle (bu durumda boş ekran gösterebiliriz)
  if (kullaniciStr === null) {
    return null; // veya <div>Yükleniyor...</div>
  }

  const kullanici = JSON.parse(kullaniciStr);

  if (!kullanici) {
    return <Navigate to="/login" />;
  }

  if (role && kullanici.rol !== role) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default PrivateRoute;
