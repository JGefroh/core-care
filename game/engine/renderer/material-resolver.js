export default class MaterialResolver {
    constructor(materialRegistry) {
        this.materialRegistry = materialRegistry;
    }

    resolve(renderable) {
        return 'basic-quad';
    }
}