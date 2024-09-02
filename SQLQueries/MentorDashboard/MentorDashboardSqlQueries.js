// check Bank details exists are not
export const CheckBankDetailsExistsQuery = `
select mentor_bank_user_dtls_id from  mentor_bank_dtls where mentor_bank_user_dtls_id = @mentorBankUserDtlsId`;

// inserting the bank details in to database
export const InsertBankDetailsQuery = `INSERT INTO [dbo].[mentor_bank_dtls] (
    [mentor_bank_user_dtls_id],
    [mentor_bank_mentor_dtls_id],
    [mentor_bank_account_holder_name],
    [mentor_bank_account_number],
    [mentor_bank_name],
    [mentor_bank_account_ifsc_code],
    [mentor_bank_branch],
    [mentor_bank_account_type],
    [mentor_bank_address],
    [mentor_bank_pan_number],
    [mentor_bank_swift_code],
    [mentor_bank_cr_date]
) VALUES (
    @mentorBankUserDtlsId,
    @mentorBankMentorDtlsId,
    @mentorBankAccountHolderName,
    @mentorBankAccountNumber,
    @mentorBankName,
    @mentorBankAccountIfscCode,
    @mentorBankBranch,
    @mentorBankAccountType,
    @mentorBankAddress,
    @mentorBankPanNumber,
    @mentorBankSwiftCode,
    @mentorBankCrDate
);
`;
