import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

interface UserProfile {
  id: number;
  username: string; // Required property
}
export class AppComponent {
  title: string = "This is a string, not a number!"; 
  user: UserProfile = { 
    id: 101 
  };
}
