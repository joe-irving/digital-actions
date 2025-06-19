-- CreateTable
CREATE TABLE `Account` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `provider` VARCHAR(191) NOT NULL,
    `providerAccountId` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(191) NULL,
    `access_token` VARCHAR(191) NULL,
    `expires_at` INTEGER NULL,
    `token_type` VARCHAR(191) NULL,
    `scope` VARCHAR(191) NULL,
    `id_token` VARCHAR(191) NULL,
    `session_state` VARCHAR(191) NULL,
    `subscribed` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `Account_userId_key`(`userId`),
    UNIQUE INDEX `Account_provider_providerAccountId_key`(`provider`, `providerAccountId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `id` VARCHAR(191) NOT NULL,
    `sessionToken` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Session_sessionToken_key`(`sessionToken`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `emailVerified` DATETIME(3) NULL,
    `image` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `postCode` VARCHAR(191) NULL,
    `superAdmin` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerificationToken` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `identifier` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expires` DATETIME(3) NOT NULL,

    UNIQUE INDEX `VerificationToken_token_key`(`token`),
    UNIQUE INDEX `VerificationToken_identifier_token_key`(`identifier`, `token`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TweetCampaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `targetListId` INTEGER NOT NULL,
    `published` BOOLEAN NOT NULL DEFAULT true,
    `slug` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `TweetCampaign_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TweetCampaignPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tweet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `text` VARCHAR(191) NOT NULL,
    `campaignId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TargetList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `isPublic` BOOLEAN NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TargetListPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `targetListId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Target` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `twitterHandle` VARCHAR(191) NOT NULL,
    `targetListId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ActionNetworkCredential` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `apiKey` VARCHAR(191) NOT NULL,
    `ownerId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetitionCampaign` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `actionNetworkCredentialId` INTEGER NULL,
    `petitionEndpointURL` VARCHAR(191) NULL,
    `tagPrefix` VARCHAR(191) NOT NULL,
    `actionNetworkTagId` VARCHAR(191) NULL,
    `sharingInformationId` INTEGER NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `defaultPetitionImageId` INTEGER NULL,
    `styleThemeId` INTEGER NULL,
    `limitLocationCountry` VARCHAR(191) NULL,
    `slug` VARCHAR(191) NOT NULL,
    `groupName` VARCHAR(191) NULL,
    `actionNetworkAllTag` VARCHAR(191) NOT NULL,
    `actionNetworkResponseTag` VARCHAR(191) NOT NULL,
    `petitionContentTemplate` VARCHAR(191) NULL,

    UNIQUE INDEX `PetitionCampaign_sharingInformationId_key`(`sharingInformationId`),
    UNIQUE INDEX `PetitionCampaign_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Petition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `locationTag` VARCHAR(191) NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `sharingInformationId` INTEGER NOT NULL,
    `petitionCampaignId` INTEGER NULL,
    `imageId` INTEGER NULL,
    `creatorEmail` VARCHAR(191) NULL,
    `verificationToken` VARCHAR(191) NULL,
    `locationId` INTEGER NULL,
    `targetName` VARCHAR(191) NULL,
    `approved` BOOLEAN NOT NULL DEFAULT false,
    `status` VARCHAR(191) NOT NULL DEFAULT 'draft',
    `slug` VARCHAR(191) NOT NULL,
    `actionNetworkQueryId` VARCHAR(191) NULL,
    `tagName` VARCHAR(191) NULL,
    `actionNetworkPetitionId` VARCHAR(191) NULL,
    `sourceCode` VARCHAR(191) NULL,
    `signatureTotal` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `Petition_sharingInformationId_key`(`sharingInformationId`),
    UNIQUE INDEX `Petition_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetitionTheme` (
    `petitionId` INTEGER NOT NULL,
    `themeId` INTEGER NOT NULL,

    PRIMARY KEY (`petitionId`, `themeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetitionCampaignTheme` (
    `petitionCampaignId` INTEGER NOT NULL,
    `themeId` INTEGER NOT NULL,

    PRIMARY KEY (`petitionCampaignId`, `themeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserPetitionPermissions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `petitionId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SharingInformation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `petitionId` INTEGER NULL,
    `petitionCampaignId` INTEGER NULL,
    `whatsappShareText` VARCHAR(191) NOT NULL,
    `shareImageId` INTEGER NULL,
    `shareTitle` VARCHAR(191) NOT NULL,
    `tweet` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Theme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `title` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `icon` VARCHAR(191) NULL,
    `status` VARCHAR(191) NOT NULL DEFAULT 'public',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PetitionCampaignPermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,
    `campaignId` INTEGER NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `File` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NULL,
    `url` VARCHAR(191) NOT NULL,
    `thumbnailUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Location` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `place_id` BIGINT NOT NULL,
    `licence` VARCHAR(191) NULL,
    `osm_type` VARCHAR(191) NULL,
    `osm_id` BIGINT NULL,
    `lat` VARCHAR(191) NOT NULL,
    `lon` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `place_rank` INTEGER NULL,
    `importance` DOUBLE NULL,
    `addresstype` VARCHAR(191) NULL,
    `name` VARCHAR(191) NOT NULL,
    `display_name` VARCHAR(191) NOT NULL,
    `boundingbox` VARCHAR(191) NULL,
    `county` VARCHAR(191) NULL,
    `ISO3166_2_lvl6` VARCHAR(191) NULL,
    `state` VARCHAR(191) NULL,
    `ISO3166_2_lvl4` VARCHAR(191) NULL,
    `country` VARCHAR(191) NULL,
    `country_code` VARCHAR(191) NULL,

    UNIQUE INDEX `Location_place_id_key`(`place_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleTheme` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `backgroundColor` VARCHAR(191) NULL,
    `backgroundTextColor` VARCHAR(191) NULL,
    `backgroundHeaderColor` VARCHAR(191) NULL,
    `accentColor` VARCHAR(191) NULL,
    `accentTextColor` VARCHAR(191) NULL,
    `accentHeaderColor` VARCHAR(191) NULL,
    `headerFont` VARCHAR(191) NULL,
    `font` VARCHAR(191) NULL,
    `logoId` INTEGER NULL,
    `logoSquareId` INTEGER NULL,
    `iconId` INTEGER NULL,

    UNIQUE INDEX `StyleTheme_logoId_key`(`logoId`),
    UNIQUE INDEX `StyleTheme_logoSquareId_key`(`logoSquareId`),
    UNIQUE INDEX `StyleTheme_iconId_key`(`iconId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StyleThemePermission` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `styleThemeId` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Slug` (
    `slug` VARCHAR(191) NOT NULL,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`slug`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VerifiedActionNetworkPetition` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `endpoint` VARCHAR(191) NOT NULL,
    `actionNetworkCredentialId` INTEGER NOT NULL,
    `petitionCampaignId` INTEGER NOT NULL,
    `title` VARCHAR(191) NULL,
    `content` VARCHAR(191) NULL,
    `target` VARCHAR(191) NULL,
    `imageUrl` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomField` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `required` BOOLEAN NOT NULL DEFAULT false,
    `petitionId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CustomFieldOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `created` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `fieldId` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `label` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Account` ADD CONSTRAINT `Account_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TweetCampaign` ADD CONSTRAINT `TweetCampaign_targetListId_fkey` FOREIGN KEY (`targetListId`) REFERENCES `TargetList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TweetCampaign` ADD CONSTRAINT `TweetCampaign_slug_fkey` FOREIGN KEY (`slug`) REFERENCES `Slug`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TweetCampaignPermission` ADD CONSTRAINT `TweetCampaignPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TweetCampaignPermission` ADD CONSTRAINT `TweetCampaignPermission_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `TweetCampaign`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tweet` ADD CONSTRAINT `Tweet_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `TweetCampaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TargetListPermission` ADD CONSTRAINT `TargetListPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TargetListPermission` ADD CONSTRAINT `TargetListPermission_targetListId_fkey` FOREIGN KEY (`targetListId`) REFERENCES `TargetList`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Target` ADD CONSTRAINT `Target_targetListId_fkey` FOREIGN KEY (`targetListId`) REFERENCES `TargetList`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActionNetworkCredential` ADD CONSTRAINT `ActionNetworkCredential_ownerId_fkey` FOREIGN KEY (`ownerId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaign` ADD CONSTRAINT `PetitionCampaign_actionNetworkCredentialId_fkey` FOREIGN KEY (`actionNetworkCredentialId`) REFERENCES `ActionNetworkCredential`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaign` ADD CONSTRAINT `PetitionCampaign_sharingInformationId_fkey` FOREIGN KEY (`sharingInformationId`) REFERENCES `SharingInformation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaign` ADD CONSTRAINT `PetitionCampaign_defaultPetitionImageId_fkey` FOREIGN KEY (`defaultPetitionImageId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaign` ADD CONSTRAINT `PetitionCampaign_styleThemeId_fkey` FOREIGN KEY (`styleThemeId`) REFERENCES `StyleTheme`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaign` ADD CONSTRAINT `PetitionCampaign_slug_fkey` FOREIGN KEY (`slug`) REFERENCES `Slug`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petition` ADD CONSTRAINT `Petition_sharingInformationId_fkey` FOREIGN KEY (`sharingInformationId`) REFERENCES `SharingInformation`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petition` ADD CONSTRAINT `Petition_petitionCampaignId_fkey` FOREIGN KEY (`petitionCampaignId`) REFERENCES `PetitionCampaign`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petition` ADD CONSTRAINT `Petition_imageId_fkey` FOREIGN KEY (`imageId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petition` ADD CONSTRAINT `Petition_locationId_fkey` FOREIGN KEY (`locationId`) REFERENCES `Location`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Petition` ADD CONSTRAINT `Petition_slug_fkey` FOREIGN KEY (`slug`) REFERENCES `Slug`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionTheme` ADD CONSTRAINT `PetitionTheme_petitionId_fkey` FOREIGN KEY (`petitionId`) REFERENCES `Petition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionTheme` ADD CONSTRAINT `PetitionTheme_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaignTheme` ADD CONSTRAINT `PetitionCampaignTheme_petitionCampaignId_fkey` FOREIGN KEY (`petitionCampaignId`) REFERENCES `PetitionCampaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaignTheme` ADD CONSTRAINT `PetitionCampaignTheme_themeId_fkey` FOREIGN KEY (`themeId`) REFERENCES `Theme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPetitionPermissions` ADD CONSTRAINT `UserPetitionPermissions_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserPetitionPermissions` ADD CONSTRAINT `UserPetitionPermissions_petitionId_fkey` FOREIGN KEY (`petitionId`) REFERENCES `Petition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SharingInformation` ADD CONSTRAINT `SharingInformation_shareImageId_fkey` FOREIGN KEY (`shareImageId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaignPermission` ADD CONSTRAINT `PetitionCampaignPermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PetitionCampaignPermission` ADD CONSTRAINT `PetitionCampaignPermission_campaignId_fkey` FOREIGN KEY (`campaignId`) REFERENCES `PetitionCampaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleTheme` ADD CONSTRAINT `StyleTheme_logoId_fkey` FOREIGN KEY (`logoId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleTheme` ADD CONSTRAINT `StyleTheme_logoSquareId_fkey` FOREIGN KEY (`logoSquareId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleTheme` ADD CONSTRAINT `StyleTheme_iconId_fkey` FOREIGN KEY (`iconId`) REFERENCES `File`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleThemePermission` ADD CONSTRAINT `StyleThemePermission_styleThemeId_fkey` FOREIGN KEY (`styleThemeId`) REFERENCES `StyleTheme`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StyleThemePermission` ADD CONSTRAINT `StyleThemePermission_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedActionNetworkPetition` ADD CONSTRAINT `VerifiedActionNetworkPetition_actionNetworkCredentialId_fkey` FOREIGN KEY (`actionNetworkCredentialId`) REFERENCES `ActionNetworkCredential`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `VerifiedActionNetworkPetition` ADD CONSTRAINT `VerifiedActionNetworkPetition_petitionCampaignId_fkey` FOREIGN KEY (`petitionCampaignId`) REFERENCES `PetitionCampaign`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomField` ADD CONSTRAINT `CustomField_petitionId_fkey` FOREIGN KEY (`petitionId`) REFERENCES `Petition`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CustomFieldOption` ADD CONSTRAINT `CustomFieldOption_fieldId_fkey` FOREIGN KEY (`fieldId`) REFERENCES `CustomField`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
