import { Prisma } from "@prisma/client"


export const userBasicSelect: Prisma.UserSelect = {

        name: true,
        email: true,
        role: true,

    
}

export const userBasicSelectWithId = {

        id: true,
        name: true,
        email: true,
        role: true,
}