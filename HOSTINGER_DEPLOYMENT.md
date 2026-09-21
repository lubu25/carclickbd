# Hostinger deployment

This project is a Next.js Node.js application. It must be added in Hostinger as a
Node.js web application, not as a static website.

## 1. Push the project to GitHub

Push the complete repository, including `package.json`, `package-lock.json`, `server.js`,
`next.config.mjs`, `src`, and `public`. Do not push `.env` files.

## 2. Create the Hostinger application

In Hostinger hPanel:

1. Open **Websites** and create a **Node.js** application.
2. Select Node.js `20` or newer.
3. Connect the GitHub repository, or deploy the repository files into the application root.
4. Set the application root to the folder containing `package.json`.
5. Set the startup file to `server.js`.
6. Set the build command to `npm run build`.
7. Set the start command to `npm start` if Hostinger shows a separate start command.
8. Add this environment variable:

   ```text
   BACKEND_API_BASE_URL=https://carclickbd-backend.jdmcarworld.com/api/v1
   ```

9. Deploy or restart the application.

The application automatically reads Hostinger's `PORT` value and binds to `0.0.0.0`.
Do not hardcode a port in Hostinger.

## 3. Verify the deployment

After the domain is connected, open the home page and `/cars`. Product requests should
go through `/api/backend/product`, while product images should use `/api/media/...`.
The backend remains at its existing URL and is not changed.

## Important

Do not use GitHub Pages for this project. GitHub Pages is static-only and cannot run the
Next.js server proxy required because the backend does not currently provide browser CORS
headers.