import * as BABYLON from '@babylonjs/core';
import * as MATERIAL from '@babylonjs/materials';

export class Tween {
    public static frameRate:number = 30;

    static createTween(scene: BABYLON.Scene, target : any, targetProperty:string, startValue:any, endValue:any, duration:number, loop:boolean, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let totalFrame = this.frameRate*duration; // redundant
        let animation = this.createAnimation(target, targetProperty, startValue, endValue, duration, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, easingFunction, easingMode);
        let animTable = new BABYLON.Animatable(scene, target, 0, totalFrame, loop, 1, ()=>{}, [animation]);
        animTable.pause();
        return animTable;
    }

    static addTween(animManager: BABYLON.Animatable, target : any, targetProperty:string, startValue:any, endValue:any, duration:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN){

        let animation = this.createAnimation(target, targetProperty, startValue, endValue, duration, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE, easingFunction, easingMode);

        animManager.appendAnimations(target, [animation]);
        
    }

    private static createAnimation (target : any, targetProperty:string, 
                            startValue:any, endValue:any, 
                            duration:number, loopMode:number, easingFunction?:BABYLON.EasingFunction, easingMode:number=BABYLON.EasingFunction.EASINGMODE_EASEIN) : BABYLON.Animation {
        
        if(startValue.constructor !== endValue.constructor){
            throw new Error("Tween: start and end values should be of the same type! type of: " + startValue.constructor + ", " + endValue.constructor);
        }
        let animation_type = this.inferAnimationType(startValue);
        if(animation_type === null)
            throw new Error("Tween: the value type (endValue/startValue) is not supported!")

        let totalFrame = this.frameRate*duration;
        let animation = new BABYLON.Animation("Tween." + target.name + "." + targetProperty, 
                                                targetProperty, this.frameRate, 
                                                animation_type, loopMode);

        let keyFrames = []; 

        keyFrames.push({
            frame: 0,
            value: startValue,
        });

        keyFrames.push({
            frame: totalFrame,
            value: endValue,
        });

        animation.setKeys(keyFrames);
        
        if(easingFunction){
            easingFunction.setEasingMode(easingMode);
            animation.setEasingFunction(easingFunction);
        }

        return animation
    }

    public static inferAnimationType(variable:any): number | null {
        // could add MATRIX, SIZE, etc...
        if(variable instanceof BABYLON.Vector3){
            return BABYLON.Animation.ANIMATIONTYPE_VECTOR3;
        }
        else if (variable instanceof BABYLON.Color3){
            return BABYLON.Animation.ANIMATIONTYPE_COLOR3;
        }
        else if(variable instanceof BABYLON.Vector2){
            return BABYLON.Animation.ANIMATIONTYPE_VECTOR2;
        }
        else if(variable instanceof BABYLON.Quaternion){
            return BABYLON.Animation.ANIMATIONTYPE_QUATERNION;
        }
        else if((typeof variable  == 'number')){
            return BABYLON.Animation.ANIMATIONTYPE_FLOAT;
        }
        else{
            return null
        }
    }

}