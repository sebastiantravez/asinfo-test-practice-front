import { UsersPresenter } from "src/app/models";
import { BusinessPresenter } from "./business";
import { ChargesPresenter } from "./charges";
import { DepartmentPresenter } from "./department";
import { IdentificationType } from "./identificationtype";

export interface EmployeePresenter {
    idEmployee: string,
    fullName,
    salary,
    identificationType: IdentificationType,
    identificationNumber: string,
    date: Date,
    state: string,
    businessPresenter: BusinessPresenter,
    chargesPresenter: ChargesPresenter,
    usersPresenter: UsersPresenter,
    departmentPresenter: DepartmentPresenter,
}