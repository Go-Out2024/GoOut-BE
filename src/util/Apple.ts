import path from "path";
import AppleAuth from "apple-auth";
import appleConfig from "../config/apple.json";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
// const auth = new AppleAuth(
//   appleConfig,
//   path.join(
//     __dirname,
//     `../../../../config/apple/${appleConfig.private_key_path}`
//   ),
//   "text"
// );

@Service()
export class Apple {
  public async bringAppleInfo(code: string) {
    // const response = await auth.accessToken(code);
    // const idToken = jwt.decode(response.id_token);
    // // const email = idToken.email;
    // const sub = idToken.sub;
    // return sub;
  }
}
