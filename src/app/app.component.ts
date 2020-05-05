import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'LojaFirebase';
  
  items: Observable<any[]>;
  uploadPercent: Observable<number>;
  downloadURL: Observable<string>;
  usuario: Observable<firebase.User>;

  constructor(private firestore: AngularFirestore, private storage: AngularFireStorage, public auth: AngularFireAuth){
    this.items = firestore.collection('items').valueChanges();
    this.usuario = this.auth.user;
  }
  
  uploadFile(event) {
    const file = event.target.files[0];
    const filePath = 'testing';
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    // observe percentage changes
    this.uploadPercent = task.percentageChanges();
    
    // get notified when the download URL is available
    task.snapshotChanges().pipe(
        finalize(() => this.downloadURL = fileRef.getDownloadURL() )
     )
    .subscribe();

  }

  async addItem() {
    await this.firestore.collection('items').add({description: 'testing another one'});
  }

  async cadastrar() {
    await this.auth.createUserWithEmailAndPassword('marcoslatchuk@gmail.com', '123456');
  }

  async autenticar() {
    await this.auth.signInWithEmailAndPassword('marcoslatchuk@gmail.com', '123456');
  }

  async sair() {
    await this.auth.signOut();
  }

}
