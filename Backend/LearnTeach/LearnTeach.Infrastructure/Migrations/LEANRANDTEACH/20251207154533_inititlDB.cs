using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearnTeach.Infrastructure.Migrations.LEANRANDTEACH
{
    /// <inheritdoc />
    public partial class inititlDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Badges",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    IconUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    MinRating = table.Column<int>(type: "int", nullable: false),
                    MaxRating = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Badges", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CATEGORIESS",
                columns: table => new
                {
                    CateId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CATEGORI__27638D14D2BAC615", x => x.CateId);
                });

            migrationBuilder.CreateTable(
                name: "CERTIFICATES",
                columns: table => new
                {
                    CERID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    CERName = table.Column<string>(type: "nvarchar(250)", maxLength: 250, nullable: false),
                    InstatutionName = table.Column<string>(type: "varchar(250)", unicode: false, maxLength: 250, nullable: true),
                    EarnedYear = table.Column<int>(type: "int", nullable: true, defaultValueSql: "(datepart(year,getdate()))"),
                    CERPic = table.Column<string>(type: "varchar(350)", unicode: false, maxLength: 350, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CERTIFIC__5D4205583D8E74AF", x => x.CERID);
                });

            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ChatId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    SenderId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ReceiverId = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Text = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DiamondPackages",
                columns: table => new
                {
                    DiamondPackageId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    DiamondAmount = table.Column<int>(type: "int", nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Currency = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiamondPackages", x => x.DiamondPackageId);
                });

            migrationBuilder.CreateTable(
                name: "FEEDBACK",
                columns: table => new
                {
                    FEEDBACKID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FEEDBACKRANGE = table.Column<int>(type: "int", nullable: false),
                    FEEDBACKDETAILS = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__FEEDBACK__7074B31EE5D386DA", x => x.FEEDBACKID);
                });

            migrationBuilder.CreateTable(
                name: "PACKAGE",
                columns: table => new
                {
                    PACKAGEId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PACKAGENAME = table.Column<string>(type: "varchar(80)", unicode: false, maxLength: 80, nullable: false),
                    PACKAGEDETAILS = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    PACKAGEDURATION = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    DIAMONDPoints = table.Column<int>(type: "int", nullable: false),
                    PACKAGEPrice = table.Column<decimal>(type: "decimal(10,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PACKAGE__35387D5009B32069", x => x.PACKAGEId);
                });

            migrationBuilder.CreateTable(
                name: "PAYMENTTRANSACTION",
                columns: table => new
                {
                    PayId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AMOUNT = table.Column<decimal>(type: "decimal(10,2)", nullable: false),
                    CURRENCY = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Token = table.Column<string>(type: "nvarchar(MAX)", unicode: false, maxLength: 255, nullable: false),
                    Status = table.Column<string>(type: "varchar(50)", unicode: false, maxLength: 50, nullable: false),
                    Mastercard = table.Column<bool>(type: "bit", nullable: true),
                    Visa = table.Column<bool>(type: "bit", nullable: true),
                    GetwayTransactionID = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: true),
                    TransactionDate = table.Column<DateOnly>(type: "date", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PAYMENTT__EE8FCECF6395CEC7", x => x.PayId);
                });

            migrationBuilder.CreateTable(
                name: "USERSPROFILE",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Fname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    Lname = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    ExperienceText = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: true),
                    ProfilePic = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    CreatedAt = table.Column<DateOnly>(type: "date", nullable: true, defaultValueSql: "(getdate())"),
                    AUTHUSERID = table.Column<string>(type: "varchar(450)", unicode: false, maxLength: 450, nullable: true),
                    BadgeId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__USERSPRO__1788CC4C54A710E3", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_USERSPROFILE_Badges_BadgeId",
                        column: x => x.BadgeId,
                        principalTable: "Badges",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateTable(
                name: "SKILLS",
                columns: table => new
                {
                    SkillId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    CateID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SKILLS__DFA09187E37E63C6", x => x.SkillId);
                    table.ForeignKey(
                        name: "FK_Skill_Category",
                        column: x => x.CateID,
                        principalTable: "CATEGORIESS",
                        principalColumn: "CateId");
                });

            migrationBuilder.CreateTable(
                name: "CHATTHREAD",
                columns: table => new
                {
                    ChatThreadId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    AzureThreadId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    User1Id = table.Column<int>(type: "int", nullable: false),
                    User2Id = table.Column<int>(type: "int", nullable: false),
                    LastMessagePreview = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    LastMessageAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    IsBlocked = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__CHATTHRE__32405D65FD56707D", x => x.ChatThreadId);
                    table.ForeignKey(
                        name: "FK_Chat_User1",
                        column: x => x.User1Id,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Chat_User2",
                        column: x => x.User2Id,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "DIAMOND",
                columns: table => new
                {
                    DIAMONDID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    TotalPoints = table.Column<int>(type: "int", nullable: false),
                    LastUpdated = table.Column<DateTime>(type: "datetime2", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__DIAMOND__0E6908ED2F4448F3", x => x.DIAMONDID);
                    table.ForeignKey(
                        name: "FK_User_Diamond",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "DiamondTransactions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DiamondPackageId = table.Column<int>(type: "int", nullable: true),
                    PointsChanged = table.Column<int>(type: "int", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Date = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DiamondTransactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DiamondTransactions_DiamondPackages_DiamondPackageId",
                        column: x => x.DiamondPackageId,
                        principalTable: "DiamondPackages",
                        principalColumn: "DiamondPackageId");
                    table.ForeignKey(
                        name: "FK_DiamondTransactions_USERSPROFILE_UserId",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MATERIALS",
                columns: table => new
                {
                    MATERIALID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TITLE = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    CATEID = table.Column<int>(type: "int", nullable: false),
                    UPLOADERID = table.Column<int>(type: "int", nullable: false),
                    FileUrl = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__MATERIAL__278B51D52BAE0509", x => x.MATERIALID);
                    table.ForeignKey(
                        name: "FK_Material_Category",
                        column: x => x.CATEID,
                        principalTable: "CATEGORIESS",
                        principalColumn: "CateId");
                    table.ForeignKey(
                        name: "FK_Material_User",
                        column: x => x.UPLOADERID,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "NOTIFICATIONS",
                columns: table => new
                {
                    NotificationId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Details = table.Column<string>(type: "nvarchar(400)", maxLength: 400, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    IsRead = table.Column<bool>(type: "bit", nullable: true, defaultValue: false),
                    ReadAt = table.Column<DateTime>(type: "datetime", nullable: true),
                    EntityId = table.Column<int>(type: "int", nullable: true),
                    EntityType = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: true),
                    RedirectURL = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SenderId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__NOTIFICA__20CF2E126A589282", x => x.NotificationId);
                    table.ForeignKey(
                        name: "FK_Notification_Sender",
                        column: x => x.SenderId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Notification_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "PackageUsersprofile",
                columns: table => new
                {
                    PackagesPackageid = table.Column<int>(type: "int", nullable: false),
                    UsersUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PackageUsersprofile", x => new { x.PackagesPackageid, x.UsersUserId });
                    table.ForeignKey(
                        name: "FK_PackageUsersprofile_PACKAGE_PackagesPackageid",
                        column: x => x.PackagesPackageid,
                        principalTable: "PACKAGE",
                        principalColumn: "PACKAGEId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PackageUsersprofile_USERSPROFILE_UsersUserId",
                        column: x => x.UsersUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PaymenttransactionUsersprofile",
                columns: table => new
                {
                    PaysPayId = table.Column<int>(type: "int", nullable: false),
                    UsersUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PaymenttransactionUsersprofile", x => new { x.PaysPayId, x.UsersUserId });
                    table.ForeignKey(
                        name: "FK_PaymenttransactionUsersprofile_PAYMENTTRANSACTION_PaysPayId",
                        column: x => x.PaysPayId,
                        principalTable: "PAYMENTTRANSACTION",
                        principalColumn: "PayId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_PaymenttransactionUsersprofile_USERSPROFILE_UsersUserId",
                        column: x => x.UsersUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "PremiumSubscriber",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PackageId = table.Column<int>(type: "int", nullable: false),
                    StartDate = table.Column<DateOnly>(type: "date", nullable: false),
                    EndDate = table.Column<DateOnly>(type: "date", nullable: false),
                    SubscribedAt = table.Column<DateOnly>(type: "date", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PremiumSubscriber", x => new { x.UserId, x.PackageId });
                    table.ForeignKey(
                        name: "FK_PremiumSubscriber_Package",
                        column: x => x.PackageId,
                        principalTable: "PACKAGE",
                        principalColumn: "PACKAGEId");
                    table.ForeignKey(
                        name: "FK_PremiumSubscriber_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "PROJECTS",
                columns: table => new
                {
                    ProjectID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ProjectName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    REPOLink = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    ProjectDesc = table.Column<string>(type: "nvarchar(600)", maxLength: 600, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__PROJECTS__761ABED038F8DFCE", x => x.ProjectID);
                    table.ForeignKey(
                        name: "FK_Project_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "REPORTS",
                columns: table => new
                {
                    ReportId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ReportDescription = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    EntityType = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    EntityId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    ReportedBy = table.Column<int>(type: "int", nullable: false),
                    ReportedUserId = table.Column<int>(type: "int", nullable: true),
                    ReportStatus = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__REPORTS__D5BD4805BCF300B0", x => x.ReportId);
                    table.ForeignKey(
                        name: "FK_Report_By",
                        column: x => x.ReportedBy,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Report_User",
                        column: x => x.ReportedUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "SOCIALMEDIAACCOUNTS",
                columns: table => new
                {
                    AccountId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FacebookLink = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    Linkedin = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: true),
                    PersonalWebsite = table.Column<string>(type: "varchar(400)", unicode: false, maxLength: 400, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SOCIALME__349DA5A65744A42F", x => x.AccountId);
                    table.ForeignKey(
                        name: "FK_SocialMedia_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserDiamondPackage",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    DiamondPackageId = table.Column<int>(type: "int", nullable: false),
                    PurchasedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserDiamondPackage", x => new { x.UserId, x.DiamondPackageId });
                    table.ForeignKey(
                        name: "FK_UserDiamondPackage_DiamondPackages_DiamondPackageId",
                        column: x => x.DiamondPackageId,
                        principalTable: "DiamondPackages",
                        principalColumn: "DiamondPackageId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserDiamondPackage_USERSPROFILE_UserId",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "USERFEEDBACK",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FeedbackId = table.Column<int>(type: "int", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserFeedback", x => new { x.UserId, x.FeedbackId });
                    table.ForeignKey(
                        name: "FK_UserFeedback_Feedback",
                        column: x => x.FeedbackId,
                        principalTable: "FEEDBACK",
                        principalColumn: "FEEDBACKID");
                    table.ForeignKey(
                        name: "FK_UserFeedback_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "USERNATIONALID",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FrontPic = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    BackPic = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    SelfieWithId = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    VerificationStatus = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    SubmittedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    ReviewedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    RejectionReason = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__USERNATI__3214EC078DE172F2", x => x.Id);
                    table.ForeignKey(
                        name: "FK_UserNationalID_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "UserPayments",
                columns: table => new
                {
                    PayId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserPayments", x => new { x.UserId, x.PayId });
                    table.ForeignKey(
                        name: "FK_UserPayments_PAYMENTTRANSACTION_PayId",
                        column: x => x.PayId,
                        principalTable: "PAYMENTTRANSACTION",
                        principalColumn: "PayId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_UserPayments_USERSPROFILE_UserId",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "POSTS",
                columns: table => new
                {
                    PostID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Content = table.Column<string>(type: "nvarchar(1500)", maxLength: 1500, nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TotalLiked = table.Column<int>(type: "int", nullable: false),
                    TotalComments = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SkillID = table.Column<int>(type: "int", nullable: false),
                    categoryId = table.Column<int>(type: "int", nullable: false),
                    CategoriessCateId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__POSTS__AA12603883BF519D", x => x.PostID);
                    table.ForeignKey(
                        name: "FK_POSTS_CATEGORIESS_CategoriessCateId",
                        column: x => x.CategoriessCateId,
                        principalTable: "CATEGORIESS",
                        principalColumn: "CateId");
                    table.ForeignKey(
                        name: "FK_Post_Skill",
                        column: x => x.SkillID,
                        principalTable: "SKILLS",
                        principalColumn: "SkillId");
                    table.ForeignKey(
                        name: "FK_Post_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "SESSION",
                columns: table => new
                {
                    SESSIONId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SessionTitle = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ScheduleStart = table.Column<DateTime>(type: "datetime", nullable: false),
                    ScheduleEnd = table.Column<DateTime>(type: "datetime", nullable: false),
                    Status = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    TeacherId = table.Column<int>(type: "int", nullable: false),
                    LearnerId = table.Column<int>(type: "int", nullable: false),
                    SkillID = table.Column<int>(type: "int", nullable: false),
                    ZoomMeetingId = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ZoomJoinUrl = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TeacherReminderSent = table.Column<bool>(type: "bit", nullable: false),
                    LearnerReminderSent = table.Column<bool>(type: "bit", nullable: false),
                    UpcomingNotificationSent = table.Column<bool>(type: "bit", nullable: false),
                    StartedNotificationSent = table.Column<bool>(type: "bit", nullable: false),
                    EndedNotificationSent = table.Column<bool>(type: "bit", nullable: false),
                    TeacherJoined = table.Column<bool>(type: "bit", nullable: false),
                    StudentJoined = table.Column<bool>(type: "bit", nullable: false),
                    PointsApplied = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__SESSION__FC86FC5F062580BD", x => x.SESSIONId);
                    table.ForeignKey(
                        name: "FK_Session_Learner",
                        column: x => x.LearnerId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Session_Skill",
                        column: x => x.SkillID,
                        principalTable: "SKILLS",
                        principalColumn: "SkillId");
                    table.ForeignKey(
                        name: "FK_Session_Teacher",
                        column: x => x.TeacherId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "SkillUsersprofile",
                columns: table => new
                {
                    SkillsSkillId = table.Column<int>(type: "int", nullable: false),
                    UsersUserId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SkillUsersprofile", x => new { x.SkillsSkillId, x.UsersUserId });
                    table.ForeignKey(
                        name: "FK_SkillUsersprofile_SKILLS_SkillsSkillId",
                        column: x => x.SkillsSkillId,
                        principalTable: "SKILLS",
                        principalColumn: "SkillId",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SkillUsersprofile_USERSPROFILE_UsersUserId",
                        column: x => x.UsersUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "UserSkills",
                columns: table => new
                {
                    UserId = table.Column<int>(type: "int", nullable: false),
                    SkillId = table.Column<int>(type: "int", nullable: false),
                    GoodAtIt = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserSkills", x => new { x.UserId, x.SkillId });
                    table.ForeignKey(
                        name: "FK_UserSkills_SKILLS_SkillId",
                        column: x => x.SkillId,
                        principalTable: "SKILLS",
                        principalColumn: "SkillId");
                    table.ForeignKey(
                        name: "FK_UserSkills_USERSPROFILE_UserId",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "COMMENTS",
                columns: table => new
                {
                    CommentId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CommentText = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PostID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__COMMENTS__C3B4DFCAD68DFD97", x => x.CommentId);
                    table.ForeignKey(
                        name: "FK_Comment_Post",
                        column: x => x.PostID,
                        principalTable: "POSTS",
                        principalColumn: "PostID");
                    table.ForeignKey(
                        name: "FK_Comment_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "LIKES",
                columns: table => new
                {
                    LikeId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PostID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__LIKES__A2922C147C9BB08F", x => x.LikeId);
                    table.ForeignKey(
                        name: "FK_Like_Post",
                        column: x => x.PostID,
                        principalTable: "POSTS",
                        principalColumn: "PostID");
                    table.ForeignKey(
                        name: "FK_Like_User",
                        column: x => x.UserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateTable(
                name: "POSTMEDIAS",
                columns: table => new
                {
                    PMediaId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MediaUrl = table.Column<string>(type: "varchar(300)", unicode: false, maxLength: 300, nullable: false),
                    EntityType = table.Column<string>(type: "varchar(100)", unicode: false, maxLength: 100, nullable: false),
                    PostID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__POSTMEDI__6414C455D155CFFB", x => x.PMediaId);
                    table.ForeignKey(
                        name: "FK_PostMedia_Post",
                        column: x => x.PostID,
                        principalTable: "POSTS",
                        principalColumn: "PostID");
                });

            migrationBuilder.CreateTable(
                name: "USERSESSIONFEEDBACKS",
                columns: table => new
                {
                    FeedbackId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    RatingValue = table.Column<int>(type: "int", nullable: false),
                    Comment = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    RatedByUserId = table.Column<int>(type: "int", nullable: false),
                    RatedToUserId = table.Column<int>(type: "int", nullable: false),
                    SessionId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK__USERSESS__6A4BEDD62089FA43", x => x.FeedbackId);
                    table.ForeignKey(
                        name: "FK_Feedback_ByUser",
                        column: x => x.RatedByUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                    table.ForeignKey(
                        name: "FK_Feedback_Session",
                        column: x => x.SessionId,
                        principalTable: "SESSION",
                        principalColumn: "SESSIONId");
                    table.ForeignKey(
                        name: "FK_Feedback_ToUser",
                        column: x => x.RatedToUserId,
                        principalTable: "USERSPROFILE",
                        principalColumn: "UserId");
                });

            migrationBuilder.CreateIndex(
                name: "IX_CHATTHREAD_User1Id",
                table: "CHATTHREAD",
                column: "User1Id");

            migrationBuilder.CreateIndex(
                name: "IX_CHATTHREAD_User2Id",
                table: "CHATTHREAD",
                column: "User2Id");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENTS_PostID",
                table: "COMMENTS",
                column: "PostID");

            migrationBuilder.CreateIndex(
                name: "IX_COMMENTS_UserId",
                table: "COMMENTS",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "UQ__DIAMOND__1788CC4DF3A3B250",
                table: "DIAMOND",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_DiamondTransactions_DiamondPackageId",
                table: "DiamondTransactions",
                column: "DiamondPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_DiamondTransactions_UserId",
                table: "DiamondTransactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_LIKES_PostID",
                table: "LIKES",
                column: "PostID");

            migrationBuilder.CreateIndex(
                name: "UQ_Like",
                table: "LIKES",
                columns: new[] { "UserId", "PostID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MATERIALS_CATEID",
                table: "MATERIALS",
                column: "CATEID");

            migrationBuilder.CreateIndex(
                name: "IX_MATERIALS_UPLOADERID",
                table: "MATERIALS",
                column: "UPLOADERID");

            migrationBuilder.CreateIndex(
                name: "IX_NOTIFICATIONS_SenderId",
                table: "NOTIFICATIONS",
                column: "SenderId");

            migrationBuilder.CreateIndex(
                name: "IX_NOTIFICATIONS_UserId",
                table: "NOTIFICATIONS",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PackageUsersprofile_UsersUserId",
                table: "PackageUsersprofile",
                column: "UsersUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PaymenttransactionUsersprofile_UsersUserId",
                table: "PaymenttransactionUsersprofile",
                column: "UsersUserId");

            migrationBuilder.CreateIndex(
                name: "IX_POSTMEDIAS_PostID",
                table: "POSTMEDIAS",
                column: "PostID");

            migrationBuilder.CreateIndex(
                name: "IX_POSTS_CategoriessCateId",
                table: "POSTS",
                column: "CategoriessCateId");

            migrationBuilder.CreateIndex(
                name: "IX_POSTS_SkillID",
                table: "POSTS",
                column: "SkillID");

            migrationBuilder.CreateIndex(
                name: "IX_POSTS_UserId",
                table: "POSTS",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PremiumSubscriber_PackageId",
                table: "PremiumSubscriber",
                column: "PackageId");

            migrationBuilder.CreateIndex(
                name: "IX_PROJECTS_UserId",
                table: "PROJECTS",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_REPORTS_ReportedBy",
                table: "REPORTS",
                column: "ReportedBy");

            migrationBuilder.CreateIndex(
                name: "IX_REPORTS_ReportedUserId",
                table: "REPORTS",
                column: "ReportedUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SESSION_LearnerId",
                table: "SESSION",
                column: "LearnerId");

            migrationBuilder.CreateIndex(
                name: "IX_SESSION_SkillID",
                table: "SESSION",
                column: "SkillID");

            migrationBuilder.CreateIndex(
                name: "IX_SESSION_TeacherId",
                table: "SESSION",
                column: "TeacherId");

            migrationBuilder.CreateIndex(
                name: "IX_SKILLS_CateID",
                table: "SKILLS",
                column: "CateID");

            migrationBuilder.CreateIndex(
                name: "IX_SkillUsersprofile_UsersUserId",
                table: "SkillUsersprofile",
                column: "UsersUserId");

            migrationBuilder.CreateIndex(
                name: "IX_SOCIALMEDIAACCOUNTS_UserId",
                table: "SOCIALMEDIAACCOUNTS",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_UserDiamondPackage_DiamondPackageId",
                table: "UserDiamondPackage",
                column: "DiamondPackageId");

            migrationBuilder.CreateIndex(
                name: "IX_USERFEEDBACK_FeedbackId",
                table: "USERFEEDBACK",
                column: "FeedbackId");

            migrationBuilder.CreateIndex(
                name: "UQ__USERNATI__1788CC4DF7CCB5C3",
                table: "USERNATIONALID",
                column: "UserId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserPayments_PayId",
                table: "UserPayments",
                column: "PayId");

            migrationBuilder.CreateIndex(
                name: "IX_USERSESSIONFEEDBACKS_RatedByUserId",
                table: "USERSESSIONFEEDBACKS",
                column: "RatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_USERSESSIONFEEDBACKS_RatedToUserId",
                table: "USERSESSIONFEEDBACKS",
                column: "RatedToUserId");

            migrationBuilder.CreateIndex(
                name: "IX_USERSESSIONFEEDBACKS_SessionId",
                table: "USERSESSIONFEEDBACKS",
                column: "SessionId");

            migrationBuilder.CreateIndex(
                name: "IX_UserSkills_SkillId",
                table: "UserSkills",
                column: "SkillId");

            migrationBuilder.CreateIndex(
                name: "IX_USERSPROFILE_BadgeId",
                table: "USERSPROFILE",
                column: "BadgeId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CERTIFICATES");

            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "CHATTHREAD");

            migrationBuilder.DropTable(
                name: "COMMENTS");

            migrationBuilder.DropTable(
                name: "DIAMOND");

            migrationBuilder.DropTable(
                name: "DiamondTransactions");

            migrationBuilder.DropTable(
                name: "LIKES");

            migrationBuilder.DropTable(
                name: "MATERIALS");

            migrationBuilder.DropTable(
                name: "NOTIFICATIONS");

            migrationBuilder.DropTable(
                name: "PackageUsersprofile");

            migrationBuilder.DropTable(
                name: "PaymenttransactionUsersprofile");

            migrationBuilder.DropTable(
                name: "POSTMEDIAS");

            migrationBuilder.DropTable(
                name: "PremiumSubscriber");

            migrationBuilder.DropTable(
                name: "PROJECTS");

            migrationBuilder.DropTable(
                name: "REPORTS");

            migrationBuilder.DropTable(
                name: "SkillUsersprofile");

            migrationBuilder.DropTable(
                name: "SOCIALMEDIAACCOUNTS");

            migrationBuilder.DropTable(
                name: "UserDiamondPackage");

            migrationBuilder.DropTable(
                name: "USERFEEDBACK");

            migrationBuilder.DropTable(
                name: "USERNATIONALID");

            migrationBuilder.DropTable(
                name: "UserPayments");

            migrationBuilder.DropTable(
                name: "USERSESSIONFEEDBACKS");

            migrationBuilder.DropTable(
                name: "UserSkills");

            migrationBuilder.DropTable(
                name: "POSTS");

            migrationBuilder.DropTable(
                name: "PACKAGE");

            migrationBuilder.DropTable(
                name: "DiamondPackages");

            migrationBuilder.DropTable(
                name: "FEEDBACK");

            migrationBuilder.DropTable(
                name: "PAYMENTTRANSACTION");

            migrationBuilder.DropTable(
                name: "SESSION");

            migrationBuilder.DropTable(
                name: "USERSPROFILE");

            migrationBuilder.DropTable(
                name: "SKILLS");

            migrationBuilder.DropTable(
                name: "Badges");

            migrationBuilder.DropTable(
                name: "CATEGORIESS");
        }
    }
}
