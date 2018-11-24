USE [MyAngulrAppStorage]
GO

/****** Object: Table [dbo].[Orders] Script Date: 11/24/2018 1:39:26 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

Update Orders set Status = 0 where Status = 1;

