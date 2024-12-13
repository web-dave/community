import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { INode } from 'models/node.interface';
import { GameService } from './game.service';
import { Unit } from './Bloxx/unit';
import { BankService } from './bank.service';
import { Stairs } from './Bloxx/stairs';
import { Flat } from './Bloxx/flat';
import { Office } from './Bloxx/office';
import { Shopping } from './Bloxx/shopping';
import { School } from './Bloxx/school';
import { Safety } from './Bloxx/safety';
import { Attractions } from './Bloxx/attractions';

@Directive({
    selector: '[stNode]',
    standalone: false
})
export class NodeDirective {
  @Input() stNode!: INode;
  @Input() connected = false;

  @HostListener('click')
  boom() {
    if (this.bank.isAffordable(this.engine.activeBlock)) {
      switch (this.engine.activeBlock) {
        case 'unit':
          if (!this.stNode.unit) {
            if (this.engine.isAbleToStart(this.stNode.floor, this.stNode.id)) {
              this.stNode.unit = new Unit(
                this.stNode,
                this.elementRef.nativeElement as HTMLDivElement,
                this.bank,
                this.engine
              );
            }
          }
          break;
        case 'pointer':
          console.log(this.stNode);
          break;
        case 'stairs':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Stairs(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'flat':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Flat(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'office':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Office(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'shopping':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Shopping(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'school':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new School(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'attractions':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Attractions(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        case 'safety':
          if (this.stNode.unit && !this.stNode.unit?.tenant?.node) {
            this.stNode.unit.tenant = new Safety(
              this.stNode,
              this.elementRef.nativeElement as HTMLDivElement,
              this.engine,
              this.bank
            );
          }
          break;
        default:
          console.error('Unknown Block', this.engine.activeBlock, this.stNode);
          break;
      }
    } else {
      switch (this.engine.activeBlock) {
        case 'pointer':
          if (this.stNode.unit) {
            if (
              this.stNode.unit.dom.classList.contains('flat') ||
              this.stNode.unit.dom.classList.contains('office') ||
              this.stNode.unit.dom.classList.contains('shopping') ||
              this.stNode.unit.dom.classList.contains('school') ||
              this.stNode.unit.dom.classList.contains('safety') ||
              this.stNode.unit.dom.classList.contains('attractions')
            ) {
              const classList = this.stNode.unit.dom.classList.value
                .replace('node unit ', '')
                .split(' ');
              this.engine.showDialog(classList);
            }
          }
          break;
      }
    }
  }

  constructor(
    private engine: GameService,
    private elementRef: ElementRef,
    public bank: BankService
  ) {}
}
