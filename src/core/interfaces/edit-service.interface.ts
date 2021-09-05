export interface EditService {
    edit: (id: string, object: any) => Promise<any>; 
}