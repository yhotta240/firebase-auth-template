import './App.css';
import React, { useState, useEffect } from 'react';
import LoginModal from './components/LoginModal';
import SignUpModal from './components/SignUpModal';
import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

function App() {
  // ログインしているユーザーの情報を管理するステート
  const [user, setUser] = useState(null);
  // モーダルの表示状態を管理するステート
  const [modals, setModals] = useState({ login: false, signUp: false });

  // ログインモーダルを表示する処理
  const handleLoginClick = () => {
    setModals({ login: true, signUp: false });
  };
  // ユーザ登録モーダルを表示する処理
  const handleSignUpClick = () => {
    setModals({ login: false, signUp: true });
  };
  // モーダルを閉じる処理
  const handleCloseModals = () => {
    setModals({ login: false, signUp: false });
  };

  // Firebaseの認証状態が変化した際の処理
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ログアウト処理
  const handleLogout = () => {
    auth.signOut();
    // ログアウト後の処理を記述する（例：リダイレクトなど）
  };

  return (
    <div className="App">
      <div className='container '>
        <div className='mt-5'>
          {user ? (
            // ログインしている場合の表示
            <div>
              <p>{user.displayName} さんが</p>
              <p>{user.email} でログイン中</p>
              <Button variant="secondary" onClick={handleLogout}>ログアウト</Button>
            </div>
          ) : (
            // ログインしていない場合の表示
            <>
              <Button variant="primary" onClick={handleLoginClick}>ログイン</Button>
              <Button variant="secondary" onClick={handleSignUpClick}>ユーザー登録</Button>
            </>
          )}
        </div>
        {/* ログイン用モーダル */}
        <LoginModal show={modals.login} handleClose={handleCloseModals} showSignUpModal={handleSignUpClick} />
        <SignUpModal show={modals.signUp} handleClose={handleCloseModals} showLoginModal={handleLoginClick} />
      </div>
    </div>
  );
}

export default App;

