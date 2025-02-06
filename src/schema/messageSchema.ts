import { z } from "zod";

export const messageSchema= z.object({
    content:z.string().min(10, "content must be atleast 10 length").max(200,"Contnet must be less than 200 length"),
    password:z.string()
})