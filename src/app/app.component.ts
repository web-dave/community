import { AfterViewInit, Component, ElementRef, inject, ViewChild } from '@angular/core';
import { IBloxx } from 'models/bloxx.interface';
import { BankService } from './bank.service';
import { GameService } from './game.service';
import { SaveService } from './save.service';
import { tap } from 'rxjs/operators';
import { NgClass, AsyncPipe } from '@angular/common';
import { NodeDirective } from './node.directive';

@Component({
  selector: 'st-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [NgClass, NodeDirective, AsyncPipe],
})
export class AppComponent implements AfterViewInit {
  @ViewChild('dialog') dialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('startDialog') startDialog!: ElementRef<HTMLDialogElement>;
  engine = inject(GameService);
  bank = inject(BankService);
  saveService = inject(SaveService);
  dayLight = 0;
  timeTable = [1, 2, 3, 4, 3, 2, 1];
  total_floors = this.engine.total_floors;
  tDialog: any;

  tick = this.engine.tick$.subscribe(() => {
    if (this.dayLight === 6) {
      this.dayLight = -1;
    }
    this.dayLight++;
  });

  dialogData$ = this.engine.dialogData$.pipe(
    tap(() => {
      clearTimeout(this.tDialog);
      this.dialog.nativeElement.showModal();
      this.tDialog = setTimeout(() => this.dialog.nativeElement.close(), 3000);
    })
  );

  ngAfterViewInit() {
    if (this.saveService.hasSave()) {
      this.startDialog.nativeElement.showModal();
    }
  }

  loadGame() {
    const saveData = this.saveService.load();
    if (saveData) {
      this.engine.restoreGame(saveData);
    }
    this.startDialog.nativeElement.close();
  }

  newGame() {
    this.saveService.clear();
    this.startDialog.nativeElement.close();
  }

  updatePointer(icon: IBloxx) {
    this.engine.activeBlock = icon;
  }
}
