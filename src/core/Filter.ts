export class Filter extends PIXI.Filter {

    public static defaultFilterVertex = PIXI.defaultFilterVertex;

    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: { [key: string]: TAny }) {
        super(vertexSrc, fragmentSrc, uniforms);
    }
}