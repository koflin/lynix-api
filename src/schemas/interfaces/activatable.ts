export interface Activatable {
    email: string;
    passwordEncrypted: string;
    
    activatedAt: Date;
    lastPasswordResetAt: Date; 
}