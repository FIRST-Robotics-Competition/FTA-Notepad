# Creating a FTA token

Launch the SQL Server Management Studio. When opened, click "Skip and add accounts later" to
avoid signing in. The following instructions are done with the new connection dialog, so click Yes if prompted
to use the new connection dialog.

Click "Browse" at the top of the connect dialog, then expand on the "Local" category. Select the one ending in
`FRCSQLEXPRESS` which should populate the options below, and then hit "Connect", making sure to select "Trust
Server Certificate".

![Connection dialog in SSMS](img/ssms_connect.png)

Next, click "New Query" in the toolbar and paste in the following SQL query to create a token, making sure
to replace "Your Username" with something for yourself.

```sql
USE [FRC_Prod_2025_V1_System]
GO

INSERT INTO [dbo].[FieldApiAuth]
           ([AuthorizationKey]
           ,[UserName]
           ,[AppType]
           ,[IsActive]
           ,[Organization]
           ,[ContactName]
           ,[ContactEmail]
           ,[CreatedOn]
           ,[CreatedBy]
           ,[ModifiedOn]
           ,[ModifiedBy])
     VALUES
           (NEWID()
           ,'Your Username'
           ,'FTA'
           ,1
           ,'FTA Notepad'
           ,'Field Technical Advisor'
           ,'fta@example.com'
           ,GETDATE()
           ,'System'
           ,GETDATE()
           ,'System')
GO
```

Then, hit "execute" in the toolbar to create your API User:

![Creating a user via query in SSMS](img/ssms_query.png)

Next, we'll need to get the contents of the table that we just added to. Find the "FieldApiAuth" table in the
sidebar, right click and click on "Select".

![Getting to the SSMS query](img/ssms_select.png)

That will then result your Authorization Key and User Name to use within the application:

![Getting to the SSMS query](img/ssms_select_result.png)
