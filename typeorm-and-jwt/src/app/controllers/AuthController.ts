import { Request, Response } from "express";
import { getRepository } from "typeorm";
import bcrypy from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/Users";

class AuthController {
  async authenticate(req: Request, res: Response) {
    const repository = getRepository(User);
    const { email, password } = req.body;

    const user = await repository.findOne({ where: { email } });

    if (!user) {
      return res.sendStatus(401);
    }

    const isValidPassowrd = await bcrypy.compare(password, user.password);

    if (!isValidPassowrd) {
      return res.sendStatus(401);
    }

    const token = jwt.sign({ id: user.id }, "secret", { expiresIn: "1d" });

    return res.json({
      id: user.id,
      email: user.email,
      token,
    });
  }
}

export default new AuthController();
