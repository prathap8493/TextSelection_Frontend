const api_url = process.env.NEXT_PUBLIC_API_URL;
const website_url = process.env.NEXT_PUBLIC_DOMAIN_URL;
const sessionTokenFrontendDomain =
  process.env.NODE_ENV === "development"
    ? "localhost:3000"
    : process.env.NEXT_PUBLIC_SESSION_TOKEN_DOMAIN;

export { api_url, website_url, sessionTokenFrontendDomain };
