import * as z from "zod"

export const SignupValidation = z.object({
    name: z.string().min(2, { messsage: "Name is too short" }),
    username: z.string().min(2, { messsage: "Username is too short" }),
    email: z.string().email(),
    password: z.string().min(8, { messsage: "Password must be atleast 8 characters long" }),
});

export const SigninValidation = z.object({
    email: z.string().email(),
    password: z.string().min(8, { messsage: "Password must be atleast 8 characters long" }),
});

export const PostValidation = z.object({
    caption: z.string().min(5).max(2200),
    file: z.custom(),
    location: z.string().min(2).max(100),
    tags: z.string()
});

export const ProfileValidation = z.object({
    file: z.custom(),
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }),
    username: z.string().min(2, { message: "Username must be at least 2 characters long." }),
    email: z.string().email(),
    bio: z.string(),
});