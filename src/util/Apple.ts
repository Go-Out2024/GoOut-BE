import path from "path";
import AppleAuth from "apple-auth";
import appleConfig from "../../apple-login.json";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
const auth = new AppleAuth(
  appleConfig,
  path.join(__dirname, `../config/${appleConfig.private_key_path}`),
  "text"
);

@Service()
export class Apple {
  public async bringAppleInfo(code: string) {
    console.log(11);
    const response = await auth.accessToken(code);
    console.log(response);
    console.log(22);
    const idToken = jwt.decode(response.id_token);
    console.log(idToken);
    // const email = idToken.email;
    const sub = idToken.sub;
    console.log(sub);
    console.log(33);
    return sub;
  }
}
