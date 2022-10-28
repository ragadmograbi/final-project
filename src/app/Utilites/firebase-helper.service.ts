import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import firebase from "firebase/compat/app";
import {environment} from "../../environments/environment";
import "firebase/compat/firestore";
import 'firebase/compat/auth';
import {child} from "../store/item/item.component";
import {getDownloadURL, uploadString} from 'firebase/storage'
import "firebase/compat/storage";


export interface userData {
  cart: any,
  name: string,
  isAdmin: boolean
}

export interface cartItem {
  age: number,
  name: string,
  info: string,
  donate: number,
  image_name: string,
  quantity: number,
  monthlyDonate : number,
  oneTimeDonate : number
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseHelper {
  private readonly firebaseAuth: firebase.auth.Auth;
  private readonly firestore: firebase.firestore.Firestore;
  private readonly firebaseApp: firebase.app.App;
  private readonly firebaseStorage: firebase.storage.Storage;
  private readonly productsCollection: firebase.firestore.CollectionReference<any>;
  private readonly usersCollection: firebase.firestore.CollectionReference<any>;


  public user: firebase.User | undefined | null;

  constructor(private router: Router) {
    this.firebaseApp = firebase.initializeApp(environment.firebase);
    this.firebaseAuth = this.firebaseApp.auth();
    this.firestore = this.firebaseApp.firestore();
    this.firebaseStorage = this.firebaseApp.storage();
    this.productsCollection = this.firestore.collection('childs');
    this.usersCollection = this.firestore.collection('users');


    this.firebaseAuth.onAuthStateChanged(async (user) => {
      if (user) {
        this.user = user;
        if (this.router.url === '/') {
          await this.router.navigateByUrl('/store');
        }
        return;
      }
      await this.router.navigateByUrl('');
    });
  }


  /// Authentication

  async login(email: string, password: string) {
    try {
      await this.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(async () => {
        await this.firebaseAuth.signInWithEmailAndPassword(email, password);
        this.user = this.firebaseAuth.currentUser;

      });
    } catch (e) {
      throw new Error('Failed to sign in: ' + e);
    }
  }

  async googleLogin() {
    try {
      await this.firebaseAuth.setPersistence(firebase.auth.Auth.Persistence.SESSION).then(async () => {
        await this.firebaseAuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
        this.user = this.firebaseAuth.currentUser;
      });
    } catch (e) {
      throw new Error('Failed to sign in: ' + e);
    }
  }

  async emailResetPassword(email: string) {
    await this.firebaseAuth.sendPasswordResetEmail(email);
  }

  async emailSignup(email: string, password: string) {
    const userCredential = await this.firebaseAuth.createUserWithEmailAndPassword(email, password);
    if (userCredential && userCredential.user && userCredential.user.email) {
      await this.usersCollection.doc(userCredential.user.uid).set({
        'name': userCredential.user.email.split('@')[0],
        'cart': {},
        'isAdmin': false
      })

    }
  }

  async logout() {
    try {
      await this.firebaseAuth.signOut();
      await this.router.navigateByUrl('');
    } catch (e) {
    }
  }

  async changePassword(oldPass: string, newPass: string) {
    if (this.firebaseAuth && this.firebaseAuth.currentUser && this.user && this.user.email) {
      const provider = firebase.auth.EmailAuthProvider.credential(this.user.email, oldPass);
      await this.firebaseAuth.currentUser.reauthenticateWithCredential(provider);
      await this.user.updatePassword(newPass);
    }
  }


  // Products collection functions
  async getAllProducts(): Promise<child[]> {
    let flag = 10;
    while (!this.user && flag-- > 0) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!this.user)
      throw new Error('No User!!');
    const childs = (await this.productsCollection.get()).docs;
    let result: child[] | PromiseLike<child[]> = [];
    for (let i = 0; i < childs.length; i++) {
      const data = await this.getProductByName(childs[i].id);
      result.push(data);
    }

    return result;
  }


  async getProductByName(item_name: string): Promise<child> {
    const doc = await this.productsCollection.doc(item_name).get();
    if (!doc.exists){
      throw new Error('Item not found  '+item_name);
    }

    let data: child = doc.data();
    data.image_name = data.name.replace(/[ ]/g, '_') + '.png';
    return data;
  }

  async isAdmin(): Promise<boolean> {
    let flag = 10;
    while (!this.user && flag-- > 0) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!this.user)
      throw new Error('No User!!');
    const data = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    return data.isAdmin;
  }

  // Users collection functions
  async getUserCart(): Promise<cartItem[]> {
    let flag = 10;
    while (!this.user && flag-- > 0) {
      await new Promise(r => setTimeout(r, 100));
    }
    if (!this.user)
      throw new Error('No User!!');
    const data = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    let result: cartItem[] = [];

    for (const [name, quantity] of Object.entries(data.cart)) {
      const prod = await this.getProductByName(name);
      result.push({
        name: name,
        image_name: prod.image_name,
        donate: prod.donate,
        info: prod.info,
        quantity: Number(quantity),
        age: prod.age,
        monthlyDonate: 0,
        oneTimeDonate: 0
      });
    }
    return result;
  }

  public delay: boolean = false;

  async addItem(item_name: string) {
    if (!this.user) {
      throw new Error('No user!!!');
    }
    if (this.delay) {
      return;
    }
    this.delay = true;
    let prevData = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    const itemQ = prevData.cart.hasOwnProperty(item_name) ? prevData.cart[item_name] : 0;
    prevData.cart[item_name] = itemQ + 1;
    await this.usersCollection.doc(this.user.uid).update(prevData);
    this.delay = false;
  }

  async removeItem(item_name: string) {
    if (!this.user) {
      throw new Error('No user!!!');
    }
    if (this.delay) {
      return;
    }
    this.delay = true;
    let prevData = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    delete prevData.cart[item_name];
    await this.usersCollection.doc(this.user.uid).update(prevData);
    this.delay = false;
  }

  async updateItem(item_name: string, newQuantity: number) {
    if (!this.user) {
      throw new Error('No user!!!');
    }
    if (this.delay) {
      return;
    }
    this.delay = true;
    let prevData = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    prevData.cart[item_name] = newQuantity;
    await this.usersCollection.doc(this.user.uid).update(prevData);
    this.delay = false;
  }

  async getMoreInfo(item_name: string) {
    if (!this.user)
      throw new Error('No User!!');
      if (this.delay) {
        return;
      }

    await this.router.navigateByUrl('/Info');
    let prevData = <userData>(await this.usersCollection.doc(this.user.uid).get()).data();
    let childInfo = prevData.cart[item_name];

    return childInfo;
  }

  async addNewChild(age: number, name: string, donate: number, info: string) {
    await this.productsCollection.doc(name).set({
      age: age,
      name: name,
      donate: donate,
      info: info
    });
  }

  async updateProfilePicture(data: string, contentType: string ,child_name: string): Promise<void> {
    if (!this.user || !this.user.email) return;
    const image_path = this.firebaseStorage.ref(`profile_images/${child_name}`);
    await uploadString(image_path, data, 'base64', {
        contentType: contentType
    });
   const newImageLink = await getDownloadURL(image_path);
   await this.productsCollection.doc(child_name).update({
    image_Link: newImageLink
   })
    
    // console.log(data);
}

}
