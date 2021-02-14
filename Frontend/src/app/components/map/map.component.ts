import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  lat = 51.678418;
  lng = 7.809007;
  zoom = 16;

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    navigator.geolocation.getCurrentPosition(this.onGeolocationAvailable,this.onGeolocationError,{timeout:10000})
  }

  onGeolocationAvailable = (pos) => {
    this.lat = pos.coords.latitude;
    this.lng = pos.coords.longitude;
  }

  onGeolocationError = (err) => {
    console.log(err);
  }

  onMarkerSelected(event):void {
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ChatComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The chat was closed');
    });
  }

}
