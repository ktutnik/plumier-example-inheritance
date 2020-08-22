import { CustomAuthorizerFunction as Auth } from "plumier"

// filter specific property only owner of data can access the data
export const ownerOnly : Auth = ({user, parentValue}) => user.userId === parentValue.id