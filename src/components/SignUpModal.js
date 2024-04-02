import React, { useState } from 'react';
import { IoLogoGoogle } from "react-icons/io";
import { provider, auth } from '../firebase'; // Firebaseの認証関連の設定をインポート
import { signInWithPopup, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Firebaseの認証関連のメソッドをインポート
import { Button, Modal, Container, Form } from 'react-bootstrap'; // Bootstrapのコンポーネントをインポート

const SignUpModal = ({ show, handleClose, showLoginModal }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  // Googleアカウントでのサインイン処理
  const signInwithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider); // FirebaseのsignInWithPopupメソッドを使用してGoogleアカウントでのサインインを試行
      handleClose(); // モーダルを閉じる
    } catch (error) {
      alert('Googleサインアップエラー:', error.message); // エラーメッセージを表示
      console.error(error); // エラーをコンソールに出力
    }
  };

  // メールアドレスとパスワードでのサインアップ処理
  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password); // FirebaseのcreateUserWithEmailAndPasswordメソッドを使用してサインアップを試行
      const user = userCredential.user;
      handleClose(); // モーダルを閉じる
      // ユーザー名の設定
      await updateProfile(user, {
        displayName: username
      });
    } catch (error) {
      alert('サインアップエラー:', error.message); // エラーメッセージを表示
      console.error(error); // エラーをコンソールに出力
    }
  }

  return (
    <>
      <Modal show={show} fullscreen='sm-down' centered onHide={handleClose}>
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body className='m-4'>
          <Container>
            <h3 className="text-center p-0" >ユーザー登録</h3>
            <hr className="m-4" />
            <div className="text-center" >
              <p className="mb-4">サインアップするには:</p>
              <div className='text-center' >
                <IoLogoGoogle
                  style={{ color: '#1266f1', fontSize: '25px', cursor: 'pointer' }}
                  className="mb-4"
                  onClick={signInwithGoogle}
                />
              </div>
              <p className="mb-4">または:</p>
            </div>
            <Form onSubmit={handleSignup} >
              <Form.Group className="mb-3" controlId="signupForm.username">
                <Form.Label>ユーザー名</Form.Label>
                <Form.Control
                  type="text"
                  autoFocus
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="signupForm.email">
                <Form.Label>メールアドレス</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  autoFocus
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-5" controlId="signupForm.password">
                <Form.Label>パスワード</Form.Label>
                <Form.Control
                  type="password"
                  autoFocus
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <button type="submit" className="btn btn-primary mb-5 w-100">サインアップ</button>
            </Form>
            <div className="text-center" >
              <p>
                すでにアカウントをお持ちの方は&nbsp;&nbsp;&nbsp;&nbsp;
                <Button variant="link" onClick={showLoginModal}>こちら</Button>
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

export default SignUpModal;
