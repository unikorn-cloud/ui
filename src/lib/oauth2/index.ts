export interface Token {
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: number;
}

export interface InternalToken extends Token {
	// This should be an RFC3339 string, so as to be comparable.
	expiry: string;
}
