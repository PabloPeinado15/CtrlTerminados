import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { SwUpdate, SwPush } from '@angular/service-worker';
import { HttpService } from './shared/services/client.http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'app';
  readonly VAPID_PUBLIC_KEY = '';

  ngOnInit(): void {
    if (this.sw.isEnabled) {
      this.sw.available.subscribe(() => {
        console.log('new version available');
      });
    }

    if (this.swPush.isEnabled) {
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY
      }).then(val => {
        console.log('Solicitud de subscripción');
        const valJSON = JSON.stringify(val);
        console.log(valJSON);
        this.clientHttpService.addPushSubscriber(valJSON).subscribe(result => console.log(result));
      });
    }
  }

  constructor(private sw: SwUpdate, private swPush: SwPush, private clientHttpService: HttpService) {  }

}
