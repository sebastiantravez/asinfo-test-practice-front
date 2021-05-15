import { IdentificationType } from "./pages/interface/identificationtype";

export class UsersPresenter {
  constructor(
    public idUser?: string,
    public userName?: string,
    public password?: string,
    public token?: string,
    public usersRolesPresenters?: UsersRolesPresenter[]
  ) { }
}

export class UsersRolesPresenter {
  constructor(
    public name?: string
  ) { }
}

export class BusinessPresenter {
  constructor(
    public idBusiness?: any,
    public businessName?: string
  ){}
}

export class ChargesPresenter {
  constructor(
    public idCharge?: any,
    public name?: string
  ){}
}

export class DepartmentPresenter {
  constructor(
    public idDepartment?: any,
    public nameDepartment?: string
  ){}
}

export class EmployeePresenter {
  constructor(
    public idEmployee?: any,
    public fullName?: string,
    public salary?: number,
    public identificationType?: IdentificationType,
    public identificationNumber?: string,
    public date?: Date,
    public state?: string,
    public businessPresenter?: BusinessPresenter,
    public chargesPresenter?: ChargesPresenter,
    public usersPresenter?: UsersPresenter,
    public departmentPresenter?: DepartmentPresenter,
  ) { }
}

