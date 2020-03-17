export class Filter extends PIXI.Filter{

   constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: {[key: string]: any})
   {
       super(vertexSrc, fragmentSrc,uniforms);
   }
}