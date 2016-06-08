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
var conf_1 = require('../../conf');
var core_1 = require('@angular/core');
var common_1 = require('@angular/common');
var data_channel_1 = require('../../services/data-channel');
var terrain_scene_1 = require('../../scene/terrain.scene');
var button_component_1 = require('../../components/button/button.component');
var RemoteUIDemo = (function () {
    function RemoteUIDemo(_ref, _el, _fb) {
        this._ref = _ref;
        this._el = _el;
        this._fb = _fb;
        this.ref = _ref;
        this.elem = _el.nativeElement;
        this.messages = [];
        this.isConnected = false;
        this.isConnecting = false;
        this.isButtonDisabled = true;
        this.toggleInvert = 1;
        this.copy = {
            headline: 'Remote Terrain',
            line1: 'Visit /ui on a mobile device',
            line2: 'Use this code to connect the controller'
        };
        this.room = new common_1.Control(conf_1.default.room);
        this.form = _fb.group({
            'room': this.room
        });
        console.log(conf_1.default);
    }
    RemoteUIDemo.prototype.ngOnInit = function () {
        var _this = this;
        this.world = new terrain_scene_1.TerrainWorld(true, false);
        this.world.setContainer(this.elem.querySelector('.scene'));
        this.form.valueChanges.subscribe(function (val) {
            console.log(JSON.stringify(val));
            if (val.room.length === 5) {
                _this.isButtonDisabled = false;
            }
            else {
                _this.isButtonDisabled = true;
            }
        });
    };
    RemoteUIDemo.prototype.onKeyDown = function (ev) {
    };
    RemoteUIDemo.prototype.updateMessages = function (msg) {
        console.log(msg);
        var data = msg.currentValue;
        if (msg.control === 'joyLeft') {
            if (data[0] < 0) {
                console.log('left');
                this.world.controls.moveLeft = true;
                this.world.controls.moveRight = false;
            }
            else {
                this.world.controls.moveLeft = false;
            }
            if (data[0] > 0) {
                console.log('right');
                this.world.controls.moveLeft = false;
                this.world.controls.moveRight = true;
            }
            else {
                this.world.controls.moveRight = false;
            }
            if (data[1] > 0) {
                console.log('forward');
                this.world.controls.moveForward = true;
                this.world.controls.moveBackward = false;
            }
            else {
                this.world.controls.moveForward = false;
            }
            if (data[1] < 0) {
                console.log('backward');
                this.world.controls.moveBackward = true;
                this.world.controls.moveForward = false;
            }
            else {
                this.world.controls.moveBackward = false;
            }
        }
        if (msg.control === 'joyRight') {
            this.world.controls.mouseX = data[0];
            this.world.controls.mouseY = data[1];
        }
        if (msg.control === 'slider') {
            this.world.camera.position.y = msg.currentValue * this.toggleInvert;
        }
        if (msg.control === 'toggle') {
            this.toggleInvert = this.toggleInvert === 1 ? -1 : 1;
        }
        this.messages.push(msg);
        this.ref.detectChanges();
    };
    RemoteUIDemo.prototype.onClick = function () {
        var _this = this;
        if (!this.isConnected) {
            this.client = new data_channel_1.DataChannel(conf_1.default.room, conf_1.default.username, conf_1.default.server);
            this.isConnecting = true;
            this.client.emitter.subscribe(function (message) {
                if (message === 'open') {
                    _this.isConnected = true;
                    _this.isConnecting = false;
                    _this.client.observer.subscribe(function (res) {
                        var msg = res[res.length - 1].data;
                        console.log(msg);
                        _this.updateMessages(msg);
                    });
                    _this.ref.detectChanges();
                }
            });
        }
    };
    RemoteUIDemo = __decorate([
        core_1.Component({
            selector: 'view',
            moduleId: module.id,
            templateUrl: 'remote-ui-demo.component.html',
            styleUrls: ['remote-ui-demo.component.css'],
            providers: [common_1.FORM_PROVIDERS],
            directives: [common_1.FORM_DIRECTIVES, button_component_1.ButtonComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ChangeDetectorRef, core_1.ElementRef, common_1.FormBuilder])
    ], RemoteUIDemo);
    return RemoteUIDemo;
}());
exports.RemoteUIDemo = RemoteUIDemo;
//# sourceMappingURL=remote-ui-demo.component.js.map