import { Component } from '@angular/core';
import { Response } from 'src/app/interfaces/response.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  response: Response;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUsers(15).subscribe(
      (results: any) => {
        this.response = results;
      }
    )
  }
}
