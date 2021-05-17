export interface UserValidationView {
    valuePassword: string;
    containMayus: string;
    containNumber: string;
    containLong: string;
    containSpace: string;
    errorPassMayus: boolean;
    errorPassNumber: boolean;
    errorPassLong: boolean;
    errorPassSpace: boolean;
}