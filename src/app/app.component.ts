import { Component } from '@angular/core';
import { RouterOutlet , RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
// import { FormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,NavbarComponent,RouterModule,MatButtonModule,MatToolbarModule,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  // title = 'cn-taskmanager';
}
