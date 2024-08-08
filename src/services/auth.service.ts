import configs from "../config";
import authRepository from "../database/repositories/auth.repository";
import { SigninRequest, SignupRequest } from "../types/interface";
import axios from "axios";

class AuthService {
  public async exchangeGoogleAuthCodeForTokens(code: string) {
    const tokenURL = "https://asdfsad.auth.us-east-1.amazoncognito.com/token";

    const params = new URLSearchParams({
      code,
      client_id: configs.cognitoClientId!,
      client_secret: configs.cognitoClientSecret!,
      redirect_uri: `${configs.cognitoCallbackURL}/api/v1/auth/google/callback`,
      grant_type: "authorization_code",
    });

    try {
      const response = await axios.post(tokenURL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error exchanging authorization code:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async exchangeFacebookAuthCodeForTokens(code: string) {
    const tokenURL =
      "https://asdfsad.auth.us-east-1.amazoncognito.com/token";

    const params = new URLSearchParams({
      code,
      client_id: configs.cognitoClientId!,
      client_secret: configs.cognitoClientSecret!,
      redirect_uri: `${configs.cognitoCallbackURL}/api/v1/auth/facebook/callback`,
      grant_type: "authorization_code",
    });

    try {
      const response = await axios.post(tokenURL, params.toString(), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });
      return response.data;
    } catch (error: any) {
      console.error(
        "Error exchanging authorization code:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  public async signUp(body: SignupRequest): Promise<any> {
    try {
      console.log("service", body);

      return await authRepository.signUp(body);
    } catch (error) {
      console.error("Error in AuthService signUp:", error);
      throw new Error("Signup failed");
    }
  }

  public async confirmCode(email: string, code: string): Promise<any> {
    try {
      return await authRepository.confirmCode(email, code);
    } catch (error) {
      throw new Error("confirm failed");
    }
  }

  public async signIn(body: SigninRequest): Promise<any> {
    try {
      return await authRepository.signIn(body);
    } catch (error) {
      console.error("Error in AuthService signIn:", error);
      throw new Error("Signin failed");
    }
  }
}

export default new AuthService();
