export class UsersPresenter {
    constructor(
        public user:string,
        public password: string,
        public token: string,
        public usersRolesPresenters:UsersRolesPresenter[]
    ) { }
  }

  export class UsersRolesPresenter {
    constructor(
        name: string
    ) { }
  }


  