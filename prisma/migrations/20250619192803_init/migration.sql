-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "subscribed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "phone" TEXT,
    "country" TEXT,
    "postCode" TEXT,
    "superAdmin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TweetCampaign" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "targetListId" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "slug" TEXT NOT NULL,

    CONSTRAINT "TweetCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TweetCampaignPermission" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "TweetCampaignPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tweet" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "text" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,

    CONSTRAINT "Tweet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetList" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL,

    CONSTRAINT "TargetList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TargetListPermission" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "targetListId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "TargetListPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Target" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "twitterHandle" TEXT NOT NULL,
    "targetListId" INTEGER NOT NULL,

    CONSTRAINT "Target_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActionNetworkCredential" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "apiKey" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "ActionNetworkCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionCampaign" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "actionNetworkCredentialId" INTEGER,
    "petitionEndpointURL" TEXT,
    "tagPrefix" TEXT NOT NULL,
    "actionNetworkTagId" TEXT,
    "sharingInformationId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "defaultPetitionImageId" INTEGER,
    "styleThemeId" INTEGER,
    "limitLocationCountry" TEXT,
    "slug" TEXT NOT NULL,
    "groupName" TEXT,
    "actionNetworkAllTag" TEXT NOT NULL,
    "actionNetworkResponseTag" TEXT NOT NULL,
    "petitionContentTemplate" TEXT,

    CONSTRAINT "PetitionCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Petition" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "locationTag" TEXT,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sharingInformationId" INTEGER NOT NULL,
    "petitionCampaignId" INTEGER,
    "imageId" INTEGER,
    "creatorEmail" TEXT,
    "verificationToken" TEXT,
    "locationId" INTEGER,
    "targetName" TEXT,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "slug" TEXT NOT NULL,
    "actionNetworkQueryId" TEXT,
    "tagName" TEXT,
    "actionNetworkPetitionId" TEXT,
    "sourceCode" TEXT,
    "signatureTotal" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Petition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionTheme" (
    "petitionId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "PetitionTheme_pkey" PRIMARY KEY ("petitionId","themeId")
);

-- CreateTable
CREATE TABLE "PetitionCampaignTheme" (
    "petitionCampaignId" INTEGER NOT NULL,
    "themeId" INTEGER NOT NULL,

    CONSTRAINT "PetitionCampaignTheme_pkey" PRIMARY KEY ("petitionCampaignId","themeId")
);

-- CreateTable
CREATE TABLE "UserPetitionPermissions" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "petitionId" INTEGER NOT NULL,

    CONSTRAINT "UserPetitionPermissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SharingInformation" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "petitionId" INTEGER,
    "petitionCampaignId" INTEGER,
    "whatsappShareText" TEXT NOT NULL,
    "shareImageId" INTEGER,
    "shareTitle" TEXT NOT NULL,
    "tweet" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "SharingInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Theme" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "status" TEXT NOT NULL DEFAULT 'public',

    CONSTRAINT "Theme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PetitionCampaignPermission" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "campaignId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "PetitionCampaignPermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "place_id" BIGINT NOT NULL,
    "licence" TEXT,
    "osm_type" TEXT,
    "osm_id" BIGINT,
    "lat" TEXT NOT NULL,
    "lon" TEXT NOT NULL,
    "category" TEXT,
    "type" TEXT,
    "place_rank" INTEGER,
    "importance" DOUBLE PRECISION,
    "addresstype" TEXT,
    "name" TEXT NOT NULL,
    "display_name" TEXT NOT NULL,
    "boundingbox" TEXT,
    "county" TEXT,
    "ISO3166_2_lvl6" TEXT,
    "state" TEXT,
    "ISO3166_2_lvl4" TEXT,
    "country" TEXT,
    "country_code" TEXT,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleTheme" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "backgroundColor" TEXT,
    "backgroundTextColor" TEXT,
    "backgroundHeaderColor" TEXT,
    "accentColor" TEXT,
    "accentTextColor" TEXT,
    "accentHeaderColor" TEXT,
    "headerFont" TEXT,
    "font" TEXT,
    "logoId" INTEGER,
    "logoSquareId" INTEGER,
    "iconId" INTEGER,

    CONSTRAINT "StyleTheme_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StyleThemePermission" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "styleThemeId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "StyleThemePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slug" (
    "slug" TEXT NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Slug_pkey" PRIMARY KEY ("slug")
);

-- CreateTable
CREATE TABLE "VerifiedActionNetworkPetition" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endpoint" TEXT NOT NULL,
    "actionNetworkCredentialId" INTEGER NOT NULL,
    "petitionCampaignId" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "target" TEXT,
    "imageUrl" TEXT,

    CONSTRAINT "VerifiedActionNetworkPetition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomField" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "petitionId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "CustomField_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomFieldOption" (
    "id" SERIAL NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fieldId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "CustomFieldOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_userId_key" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "TweetCampaign_slug_key" ON "TweetCampaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionCampaign_sharingInformationId_key" ON "PetitionCampaign"("sharingInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "PetitionCampaign_slug_key" ON "PetitionCampaign"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Petition_sharingInformationId_key" ON "Petition"("sharingInformationId");

-- CreateIndex
CREATE UNIQUE INDEX "Petition_slug_key" ON "Petition"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_place_id_key" ON "Location"("place_id");

-- CreateIndex
CREATE UNIQUE INDEX "StyleTheme_logoId_key" ON "StyleTheme"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "StyleTheme_logoSquareId_key" ON "StyleTheme"("logoSquareId");

-- CreateIndex
CREATE UNIQUE INDEX "StyleTheme_iconId_key" ON "StyleTheme"("iconId");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetCampaign" ADD CONSTRAINT "TweetCampaign_targetListId_fkey" FOREIGN KEY ("targetListId") REFERENCES "TargetList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetCampaign" ADD CONSTRAINT "TweetCampaign_slug_fkey" FOREIGN KEY ("slug") REFERENCES "Slug"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetCampaignPermission" ADD CONSTRAINT "TweetCampaignPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TweetCampaignPermission" ADD CONSTRAINT "TweetCampaignPermission_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "TweetCampaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tweet" ADD CONSTRAINT "Tweet_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "TweetCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetListPermission" ADD CONSTRAINT "TargetListPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TargetListPermission" ADD CONSTRAINT "TargetListPermission_targetListId_fkey" FOREIGN KEY ("targetListId") REFERENCES "TargetList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Target" ADD CONSTRAINT "Target_targetListId_fkey" FOREIGN KEY ("targetListId") REFERENCES "TargetList"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActionNetworkCredential" ADD CONSTRAINT "ActionNetworkCredential_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaign" ADD CONSTRAINT "PetitionCampaign_actionNetworkCredentialId_fkey" FOREIGN KEY ("actionNetworkCredentialId") REFERENCES "ActionNetworkCredential"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaign" ADD CONSTRAINT "PetitionCampaign_sharingInformationId_fkey" FOREIGN KEY ("sharingInformationId") REFERENCES "SharingInformation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaign" ADD CONSTRAINT "PetitionCampaign_defaultPetitionImageId_fkey" FOREIGN KEY ("defaultPetitionImageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaign" ADD CONSTRAINT "PetitionCampaign_styleThemeId_fkey" FOREIGN KEY ("styleThemeId") REFERENCES "StyleTheme"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaign" ADD CONSTRAINT "PetitionCampaign_slug_fkey" FOREIGN KEY ("slug") REFERENCES "Slug"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_sharingInformationId_fkey" FOREIGN KEY ("sharingInformationId") REFERENCES "SharingInformation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_petitionCampaignId_fkey" FOREIGN KEY ("petitionCampaignId") REFERENCES "PetitionCampaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Petition" ADD CONSTRAINT "Petition_slug_fkey" FOREIGN KEY ("slug") REFERENCES "Slug"("slug") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionTheme" ADD CONSTRAINT "PetitionTheme_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionTheme" ADD CONSTRAINT "PetitionTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaignTheme" ADD CONSTRAINT "PetitionCampaignTheme_petitionCampaignId_fkey" FOREIGN KEY ("petitionCampaignId") REFERENCES "PetitionCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaignTheme" ADD CONSTRAINT "PetitionCampaignTheme_themeId_fkey" FOREIGN KEY ("themeId") REFERENCES "Theme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetitionPermissions" ADD CONSTRAINT "UserPetitionPermissions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPetitionPermissions" ADD CONSTRAINT "UserPetitionPermissions_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SharingInformation" ADD CONSTRAINT "SharingInformation_shareImageId_fkey" FOREIGN KEY ("shareImageId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaignPermission" ADD CONSTRAINT "PetitionCampaignPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PetitionCampaignPermission" ADD CONSTRAINT "PetitionCampaignPermission_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "PetitionCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleTheme" ADD CONSTRAINT "StyleTheme_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleTheme" ADD CONSTRAINT "StyleTheme_logoSquareId_fkey" FOREIGN KEY ("logoSquareId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleTheme" ADD CONSTRAINT "StyleTheme_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "File"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleThemePermission" ADD CONSTRAINT "StyleThemePermission_styleThemeId_fkey" FOREIGN KEY ("styleThemeId") REFERENCES "StyleTheme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StyleThemePermission" ADD CONSTRAINT "StyleThemePermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedActionNetworkPetition" ADD CONSTRAINT "VerifiedActionNetworkPetition_actionNetworkCredentialId_fkey" FOREIGN KEY ("actionNetworkCredentialId") REFERENCES "ActionNetworkCredential"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerifiedActionNetworkPetition" ADD CONSTRAINT "VerifiedActionNetworkPetition_petitionCampaignId_fkey" FOREIGN KEY ("petitionCampaignId") REFERENCES "PetitionCampaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomField" ADD CONSTRAINT "CustomField_petitionId_fkey" FOREIGN KEY ("petitionId") REFERENCES "Petition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomFieldOption" ADD CONSTRAINT "CustomFieldOption_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "CustomField"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
