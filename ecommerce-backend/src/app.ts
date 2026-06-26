import express, { type Request, type Response } from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());


// app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Server is running" });
});

// app.use(errorMiddleware);

export default app;