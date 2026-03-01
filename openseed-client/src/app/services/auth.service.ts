import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from "firebase/auth";
import { environment } from '../environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private app = initializeApp(environment.firebase);
    private auth = getAuth(this.app);
    private provider = new GoogleAuthProvider();

    public user$ = new BehaviorSubject<User | null>(null);

    constructor() {
        onAuthStateChanged(this.auth, (user) => {
            this.user$.next(user);
        });
    }

    async loginWithGoogle() {
        try {
            const result = await signInWithPopup(this.auth, this.provider);
            return result.user;
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    }

    async logout() {
        try {
            await signOut(this.auth);
        } catch (error) {
            console.error("Error signing out", error);
            throw error;
        }
    }

    getCurrentUser(): User | null {
        return this.auth.currentUser;
    }
}
