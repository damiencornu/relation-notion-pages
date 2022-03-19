import NextAuth, { NextAuthOptions } from 'next-auth'

const options: NextAuthOptions = {
  providers: [
    {
      id: 'notion',
      name: 'Notion',
      type: 'oauth',
      checks: ['state'],
      authorization: {
        url: 'https://api.notion.com/v1/oauth/authorize',
        params: {
          response_type: 'code',
          owner: 'user',
        },
      },
      token: 'https://api.notion.com/v1/oauth/token',
      userinfo: {
        request(params) {
          // https://developers.notion.com/docs/authorization#exchanging-the-grant-for-an-access-token
          const tokens = params.tokens as any

          const common = {
            workspace_id: tokens.workspace_id,
            workspace_name: tokens.workspace_name,
            workspace_icon: tokens.workspace_icon,
            bot_id: tokens.bot_id,
            ...tokens.owner,
          }

          if (tokens.owner.type === 'user') {
            const commonUser = { ...common, ...tokens.owner.user }
            // User person
            if (tokens.owner.user.type === 'person') {
              return { ...commonUser, ...tokens.owner.user.person }
            }
            // User bot
            return { ...commonUser, ...tokens.owner.user.bot }
          }

          // Workspace bot
          return { id: tokens.bot_id, ...common, ...tokens.owner }
        },
      },
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url,
        }
      },
      clientId: process.env.NOTION_CLIENT_ID,
      clientSecret: process.env.NOTION_CLIENT_SECRET,
    },
  ],
}

export default NextAuth(options)
