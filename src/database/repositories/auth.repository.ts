import configs from "@/src/config";
import { SigninRequest, SignupRequest } from "@/src/types/interface";

import {
  SignUpCommand,
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";

class AuthRepository {
  private generateSecretHash(username: string): string {
    return crypto
      .createHmac("SHA256", configs.cognitoClientSecret as string)
      .update(username + configs.cognitoClientId)
      .digest("base64");
  }
  private cognitoClient = new CognitoIdentityProviderClient({
    region: configs.region,
  });

  public async signUp(body: SignupRequest): Promise<any> {
    // const allowedAttributes = ["email", "username", "password"];

    // const attributes = Object.keys(body)
    //   .filter((key) => allowedAttributes.includes(key))
    //   .map((key) => ({
    //     Name: key,
    //     Value: body[key as keyof SignupRequest],
    //   }));

    const username = body.email as string;

    // const params: SignUpCommandInput = {
    //   ClientId: configs.cognitoClientId,
    //   SecretHash: this.generateSecretHash(username),
    //   Username: username, // Use email as the Cognito username
    //   Password: body.password,
    //   UserAttributes: attributes,
    // };

    const params = new SignUpCommand({
      ClientId: configs.cognitoClientId,
      SecretHash: this.generateSecretHash(username),
      Username: body.email,
      Password: body.password,
      UserAttributes: [
        {
          Name: "given_name",
          Value: `${body.email} ${body.username} ${body.password}`,
        },
        { Name: "name", Value: `${body.username} ${body.password} ` }, // Add name.formatted attribute
        { Name: "zoneinfo", Value: `${body.username} ${body.password}` }, // Add name.formatted attribute
      ],
    });

    const response = await this.cognitoClient.send(params);
    return response;

    // try {
    //   const command = new SignUpCommand(params);
    //   const response = await cognitoClient.send(command);
    //   return response;
    // } catch (error) {
    //   throw error;
    // }
  }

  public async confirmCode(email: string, code: string): Promise<any> {
    const SecretHash = await this.generateSecretHash(email);

    const params = new ConfirmSignUpCommand({
      ClientId: configs.cognitoClientId,
      SecretHash: SecretHash,
      Username: email,
      ConfirmationCode: code,
    });

    this.cognitoClient.send(params);
    return "confirm successfully!";
  }

  public async signIn(body: SigninRequest): Promise<any> {
    const secretHash = this.generateSecretHash(body.email);

    const params = new InitiateAuthCommand({
      AuthFlow: "USER_PASSWORD_AUTH",
      ClientId: configs.cognitoClientId,
      AuthParameters: {
        USERNAME: body.email,
        PASSWORD: body.password,
        SECRET_HASH: secretHash,
      },
    });

    try {
      const response = await this.cognitoClient.send(params);
      console.log("SignUp response:", response);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthRepository();
