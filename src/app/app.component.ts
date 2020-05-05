import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
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

  constructor(firestore: AngularFirestore, private storage: AngularFireStorage){
    this.items = firestore.collection('items').valueChanges();
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

}
