import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[carouselItem]'
})
export class DashboardRotationItemDirective {

    constructor( public tpl : TemplateRef<any> ) {
    }

}
