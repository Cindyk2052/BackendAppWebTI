import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  getAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {

 
  constructor(private auth: Auth) {
  
  }

  getCurrentUser(){
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(this.auth,
        user => {
          unsubscribe();
          console.log('estado de usuario desde servicio', user)
          resolve(user);
          
        },
        () => {
          reject();
        }
      );
    });
  }

  register(email: any, password: any) {
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((userData) => {
          resolve(userData);
        })
        .catch((err) => console.log(reject(err)));
    });
  }

  isAuth() {
    const userAuth = getAuth();
    const userLooged = userAuth.currentUser;
    return userLooged != null;
  }

  seeEmailUserAuth() {
    const userAuth = getAuth();
    const userLooged = userAuth.currentUser;
    const emailUserLooged = userLooged?.email;
    return emailUserLooged;
  }

  login({ email, password }: any) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  async logout() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.log(error);
    }
  }

  recoverPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage);
      });
  }
}
