import {
    AfterViewInit,
    Component,
    ContentChildren,
    Directive,
    ElementRef,
    Inject,
    Input,
    OnInit,
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
    @ViewChild('slidecircles') private slideCircles: ElementRef;
    @ViewChild('slideName') private slideName: ElementRef;
    @Input() timing = '350ms ease-in';
    @Input() showControls = true;
    @Input() projectId;
    @Input('childs') childs: Project[];
    addSlideDialogRef: MatDialogRef<AddDashboardDialogComponent>;
    private player: AnimationPlayer;
    private itemWidth: number;
    private currentSlide = 0;
    carouselWrapperStyle = {};
    private cpt = 0;
    private autoPlay = true;
    private sub;

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
        if ( this.currentSlide + 1 === this.items.length ) {
            offset = 0;
            this.currentSlide = 0;
        } else {
            this.currentSlide = (this.currentSlide + 1) % this.items.length;
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
    }

    clickDots(item) {
        this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/slide.png';
        this.currentSlide = item;
        const offset = item * (this.itemWidth);
        this.animate(offset);
    }

    handleNext() {
        this.cpt += 10;

        this.cpt = 0;
        this.next();
    }

    openAddSlideDialog() {
        this.addSlideDialogRef = this.matDialog.open(AddDashboardDialogComponent, {
            minWidth: 900,
            minHeight: 500,
        });
        this.addSlideDialogRef.componentInstance.showProjectTypes = false;
        this.addSlideDialogRef.componentInstance.parentId = this.projectId;
    }

    private buildAnimation( offset ) {
        return this.builder.build([
            animate(this.timing, style({ transform: `translateX(-${offset}px)` }))
        ]);
    }

    prev() {
        this.slideCircles.nativeElement.children[this.currentSlide].src = '../../../../../assets/images/slide.png';
        let offset;
        if ( this.currentSlide === 0 ) {
            offset = (this.items.length - 1) * (this.itemWidth);
            this.currentSlide = this.items.length - 1;
        } else {
            this.currentSlide = ((this.currentSlide - 1) + this.items.length) % this.items.length;
            offset = this.currentSlide * (this.itemWidth);
        }

        this.animate(offset);
    }

    constructor( private builder: AnimationBuilder, private matDialog: MatDialog, ) {}

    ngAfterViewInit() {
        setTimeout(() => {
            this.carousel.nativeElement.style.width = this.items.length + '00%';
            this.slideCircles.nativeElement.children[0].src = '../../../../../assets/images/current-slide-blue.png';
            this.slideName.nativeElement.innerHTML = this.childs[0].name;
            if (this.showControls) {
                this.itemWidth = this.itemsElements.first.nativeElement.getBoundingClientRect().width;
            } else {
                this.itemWidth = window.innerWidth - 20;
            }
            this.carouselWrapperStyle = {
                width: `${this.itemWidth}px`
            };
        });

        //INITIAL CONDITIONS
        this.sub = Observable.interval(10000)
            .subscribe((val) => { this.handleNext(); });

    }

}
