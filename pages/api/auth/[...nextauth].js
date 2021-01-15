import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const secret = 'el-mas-grande-sigue-siendo-river-plate'

const options = {
  providers: [
    Providers.Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text', placeholder: 'admin' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        if (
          credentials.username !== 'admin' ||
          credentials.password !== 'Gimel3'
        ) {
          return Promise.resolve(null)
        }

        return Promise.resolve(true)
      },
    }),
  ],

  jwt: {
    // A secret to use for key generation - you should set this explicitly
    // Defaults to NextAuth.js secret if not explicitly specified.
    secret,

    // Set to true to use encryption. Defaults to false (signing only).
    // encryption: true,

    // You can define your own encode/decode functions for signing and encryption
    // if you want to override the default behaviour.
    // encode: async ({ secret, token, maxAge }) => {},
    // decode: async ({ secret, token, maxAge }) => {},
  },

  pages: {
    signIn: '/auth/signin',
    //signOut: '/api/auth/signout',
    error: '/auth/signin', // Error code passed in query string as ?error=
    //verifyRequest: '/api/auth/verify-request', // (used for check email message)
    //newUser: null // If set, new users will be directed here on first sign in
  },

  // Additional options
  secret,
  debug: true, // Use this option to enable debug messages in the console
}

const Auth = (req, res) => NextAuth(req, res, options)

export default Auth
