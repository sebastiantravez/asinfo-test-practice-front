
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from "ngx-spinner";


@Injectable({
    providedIn: 'root'
})

export class NgxSpinner {

    constructor(public spinner: NgxSpinnerService) { }

    showSpinner() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);
    }

    showSpinnerPdf() {
        this.spinner.show();
    }
    
    hideSpinnerPdf() {
        this.spinner.hide();
    }
}