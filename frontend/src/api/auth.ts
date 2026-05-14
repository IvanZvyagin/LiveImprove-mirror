import { postJsonStrict } from './client'
import type { AuthUser } from '../auth/authStorage'

type AuthResponse = {
  id: string
  email: string
  name: string
  token: string
}

function toAuthUser(response: AuthResponse): AuthUser {
  return {
    id: response.id,
    email: response.email,
    name: response.name,
    token: response.token,
  }
}

export async function loginRequest(email: string, password: string): Promise<AuthUser> {
  const response = await postJsonStrict<AuthResponse>('/auth/login', { email, password })
  return toAuthUser(response)
}

export async function registerRequest(
  email: string,
  password: string,
  name?: string,
): Promise<AuthUser> {
  const response = await postJsonStrict<AuthResponse>('/auth/register', {
    email,
    password,
    name: name ?? '',
  })
  return toAuthUser(response)
}
