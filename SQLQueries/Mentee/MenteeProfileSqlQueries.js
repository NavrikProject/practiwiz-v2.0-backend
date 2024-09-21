export const MenteeProfileUpdateQuery = `update mentee_dtls set mentee_language = @menteeLanguage, mentee_linkedin_url = @linkedinUrl, mentee_twitter_url = @twitterUrl, mentee_instagram_url = @instagramUrl where mentee_user_dtls_id = @menteeUserDtlsId`;

export const MenteeEduWorkUpdateQuery = ``;
