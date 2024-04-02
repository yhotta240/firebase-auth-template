
## はじめに
ReactにFirebaseを統合して認証機能を実装しました。そして今回は認証機能だけでなく、React Bootstrapのモーダルウィンドウを活用して、ログインとユーザー登録をスムーズに行えるようにしてみました。

## 完成イメージ

![Videotogif.gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/e5d808dc-bf0d-e619-0662-23cfa1a01677.gif)


ユーザー登録からログインへ移動することもできます(逆も同じ）
![Videotogif (2).gif](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/727e9260-dd31-ae15-d755-e89810dd73ec.gif)

## デモページ

https://firebase-auth-template.vercel.app/

にて公開しています。


## クラス図
![bPBDQiCm48JlVeebfvJWF80F9I64KaZ144BFihMnHMMjq4zoA7ttoggn0dPeSZBipgo_6RInZXddEvdLabaBMwtXEmF8GL8Zr0Tn9WkeY2Go5UTMDEga9uiLj4nnYOVUjfEY_bg-570XmM-Mn-Yzjzr9iXWFst7xa_L4UVuAXv5d71qJIZRm9zKG0pic0gXrHgWcJdJGNSdmc.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/56ee67b9-663f-bd35-c0ab-75e79a0115cf.png)
chatGPTに書かせたので間違ってるかもしれません。

https://www.plantuml.com/plantuml/umla/bP3DQiCm48JlVWgHKqfm7i27aX12AQHW2A5dsThOeckjq4zoA7ttoggn0dPeSXBipgo-cOrrt3ZVOLOZjvPjjMRV6MCvGsga-Y31iM0L4G9NSMvbeqvwibYnbYk1SEXjEvJrr_AbO1UIucPvZDvxsnsIXNZOZjkVh2VAyrTs67d6qJ6XP0D_KWqneECoW5fdf6hYH0VTbOou6QvYgdTrbQvz8seGvk1zrKctX0ieLx1z_oJAz6yaMvobWOfRM7FlslNVzSzmVT_ZR9Ke1uZ5mywIjDSJUQXYY9xQU2vxphm5etW7JnSI95xVAIJHpEQg3N079mjcjfN_x5wBO2yDdIN2H1rRsO0IliDV


## Reactプロジェクトの作成

vscのコマンドラインでReactアプリケーションの新しいプロジェクトを作成します。例えば、Create React Appを使用して次のようにします。

```bash
npx create-react-app firebase-auth-app
cd firebase-auth-app
code . //フォルダを開く
```


## React Bootstrapのセットアップ

React BootstrapとBootstrapをインストールします。

```bash
npm install react-bootstrap bootstrap
```


## Firebaseプロジェクトのセットアップ
Firebaseコンソールにログインし、[新しいプロジェクト](https://console.firebase.google.com/u/0/)を作成します。<br>
![プロジェクトの作成 - Firebase コンソール - console.firebase.google.com.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/4977138e-1f25-5b68-f4b4-ec8797ae0517.png)

プロジェクトを作成したら、Firebase Authenticationを有効にします（必要に応じてCloud Firestoreなどの他のFirebaseサービスも追加で有効にしておくと便利です）。
今回はメール/パスワードとGoogle認証を有効にしておきます。
![FireShot Capture 011 - firebase-auth-app - Authentication - ログイン方法 - Firebase コンソール_ - console.firebase.google.com.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/5c95d603-ec7b-f247-5820-4128c40958f2.png)

Firebaseプロジェクトにアプリを登録し、自身のウェブアプリにFirebaseを追加します。
![FireShot Capture 012 - firebase-auth-app - アプリの追加 - Firebase コンソール - console.firebase.google.com.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/090f960d-1d5f-e58c-8e4f-6eb7e93f2f3b.png)


Firebase SDKの構成オブジェクトをReactに追加します。

```bash
npm install firebase
```

Firebaseコンソールから取得した設定を使用して、srcディレクトリ内にfirebase.jsファイルを作成します。


![スクリーンショット 2024-03-31 203003.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/f0731f72-999f-1d95-3cb6-79f7abb2c1bb.png)

firebase.jsファイルに以下の内容を追加します。
```react:firebase.jsx
// firebase.js

import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider};
```
FirebaseのAPIキーやその他の機密情報を.env.localファイルに保存します。このファイルはGitなどのバージョン管理システムから除外されるため、機密情報が外部に公開される心配はありません。.env.localファイルは以下のようになります。

```makefile:.env.local
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
```

https://firebase.google.com/docs/auth/web/google-signin?hl=ja

https://firebase.google.com/docs/auth/web/start?hl=ja



## ファイル構成
![PP1DJi0W48Ntd8AmwSuprBskr0FKCcqm50X34nFJXR3G2tW0eojhz0BUPYuYmP-cbDsyzpruJ8kXys6UD6iufPNI5wL7IWyKNoYzK_miunipLW8Nw7l1xnZFf-5vE89q_q7fYU8pnLTAQq47fNFsrBcJ7b5KqirE6PI7wmwXafMHS5lIjLY1265sbu01Y_7RjBUJimPCm6FXd.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/d449ceec-4a6b-3b84-cb07-3ef51061df84.png)

https://www.plantuml.com/plantuml/umla/SoWkIImgAStDuL9NUDoy-d7pdiVD7O-RsnytBNxSlEPnqtemTnLNNdvAge9ISL6oaa8rbm8Gg2i0EPWA7pUkUzmyzN7JmiTDIu3cWPMcPUO0zJeM5EWb5nSheGbbeOYaPHQb9YKMfw89P-Qbf5O0TMCAeYaiJYqfBGX9BIuf1aj0NPgSdrkGdvUQLrACwM28vloSbDGY1IM4GfWt4KRxvATdvldcfoJcmEr4I0PdfkU55g3ArdBLSZcavgM00XS0


## ログイン用モーダルウィンドウの作成

![FireShot Capture 013 - React App - localhost.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/a00cea7b-15ff-bef3-b43a-e415fae137cd.png)

最初にGoogleのアイコンを使用するのでreact-iconsをインストールしておきます。
```bash
npm instal react-icons
```


srcディレクトリ内にcomponentsフォルダを作成し、その中にLoginModal.jsを作成します。


以下は、ログイン用のモーダルウィンドウを作成するコードです。




```react:LoginModal.jsx
// LoginModal.jsx
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
```

## ユーザ登録用モーダルウィンドウの作成
ユーザ登録用のモーダルウィンドウも同様に作成します。
![FireShot Capture 014 - React App - localhost.png](https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/5ffe661e-f27a-5360-e76e-650b27c40659.png)
以下は、ユーザ登録用のモーダルウィンドウを作成するコードです。
```react:SignUpModal.jsx
// SignUpModal.jsx

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

```


モーダル

https://react-bootstrap.netlify.app/docs/components/modal

フォーム

https://react-bootstrap.netlify.app/docs/forms/overview



## アプリケーションの統合
最後に、Appコンポーネントでこれらのモーダルウィンドウを使用します。
ついでに認証後の処理とログアウトの処理も追加します。

```react:App.jsx
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




```

## テスト

#### ユーザー登録機能のテスト
<p float="left">
<img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/257d9e7a-578a-38b9-3e2e-260aa7f56aeb.png" width="50%" />
  <img src="https://qiita-image-store.s3.ap-northeast-1.amazonaws.com/0/3680988/dcc9eaa0-6580-d4ce-7cb0-8c84d0f1d4e0.png" width="45%" /> 
<p>

## まとめ

Firebase認証とReact Bootstrapを組み合わせて使用することで、ログインやユーザー登録などの認証機能を簡単に実装できました。
Firebaseの認証機能を利用することで、信頼性の高い認証システムを簡単に導入できるうえ、React Bootstrapを使用することで、UIデザインやレスポンシブデザインに関する考えをあまりすることなく、見栄えの良いUIを構築できました。
これにより、少ないコードと短時間で効率よく機能的なログイン・ユーザー登録フォームを作成することができます。

---
コードはGitHubでご覧いただけます：[GitHubリンク](https://github.com/yhotta240/firebase-auth-template)


https://github.com/yhotta240/firebase-auth-template

## 参考

Firebaseドキュメント

https://firebase.google.com/docs/auth/web/start?hl=ja&_gl=1*s2h8pb*_up*MQ..*_ga*OTgzNTY1MjYxLjE3MTE5NDEyMjE.*_ga_CW55HF8NVT*MTcxMTk0MTIyMC4xLjAuMTcxMTk0MTI0OC4wLjAuMA..#add-initialize-sdk



React Bootstrapドキュメント

https://react-bootstrap.netlify.app/

Bootstrap5設置ガイド

https://bootstrap-guide.com/
