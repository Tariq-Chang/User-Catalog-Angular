import { Component } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Coordinate } from 'src/app/interfaces/coordinate.interface';
import { Response } from 'src/app/interfaces/response.interface';
import { UserService } from 'src/app/services/user.service';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css']
})
export class UserdetailComponent {
  response:Response;
  mode: 'edit' | 'locked' = 'locked'
  buttonText: 'Save changes' | 'Edit' = 'Edit';
  marker = new Leaflet.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41],
  })

  constructor(private activatedRoute: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      console.log(params.get('uuid')!);
      this.userService.getUser(params.get('uuid')!).subscribe(
        (res: any) => {
          this.response = res;
          this.loadMap(this.response.results[0].coordinate);
        }
        )
      })
  }

  changeMode(e:any, mode: 'edit' | 'locked'):void{
    e.preventDefault();
    this.mode = this.mode === 'locked' ? 'edit' : 'locked';
    this.buttonText = this.buttonText === 'Edit' ? 'Save changes' : "Edit";

    if(mode === 'edit'){
      console.log("edit logic goes here...");
    }
  }

  private loadMap(coordinate: Coordinate){
    console.log(coordinate);
    const map = Leaflet.map('map', {
      center: [coordinate.latitude, coordinate.longitude],
      zoom: 8
    });
    const mainLayer = Leaflet.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxZoom: 30,
      crossOrigin:true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      
    })
    mainLayer.addTo(map);
    const marker = Leaflet.marker([coordinate.latitude, coordinate.longitude], {icon: this.marker})
    marker.addTo(map).bindPopup(`${this.response.results[0].firstName}'s Location`).openPopup()
  }
}
