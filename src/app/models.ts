export class UsersPresenters {
    constructor(
        public user:string,
        public password: string,
        public token: string,
        public usersRolesPresenters:[]
    ) { }
  }