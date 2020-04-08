export class Filter extends vf.Filter {

    public static isFilter = true;
    public static defaultFilterVertex = vf.defaultFilterVertex;
    public static list = new Map<string,boolean>();

    constructor(vertexSrc?: string, fragmentSrc?: string, uniforms?: { [key: string]: any }) {
        super(vertexSrc, fragmentSrc, uniforms);
    }
}