import {
    AfterViewInit,
    Component,
    ContentChildren,
    Directive,
    ElementRef, EventEmitter,
    Inject,
    Input,
    OnInit, Output,
    QueryList,
    TemplateRef,
    ViewChild,
    ViewChildren
} from '@angular/core';
import { animate, AnimationBuilder, AnimationFactory, AnimationPlayer, style } from '@angular/animations';
import {DashboardRotationItemDirective} from './dashboard-rotation-item.directive';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatButtonModule} from '@angular/material/button';
import {AddDashboardDialogComponent} from '../../../home/components/add-dashboard-dialog/add-dashboard-dialog.component';
import {MatDialog, MatDialogRef} from '@angular/material';
import {Project} from '../../../../shared/model/dto/Project';
import {DashboardService} from '../../dashboard.service';

@Directive({
    selector: '.carousel-item'
})
export class CarouselItemElement {}

@Component({
    selector: 'app-dashboard-rotation',
    exportAs: 'carousel',
    templateUrl: './dashboard-rotation.component.html',
    styleUrls: ['./dashboard-rotation.component.css']
})
export class DashboardRotationComponent implements AfterViewInit {
    @ContentChildren(DashboardRotationItemDirective) items: QueryList<DashboardRotationItemDirective>;
    @ViewChildren(CarouselItemElement, { read: ElementRef }) private itemsElements: QueryList<ElementRef>;
    @ViewChild('carousel') private carousel: ElementRef;
    @ViewChild('slidecircles') slideCircles: ElementRef;
    @ViewChild('slideName') slideName: ElementRef;
    @ViewChild('divDots') private divDots: ElementRef;
    @Input() timing = '350ms ease-in';
    @Input() showControls = true;
    @Input() projectId;
    @Input('childs') childs: Project[];
    @Input() addSlide: Function;
    addSlideDialogRef: MatDialogRef<AddDashboardDialogComponent>;
    private player: AnimationPlayer;
    private itemWidth: number;
    private currentSlide = 0;
    carouselWrapperStyle = {};
    private cpt = 0;
    private autoPlay = true;
    private sub;
    private nbItems;


    playHandler() {
        this.autoPlay = !this.autoPlay;
        if (this.autoPlay) { //CHECKBOX CHECKED
            this.cpt = 0;
            this.sub = Observable.interval(10000).subscribe((val) => { this.handleNext(); });
        } else { //CHECKBOX UNCHECKED
            this.sub.unsubscribe();
        }
    }


    next() {
        this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/slide.png';
        let offset;
        if ( this.currentSlide + 1 === this.nbItems ) {
            offset = 0;
            this.currentSlide = 0;
        } else {
            this.currentSlide = (this.currentSlide + 1) % this.nbItems;
            offset = this.currentSlide * (this.itemWidth);
        }

        this.animate(offset);
    }

    animate(offset) {
        const myAnimation: AnimationFactory = this.buildAnimation(offset);
        this.player = myAnimation.create(this.carousel.nativeElement);
        this.player.play();
        this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/current-slide-blue.png';
        this.slideName.nativeElement.innerHTML = this.childs[this.currentSlide].name;
        this.dashboardService.currentSlideSubject.next(this.childs[this.currentSlide]);
        if(!this.showControls) {
            setTimeout(() => {
                this.animateDivDots(-55);
            }, 5000);
        }

    }

    animateDivDots(offset) {
        const divDotsAnimation: AnimationFactory = this.buildDivDotsAnimation(offset);
        this.player = divDotsAnimation.create(this.divDots.nativeElement);
        this.player.play();
    }

    clickDots(item) {
        if (this.showControls) {
            this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/slide.png';
            this.currentSlide = item;
            const offset = item * (this.itemWidth);
            this.animate(offset);
        }
    }

    updateCarouselSize(){
        this.nbItems++;
        this.carousel.nativeElement.style.width = this.nbItems + '00%';
    }

    handleNext() {
        this.cpt += 10;

        if (this.cpt >= this.childs[this.currentSlide].duration) {
            this.cpt = 0;
            if (this.nbItems > 1) {
                this.next();
                if (!this.showControls) {
                    this.animateDivDots(0);
                }
            }
        }
    }

    openAddSlideDialog() {
        this.addSlideDialogRef = this.matDialog.open(AddDashboardDialogComponent, {
            minWidth: 900,
            minHeight: 500,
        });
        this.addSlideDialogRef.componentInstance.showProjectTypes = false;
        this.addSlideDialogRef.componentInstance.parentId = this.projectId;
        const subscriber = this.addSlideDialogRef.componentInstance.onAdd.subscribe(() => {
            this.addSlide();
        });
    }

    private buildAnimation( offset ) {
        return this.builder.build([
            animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
        ]);
    }

    private buildDivDotsAnimation(offset) {
        return this.builder.build([
            animate(this.timing, style({transform: `translateY(${offset}px)`}))
        ]);
    }

    prev() {
        this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/slide.png';
        let offset;
        if ( this.currentSlide === 0 ) {
            offset = (this.nbItems - 1) * (this.itemWidth);
            this.currentSlide = this.nbItems - 1;
        } else {
            this.currentSlide = ((this.currentSlide - 1) + this.nbItems) % this.nbItems;
            offset = this.currentSlide * (this.itemWidth);
        }

        this.animate(offset);
    }

    constructor( private builder: AnimationBuilder, private matDialog: MatDialog, private dashboardService: DashboardService) {}

    ngAfterViewInit() {

        setTimeout(() => {
            this.nbItems = this.items.length;
            this.carousel.nativeElement.style.width = this.nbItems + '00%';
            if (this.slideCircles.nativeElement.children.length > 0) {
                this.slideCircles.nativeElement.children[0].src = '../../../../../assets/images/current-slide-blue.png';
            }
            if(this.childs.length > 0) {
                this.slideName.nativeElement.innerHTML = this.childs[0].name;
                this.dashboardService.currentSlideSubject.next(this.childs[0]);
            }
            if (!this.showControls) {
                this.divDots.nativeElement.classList.add( 'floating');
                this.divDots.nativeElement.style.marginLeft = ((window.innerWidth - 40) / 2) - (this.divDots.nativeElement.getBoundingClientRect().width / 2) + 'px';
                setTimeout(() => {
                    this.animateDivDots(-55);
                }, 5000);
            }
            if (this.showControls && this.itemsElements.length > 0) {
                this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
            } else {
                this.itemWidth = window.innerWidth - 40;
            }
            this.carouselWrapperStyle = {
                width: `${this.itemWidth}px`
            };
        }, 100);

        //INITIAL CONDITIONS
        this.sub = Observable.interval(10000)
            .subscribe((val) => { this.handleNext(); });
    }


}
