import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  documents: Observable<string[]>;
  currentDoc: string;
  private _docSub: Subscription;

  constructor(private chatService: ChatService, public dialog: MatDialog) { }

  ngOnInit(): void {
    this.documents = this.chatService.documents;
    this._docSub = this.chatService.currentDocument.subscribe(doc => this.currentDoc = doc.id);
  }

  ngOnDestroy() {
    this._docSub.unsubscribe();
  }

  loadDoc(id: string) {
    this.chatService.getDocument(id);
  }

  newDoc() {
    this.chatService.newDocument();
    this.openDialog();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(ChatComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The chat was closed');
    });
  }
}
