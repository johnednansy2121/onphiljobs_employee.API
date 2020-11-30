import { userSchema } from './user'
import IUser from '../schema/IUser'
import { Connection } from 'mongoose'
import IRole from '../schema/IRole'
import { RoleSchema } from './role'
import { ScopeSchema } from './scope'
import IScope from '../schema/IScope'
import { OrganizationSchema, IOrganization } from './organization'
import { IProfile, ProfileSchema } from './profile'
import { IClient, ClientSchema } from './client'
import { JobSchema, IJob } from './job'
import { ApplicationSchema } from './application'
import { IApplication } from '../schema/IApplication'
import { ApplicationInviteSchema } from './application.invite'
import { IApplicationInvite } from '../schema/IApplicationInvite'


export default (db : Connection) => {
    return {
        UserModel : db.model<IUser>('user', userSchema),
        RoleModel : db.model<IRole>('role', RoleSchema),
        ScopeModel: db.model<IScope>('scope', ScopeSchema),
        OrganizationModel: db.model<IOrganization>('organization', OrganizationSchema),
        ProfileModel: db.model<IProfile>('profile', ProfileSchema),
        ClientModel: db.model<IClient>('client', ClientSchema),
        JobModel: db.model<IJob>('job', JobSchema),
        ApplicationModel: db.model<IApplication>('application', ApplicationSchema),
        ApplicationInviteModel: db.model<IApplicationInvite>('application.invite', ApplicationInviteSchema)
    }
}