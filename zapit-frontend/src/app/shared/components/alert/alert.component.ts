import {Component, Input} from '@angular/core';

@Component({
  selector: 's-app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent {
  @Input() alertType: string = 'primary';
  @Input() visible: boolean = true;
  @Input() message?: string;

  protected showHideComponent() {
    return this.visible ? '' : 'none';
  }
}
