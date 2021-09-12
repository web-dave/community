import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { INode } from 'models/node.interface';
import { GameService } from './game.service';
import { Unit } from './unit.class';
import { filter } from 'rxjs/operators';
import { BankService } from './bank.service';

@Directive({
  selector: '[stNode]',
})
export class NodeDirective {
  @Input() stNode!: INode;
  @Input() connected = false;

  @HostListener('click')
  boom() {
    if (this.bank.isAbleToBuild(this.engine.activeBlock)) {
      switch (this.engine.activeBlock) {
        case 'unit':
          if (!this.stNode.unit) {
            console.log(this.engine.activeBlock, this.stNode);
            if (this.engine.isAbleToStart(this.stNode.floor, this.stNode.id)) {
              console.log(
                this.stNode,
                this.engine.activeBlock,
                this.elementRef
              );
              this.stNode.unit = new Unit(
                this.stNode.id,
                'unit-' + this.stNode.floor + '-' + this.stNode.id,
                this.stNode.floor
              );
              this.elementRef.nativeElement.style.backgroundImage =
                'url("assets/img/icon/unit.png")';
            }
          }
          break;
        case 'pointer':
          break;
        case 'stairs':
          if (this.stNode.unit?.floor && !this.stNode.unit?.tenant?.name) {
            this.stNode.unit.tenant.name = 'stairs';
            this.engine.connectFloor(this.stNode.floor);
            this.elementRef.nativeElement.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/stairs.png")`;
          }
          break;
        case 'flat':
        case 'office':
        case 'shopping':
        case 'school':
        case 'safety':
          if (!this.stNode.unit?.tenant.name) {
            console.log(this.stNode, this.engine.activeBlock);
            this.elementRef.nativeElement.style.backgroundImage = `url("assets/img/icon/unit.png"), url("assets/img/icon/${this.engine.activeBlock}.png")`;
          }
          break;
        default:
          break;
      }
      this.bank.subtract(this.engine.activeBlock);
    }
  }

  draw() {
    if (
      !this.engine.isConnected(this.stNode.floor) &&
      this.stNode.unit &&
      !this.connected
    ) {
      this.elementRef.nativeElement.classList.add('no-connection');
    } else {
      this.elementRef.nativeElement.classList.remove('no-connection');
    }
  }

  constructor(
    private engine: GameService,
    private elementRef: ElementRef,
    public bank: BankService
  ) {
    this.engine.tick$
      .pipe(filter(() => !!this.stNode.unit))
      .subscribe(() => this.draw());
  }
}
