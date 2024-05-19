#  BLOG APP

### Feature

1. Signin ,Singup,ForgotPassword
2. User can Read all the blogs
3. User can write the blog only when he/she is logged in
4. User can save his blog as draft and later he/she can edit or publish his drafts.
5. User who created the blog can only update delete the blog.
6. User can update his details like password,profie image,name,email.
7. Website is responsive

## How to install

1. Open the project.
2. Go to client folder and do npm i
3. Go to server folder and do nmp i
4. Go to server->config folder and make a new file name config.env


```
MONGO_URL:'your mongo atlas url'
JWT_SECRET="your secret key"
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

RESET_PASSWORD_URL=http://localhost:4200/auth/resetPassword
PROJECT_URL=http://localhost:4200/

SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_EMAIL=''
SMTP_PASSWORD=''
FROM_EMAIL=noreply@mean-stack-blog.com
FROM_NAME=Admin

```
