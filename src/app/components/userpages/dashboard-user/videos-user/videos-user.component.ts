import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Video } from 'src/app/modelos/video';

@Component({
  selector: 'app-videos-user',
  templateUrl: './videos-user.component.html',
  styleUrls: ['./videos-user.component.scss']
})
export class VideosUserComponent implements OnInit {

  videos: Video[] = [];

  constructor(private dataControl: DataApiService) { }

  ngOnInit(): void {
    this.dataControl.getVideos().subscribe((videos) => {
      this.videos = videos;
    });
  }

}
