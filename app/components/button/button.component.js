"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var ButtonComponent = (function () {
    function ButtonComponent(_el) {
        this.elem = _el.nativeElement;
    }
    ButtonComponent.prototype.ngOnInit = function () {
        if (this.options) {
            if (this.options.position) {
                this.elem.style.position = this.options.position;
            }
            if (this.options.x) {
                this.elem.style.left = this.options.x;
            }
            if (this.options.y) {
                this.elem.style.top = this.options.y;
            }
        }
    };
    ButtonComponent.prototype.onClick = function (ev) {
        if (this.options) {
            this.options.onClick(ev);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ButtonComponent.prototype, "options", void 0);
    ButtonComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'ui-button',
            templateUrl: 'button.component.html',
            styleUrls: ['button.component.css']
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef])
    ], ButtonComponent);
    return ButtonComponent;
}());
exports.ButtonComponent = ButtonComponent;
//# sourceMappingURL=button.component.js.map