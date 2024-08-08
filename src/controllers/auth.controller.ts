import {
  Controller,
  Post,
  Route,
  Body,
  Tags,
  SuccessResponse,
  Query,
  Get,
  Request,
  Res,
  TsoaResponse,
} from "tsoa";

import { SigninRequest, SignupRequest } from "../types/interface";
import authService from "../services/auth.service";
import configs from "../config";
import crypto from "crypto";
import qs from "qs";
import { Request as ExRequest } from "express";

@Route("/api/v1/auth")
@Tags("Auth")
export class AuthController extends Controller {
  @Post("/signup")
  @SuccessResponse("200", "User signed up successfully")
  public async signup(@Body() requestBody: SignupRequest): Promise<any> {
    try {
      const result = await authService.signUp(requestBody);
      return { message: "User signed up successfully", data: result };
    } catch (error) {
      this.setStatus(500); // Set return status to 500
      return { error: "Signup failed" };
    }
  }

  @Post("/verify")
  @SuccessResponse("200", "User verify successfully")
  public async confirmCode(
    @Query() email: string,
    @Query() code: string
  ): Promise<any> {
    try {
      const result = await authService.confirmCode(email, code);
      return result;
    } catch (error) {
      this.setStatus(500);
      return { error: "confirm failed" };
    }
  }

  @Post("/signin")
  @SuccessResponse("200", "User signed in successfully")
  public async signin(@Body() body: SigninRequest): Promise<any> {
    try {
      const result = await authService.signIn(body);
      return { message: "User signed in successfully", data: result };
    } catch (error) {
      this.setStatus(500);
      return { error: "Signin failed" };
    }
  }

  @Get("/google")
  public async ShowConsentScreen(
    @Res() redirect: TsoaResponse<302, void>
  ): Promise<void> {
    const COGNITO_DOMAIN = "https://asdfsad.auth.us-east-1.amazoncognito.com";
    try {
      const redirectURI = `${configs.cognitoCallbackURL}/api/v1/auth/google/callback`;
      const state = crypto.randomBytes(16).toString("hex");
      const params = {
        client_id: configs.cognitoClientId,
        redirect_uri: redirectURI,
        response_type: "code",
        scope: "openid profile email",
        identity_provider: "Google",
        state: state,
      };

      const url = `${COGNITO_DOMAIN}/oauth2/authorize?${qs.stringify(params)}`;
      redirect(302, undefined, { Location: url });
    } catch (error) {
      console.error("Error in ShowConsentScreen:", error);
    }
  }

  @Get("/google/callback")
  public async handleGoogleOAuthCallback(
    @Request() req: ExRequest,
    @Res() badRequest: TsoaResponse<400, { message: string }>,
    @Res() internalServerError: TsoaResponse<500, { message: string }>,
    @Res() success: TsoaResponse<200, any>
  ): Promise<void> {
    const { code } = req.query;

    if (!code) {
      return badRequest(400, { message: "Authorization code is missing." });
    }
    try {
      const tokens = await authService.exchangeGoogleAuthCodeForTokens(
        code as string
      );
      return success(200, tokens);
    } catch (error: any) {
      console.error(
        `AuthController - handleGoogleOAuthCallback() error: ${error.message}`,
        error
      );

      if (error.response) {
        // If the error is from Google's API response
        const errorResponse = error.response.data;
        return badRequest(400, {
          message: `Google OAuth error: ${
            errorResponse.error_description || errorResponse.error
          }`,
        });
      }

      return internalServerError(500, {
        message: "Internal server error during Google OAuth callback.",
      });
    }
  }

  @Get("/facebook")
  public redirectToFacebookOAuth(
    @Request() _req: ExRequest,
    @Res() redirect: TsoaResponse<302, void>
  ): void {
    const cognitoOAuthURL = "https://asdfsad.auth.us-east-1.amazoncognito.com";
    const redirectURI = `${configs.cognitoCallbackURL}/api/v1/auth/facebook/callback`;

    const params = {
      client_id: configs.cognitoClientId,
      redirect_uri: redirectURI,
      response_type: "code",
      scope: "openid profile email",
      identity_provider: "Facebook",
    };

    const url = `${cognitoOAuthURL}/oauth2/authorize?${qs.stringify(params)}`;
    redirect(302, undefined, { Location: url });
  }

  @Get("/facebook/callback")
  public async handleFacebookOAuthCallback(
    @Request() req: ExRequest,
    @Res() badRequest: TsoaResponse<400, { message: string }>,
    @Res() internalServerError: TsoaResponse<500, { message: string }>,
    @Res() success: TsoaResponse<200, any>
  ): Promise<void> {
    const { code } = req.query;

    if (!code) {
      return badRequest(400, { message: "Authorization code is missing." });
    }

    try {
      const tokens = await authService.exchangeFacebookAuthCodeForTokens(
        code as string
      );
      return success(200, tokens);
    } catch (error: any) {
      console.error(
        `AuthController - handleFacebookOAuthCallback() error: ${
          error.message || error
        }`
      );

      if (error.response) {
        const errorResponse = error.response.data;
        return badRequest(400, {
          message: `Facebook OAuth error: ${
            errorResponse.error_description || errorResponse.error
          }`,
        });
      }

      return internalServerError(500, {
        message: "Internal server error during Facebook OAuth callback.",
      });
    }
  }
}
