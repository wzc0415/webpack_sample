import {Component, OnInit} from '@angular/core';


@Component({
    selector: 'app-root',
    // templateUrl: './app.component.html',
    template: require('./app.component.html')
    // styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    constructor() {
    }

    ngOnInit(): void {
    }
}
