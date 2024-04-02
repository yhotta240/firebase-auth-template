import React, { useState } from 'react';
import { IoLogoGoogle } from "react-icons/io";
import { provider, auth } from '../firebase'; // Firebaseの認証関連の設定をインポート
import { signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth'; // Firebaseの認証関連のメソッドをインポート
import { Button, Modal, Container, Form } from 'react-bootstrap'; // Bootstrapのコンポーネントをインポート

const LoginModal = ({ show, handleClose, showSignUpModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Googleアカウントを使用してログイン
  const signInwithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);// FirebaseのsignInWithPopupメソッドを使用してGoogleアカウントでのサインインを試行
      handleClose(); // モーダルを閉じる
    } catch (error) {
      console.error('Googleサインインエラー:', error.message); // エラーメッセージを表示
      console.error(error); // エラーをコンソールに出力
    }
  };

  // メールアドレスとパスワードでのログイン処理
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      handleClose(); // モーダルを閉じる
    } catch (error) {
      alert('ログインエラー:', error.message);
      console.error(error);
    }
  };


  return (
    <>
      <Modal show={show} fullscreen='sm-down' centered onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className='m-4'>
          <Container className='' >
            <h3 className="text-center p-0" >ログイン</h3>
            <hr className="m-4" />
            <div className="text-center" >
              <p className="mb-4">サインインするには:</p>
              <div className='text-center' >
                <IoLogoGoogle
                  style={{ color: '#1266f1', cursor: 'pointer' }}
                  className="mb-4"
                  onClick={signInwithGoogle}
                  size={26}
                />
              </div>
              <p className="mb-4">または:</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4" controlId="loginForm.email">
                <Form.Label>メールアドレス</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-4" controlId="loginForm.password">
                <Form.Label>パスワード</Form.Label>
                <Form.Control
                  type="password"
                  autoFocus
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <div className="d-flex justify-content-end mb-5 ">
                <a href="/password/reset" className='' >パスワードを忘れてしまった場合</a>
              </div>
              <button type="submit" className="btn btn-primary mb-5 w-100">サインイン</button>
            </Form>
            <div className="text-center">
              <p>アカウントをお持ちではない方&nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="link" onClick={showSignUpModal}>登録する</Button>
              </p>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            閉じる
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default LoginModal;