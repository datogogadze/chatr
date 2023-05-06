export class AccessToken {
  access_token: string;
}

export class RefreshToken {
  refresh_token: string;
}

export class TokenDto {
  access_token: string;
  refresh_token: string;
  user_id: string;
}
