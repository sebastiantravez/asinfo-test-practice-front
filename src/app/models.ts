import { IdentificationType } from "./pages/interface/identificationtype";

export class UsersPresenter {
  constructor(
    public idUser?: string,
    public userName?: string,
    public password?: string,
    public token?: string,
    public usersRolesPresenters?: UsersRolesPresenter[],
    public rolesPresenter?:RolesPresenter[]
  ) { }
}

export class UsersRolesPresenter {
  constructor(
    public name?: string
  ) { }
}

export class RolesPresenter {
  constructor(
    public idRol?: string,
    public name?: string
  ) { }
}

export class BusinessPresenter {
  constructor(
    public idBusiness?: any,
    public businessName?: string
  ) { }
}

export class ChargesPresenter {
  constructor(
    public idCharge?: any,
    public name?: string
  ) { }
}

export class DepartmentPresenter {
  constructor(
    public idDepartment?: any,
    public nameDepartment?: string
  ) { }
}

export class EmployeePresenter {
  constructor(
    public idEmployee?: any,
    public fullName?: string,
    public salary?: number,
    public email?: string,
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

export class Credentials {
  constructor(
    public name: string,
    public code: string
  ) { }
}

export class CrudValidations {
  constructor(
    public buttonCreate: boolean,
    public buttonUpdate: boolean,
    public buttonDelete: boolean
  ) { }
}