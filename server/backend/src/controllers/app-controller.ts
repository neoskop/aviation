export abstract class AppController {
    static removeInternalAttributes(obj: any) {
        return JSON.parse(JSON.stringify(obj, (k,v) => (k.startsWith('_'))? undefined : v));
    }
}