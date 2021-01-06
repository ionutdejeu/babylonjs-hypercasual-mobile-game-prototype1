
import * as BABYLON from '@babylonjs/core';
import {Tween} from './tween';
import * as MATERIAL from '@babylonjs/materials';
import * as GUI from '@babylonjs/gui';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class Player { 

    private _scene:BABYLON.Scene;
    private _idleAnim:BABYLON.Animation;
    private _m:BABYLON.Mesh;
    private _frameRate:number = 10;
    jumpTrajectoryAnimationPosition:BABYLON.Animation;
    jumpTrajectoryAnimationRotation:BABYLON.Animation;
    animGroup:BABYLON.AnimationGroup;

    constructor(scene:BABYLON.Scene){
        this._m = this.createMesh(scene);
        this._scene = scene;
        this._idleAnim = this.createIdleScaleAnimations();
        let move = this.createIdlBobAnimations();
        scene.beginDirectAnimation(this._m, [this._idleAnim,move], 0, 2 * this._frameRate, true);
        
    }

    private createJumpAnimation(){
        this.jumpTrajectoryAnimationRotation = new BABYLON.Animation("animPos", "position", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        this.jumpTrajectoryAnimationPosition = new BABYLON.Animation("animRot", "rotation", 10, BABYLON.Animation.ANIMATIONTYPE_VECTOR3, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);	
    }

    public createIdleScaleAnimations():BABYLON.Animation{
        //this._idleAnim = Tween.createTween(this._scene,this._m,"scale.x")
        let idle_animation =   new BABYLON.Animation("player_idle_animation", "scaling.y", this._frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesR = []; 

        keyFramesR.push({
            frame: 0,
            value: 1
        });
    
        keyFramesR.push({
            frame: this._frameRate,
            value: 1.2
        });
    
        keyFramesR.push({
            frame: 2 * this._frameRate,
            value: 1
        });
    
    
        idle_animation.setKeys(keyFramesR);

        return idle_animation;
    
    }

    public createIdlBobAnimations():BABYLON.Animation{
        //this._idleAnim = Tween.createTween(this._scene,this._m,"scale.x")
        let idle_animation =   new BABYLON.Animation("player_idle_animation_movement", "position.y", this._frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
        var keyFramesR = []; 

        keyFramesR.push({
            frame: 0,
            value: 1
        });
    
        keyFramesR.push({
            frame: this._frameRate,
            value: 1.2
        });
    
        keyFramesR.push({
            frame: 2 * this._frameRate,
            value: 1
        });
    
    
        idle_animation.setKeys(keyFramesR);

        return idle_animation;
    
    }

    
    public createMesh(scene:BABYLON.Scene):BABYLON.Mesh{
        let player = BABYLON.Mesh.CreateSphere("playerSphere",10,4,scene);
        var pbr = new BABYLON.PBRMetallicRoughnessMaterial("pbr", scene);
        pbr.baseColor = new BABYLON.Color3(1.0, 0.766, 0.336);
        pbr.metallic = 0;
        pbr.roughness = 1.0;
        player.material = pbr;
        return player;
    }



}