import { Component } from '@angular/core';

interface UserProfile {
  id: number;
  username: string; // Required property
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: string = "This is a string, not a number!"; 
 user: UserProfile = {
 id: 101,
username: 'john_doe'
 };
}
