import path from "path";
import AppleAuth from "apple-auth";
import jwt from "jsonwebtoken";
import { Service } from "typedi";
import fs from "fs";

@Service()
export class Apple {
  public async bringAppleInfo(code: string) {
    const appleConfig = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, "../../apple-login.json"), "utf8")
    );
    console.log(appleConfig);
    const auth = new AppleAuth(
      appleConfig,
      fs.readFileSync("AuthKey_3XKY6BPF52.p8").toString(),
      "text"
    );
    console.log(auth);
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
