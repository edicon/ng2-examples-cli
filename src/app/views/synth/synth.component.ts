import { Component, provide, ChangeDetectorRef, ElementRef, OnInit, EventEmitter } from '@angular/core';
import { NgClass, Control, ControlGroup, FormBuilder, FORM_PROVIDERS, FORM_DIRECTIVES } from '@angular/common';
import { DataChannel } from '../../services/data-channel';
import { Synth } from '../../scene/synth.scene';
import { ButtonComponent } from '../../components/button/button.component';
import { Media } from "../../schema/media";
import { TrackList } from "../../components/track-list/track-list.component";
import { AudioPlayer } from "../../components/audio-player/audio-player.component";
import { AudioService } from '../../services/media-service';

declare let module: any;

@Component({
  selector: 'view',
  moduleId: module.id,
  templateUrl: 'synth.component.html',
  styleUrls: ['synth.component.css'],
  directives: [ FORM_DIRECTIVES, ButtonComponent, TrackList, AudioPlayer ],
  providers: [FORM_PROVIDERS, AudioService, provide('audioContext', {useValue: new (window['AudioContext'] || window['webkitAudioContext'])})]
})

export class SynthComponent implements OnInit {

  copy: any;
  client: any;
  messages: any;
  isConnected: boolean;
  isConnecting: boolean;
  isButtonDisabled: boolean;
  form: ControlGroup;
  room: Control;
  toggleInvert : number;
  ref: ChangeDetectorRef;
  elem: any;
  world: any;
  message: string;
  tracks: Media[];
  playhead: number;
  controller: EventEmitter<any>;
  currentTrack: any;
  
  constructor(private _ref: ChangeDetectorRef,
              private _el: ElementRef,
              private _fb: FormBuilder,
              private _dataChannel: DataChannel,
              public audioService: AudioService ) {

    this.ref = _ref;
    this.elem = _el.nativeElement;
    this.messages = [];
    this.isConnected = false;
    this.isConnecting = false;
    this.isButtonDisabled = true;
    this.toggleInvert = 1;

    // audio 

    this.playhead = 0;
    this.currentTrack = {};
    
    this.controller = new EventEmitter();

    audioService.get().subscribe(res => {
      this.tracks = res;
      this.currentTrack = this.tracks[this.playhead];
    });

      
    this.copy = {
      headline : 'Synth',
      line1: 'Visit /ui on a mobile device',
      line2: 'Use this code to connect the controller'
    };

    this.client = _dataChannel;
    
    
    this.room = new Control(_dataChannel.config.room);
    
    this.form = _fb.group({
      'room': this.room
    });


    this.onSubscribe();

  }
  ngOnInit() {

    // TODO: internalize all arguments 
    // TODO: make 1 argument with options
    // TODO: figure out how to allow users to provide thier own html / css / js
    // TODO: Hook up a gist
    // TODO: make callback mandatory for messages in user's code

    this.world = new Synth(this.elem.querySelector('video'), 
                            true, 
                            true,
                            [{
                              "camera": "0,-400,400",
                              "shape": "plane",
                              "detail": 1024,
                              "scale" : 1.5,
                              "wireframe": false,
                              "multiplier": 5.0,
                              "displace": 24.0,
                              "origin": "0,0,-100",
                              "opacity": 0.2,
                              "hue": 0,
                              "saturation": 0.75,
                              "bgColor": "#000000"
                          }]);
    
    this.world.setContainer(this.elem.querySelector('.scene'));
    this.world.defaultVideo('/assets/video/kinetic-light.mp4');
    this.world.update();
    
    this.form.valueChanges.subscribe((val) => {
         console.log(JSON.stringify(val));
         if(val.room.length === 5) {
           this.isButtonDisabled = false;
         } else {
           this.isButtonDisabled = true;
         }
    });
    
  }
  onTrackSelected(track: Media): void {
    
    this.playhead = this.tracks.indexOf(track);
    this.currentTrack = this.tracks[this.playhead];

    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
  prevTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead--;
    this.currentTrack = this.tracks[this.playhead];
    
    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
  nextTrack() {
    
    this.playhead = this.tracks.indexOf(this.currentTrack);
    this.playhead++;
    this.currentTrack = this.tracks[this.playhead];
    
    this.controller.emit({
      action: 'play',
      track: this.currentTrack
    });
    
  }
  onKeyDown(ev) {
    

  }
  updateMessages(msg: any) {
    console.log(msg);
    let data : number[] = msg.currentValue;

    if(msg.control === 'player') {
        console.log(msg);
        if(msg.action === 'play' ||
           msg.action === 'prev' ||
           msg.action === 'next') {
           console.log(msg);
           this.playhead = msg.playhead;
           this.currentTrack = msg.track;
           this.controller.emit({
            action: msg.action,
            track: msg.track
          });

        }
      }
    
    if(msg.control === 'joyLeft') {
      if(data[0] < 0) {
        console.log('left');
        this.world.controls.moveLeft = true;
        this.world.controls.moveRight = false;
      } else {
        this.world.controls.moveLeft = false;
      }

      if(data[0] > 0) {
        console.log('right');
        this.world.controls.moveLeft = false;
        this.world.controls.moveRight = true;
      } else {
        this.world.controls.moveRight = false;
      }


      if(data[1] > 0) {
        console.log('forward');
        this.world.controls.moveForward = true;
        this.world.controls.moveBackward = false;
      } else {
        this.world.controls.moveForward = false;
      }

      if(data[1] < 0) {
        console.log('backward');
        this.world.controls.moveBackward = true;
        this.world.controls.moveForward = false;
      } else {
        this.world.controls.moveBackward = false;
      }

    }
    
    if(msg.control === 'joyRight') {
        this.world.controls.mouseX = data[0];
        this.world.controls.mouseY = data[1];
    }
    
    if(msg.control === 'slider') {
      
      this.world.camera.position.y = msg.currentValue * this.toggleInvert;
      
    }
    
   if(msg.control === 'toggle') {
      
     this.toggleInvert = this.toggleInvert === 1 ? -1 : 1;
      
    }
    
    this.messages.push(msg);
    this.ref.detectChanges();
  }
  onClick() {

    if(!this.isConnected) {
        
      this.client.room = this.room.value;
      this.client.sendAnnounce();
      this.isConnecting = true;


    }

  }
  onSubscribe() {

    this.client.emitter.subscribe((message)=>{

      if(message === 'open') {
        this.isConnected = true;
        this.isConnecting = false;

        let msg = JSON.stringify({
            tracks: this.tracks,
            currentTrack: this.currentTrack,
            control: 'tracklist'
          });

          if(this.client && this.client.channel) {
            this.client.channel.send(msg);
          }

        this.client.observer.subscribe((res)=>{
        
          let msg = res[res.length-1].data; 
          console.log(msg);
          this.updateMessages(msg);
          
        });

        this.ref.detectChanges();

      }

    });

  }
}
