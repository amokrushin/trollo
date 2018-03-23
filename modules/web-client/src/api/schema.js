import { schema } from 'normalizr';

export const user = new schema.Entity('users');
export const organization = new schema.Entity('organizations');
export const organizationMember = new schema.Entity('organizationMembers', { user, organization });
export const board = new schema.Entity('boards', { organization });

user.define({
    memberships: [organizationMember],
});

organization.define({
    boards: [board],
    members: [organizationMember],
});
