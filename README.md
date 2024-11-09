# An inventory management app for a food pantry supporting CRUD operations with AI integration for recipe recommendations.

I'd love feedback and suggestions ;)

## Technologies

Next.js, Firebase, OpenAI, Tailwind, MUI

## To run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

If you would like to tweak the prompts for experimentation purposes, edit `actions.js`

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Your .env file should look like this

```
OPENAI_API_KEY = YOUR_OPENAI_API_KEY //create an account for OpenAI, create a project, generate an API
NEXT_PUBLIC_FIREBASE_API_KEY = YOUR_NEXT_PUBLIC_FIREBASE_API_KEY //these 6 values are retrieved when setting up Firebase DB
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN = YOUR_NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID = YOUR_NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET = YOUR_NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID = YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID = YOUR_NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
```
P.S.: This project's current live deployed version uses my OpenAI credits. You would need to pay for your own app's credits.
## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
