export default class User{
    id:number|null=null
    firstName:string=''
    lastName:string=''
    phone:string=''
    email:string=''
    username:string=''
    roles:string[]=[]
    panel:string=''
    rememberMe:boolean=false

    constructor(data: Partial<User>={}) {
        Object.assign<User,Partial<User>>(this,data)

    }

    get isLoggedIn():boolean{
        return !!this.id
    }

    get isAdmin():boolean{
        return this.roles.includes('admin')
    }

    get fullName():string{
        return this.firstName+' '+this.lastName
    }
}
