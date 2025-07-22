import { AppDataSource } from "../data-source";
import { JwtGateway } from "../gateway/jwt/jwt.gateway";
import { UserRepository } from "../repository/User/user.repository";


export async function checkAuth(req, res, next) {
    const authorizationHeader =
    req.headers["Authorization"] ?? req.headers["authorization"];

  if (!authorizationHeader) return res.sendStatus(401);

  const token = authorizationHeader.split(" ")[1];
  if (!token) return res.sendStatus(401);

  const jwt = new JwtGateway(process.env.JWT_SECRET);
    try {
  const payload = await jwt.verify(token);
  if (!payload) return res.sendStatus(401);

  const user = await new UserRepository(AppDataSource.getRepository("User")).findById(payload.sub);
  if (!user) return res.sendStatus(401);

  req.user = user;
console.log("User authenticated:", user.id);
  next();
    } catch (error) {
        console.error("Authentication error:", error);
        return res.sendStatus(401);
    }
}