import { Prisma } from "@prisma/client";
import { userBasicSelect } from "../user/user.select";


export const categorySelect: Prisma.CategorySelect = {
    name: true,
    description: true,
    createdAt: true,
    updatedAt: true,
    _count: {
        select: {
            products: true,
        },
    },

    creator: {
        select: userBasicSelect,
    },
    updater: {
        select: userBasicSelect
    },
}