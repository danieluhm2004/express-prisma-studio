# Express Prisma Studio

You can embed Prisma Studio within your Express application.

## How to use?

### Install packages

`npm install express-prisma-studio` or `yarn add express-prisma-studio`

### Add Express Middleware.

You can import it and use it as follows.

```javascript
import express from 'express';
import { PrismaStudioMiddleware } from 'express-prisma-studio';
import { PrismaClient } from '@prisma/client';

const app = express();

const prisma = new PrismaClient();
app.use('/prisma', PrismaStudioMiddleware(prisma));

app.listen(3000, () => {
  console.log('Server is ready: http://localhost:3000');
});
```

Congratulations. Now, if you connect to the middleware address you set, Prisma Studio will be displayed automatically.
