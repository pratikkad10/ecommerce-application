import type { Prisma, User, Address } from "../generated/prisma/client";

// Standard User type (No relations included)
export type UserType = User;

// Standard Address type
export type AddressType = Address;

// User type with the addresses array included
// Automatically infers the exact shape returned when you use `include: { addresses: true }` in Prisma
export type UserWithAddresses = Prisma.UserGetPayload<{
    include: { addresses: true }
}>;