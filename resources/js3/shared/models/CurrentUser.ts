import {User} from '@/shared/models'
export default class CurrentUser extends User{
    panel:string=''
    rememberMe:boolean=false

    constructor(data: Partial<CurrentUser>={}) {
        super(data);
        Object.assign<User,Partial<CurrentUser>>(this,data)

    }

    get isLoggedIn():boolean{
        return !!this.id
    }
}
