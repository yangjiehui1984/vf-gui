export class Filter extends PIXI.Filter {

    public static isFilter = true;
    public static defaultFilterVertex = PIXI.defaultFilterVertex;
    public static list = new Map<string,boolean>();

    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: { [key: string]: TAny }) {
        super(vertexSrc, fragmentSrc, uniforms);
    }
}