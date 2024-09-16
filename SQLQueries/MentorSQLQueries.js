export const userDtlsQuery = `
          INSERT INTO [dbo].[users_dtls] (
            [user_email],
            [user_pwd],
            [user_firstname],
            [user_lastname],
            [user_phone_number],
            [user_status],
            [user_modified_by],
            [user_type],
            [user_is_superadmin],
            [user_logindate],
            [user_logintime],
            [user_token]
        ) OUTPUT INSERTED.user_dtls_id VALUES (
            @user_email,
            @user_pwd,
            @user_firstname,
            @user_lastname,
            @user_phone_number,
            @user_status,
            @user_modified_by,
            @user_type,
            @user_is_superadmin,
            @user_logindate,
            @user_logintime,
            @user_token
        );
`;

export const mentorDtlsQuery = `
INSERT INTO [dbo].[mentor_dtls] (
    [mentor_user_dtls_id],
    [mentor_phone_number],
    [mentor_email],
    [mentor_profile_photo],
    [mentor_social_media_profile],
    [mentor_job_title],
    [mentor_company_name],
    [mentor_years_of_experience],
    [mentor_academic_qualification],
    [mentor_recommended_area_of_mentorship],
    [mentor_guest_lectures_interest],
    [mentor_curating_case_studies_interest],
    [mentor_sessions_free_of_charge],
    [mentor_language],
    [mentor_timezone],
    [mentor_country],
    [mentor_dtls_cr_date],
    [mentor_dtls_update_date],
    [mentor_headline],   
    [mentor_session_price],
    [mentor_currency_type],
    [mentor_city]
) OUTPUT INSERTED.mentor_dtls_id VALUES (
    @mentor_user_dtls_id,
    @mentor_phone_number,
    @mentor_email,
    @mentor_profile_photo,
    @mentor_social_media_profile,
    @mentor_job_title,
    @mentor_company_name,
    @mentor_years_of_experience,
    @mentor_academic_qualification,
    @mentor_recommended_area_of_mentorship,
    @mentor_guest_lectures_interest,
    @mentor_curating_case_studies_interest,
    @mentor_sessions_free_of_charge,
    @mentor_language,
    @mentor_timezone,
    @mentor_country,
    @mentor_dtls_cr_date,
    @mentor_dtls_update_date,
    @mentor_headline,
    @mentor_session_price,
    @mentor_currency,
    @City
);
`;

export const mentorExpertiseQuery = `
        INSERT INTO mentor_expertise_dtls 
        (mentor_dtls_id, mentor_expertise, mentor_exp_cr_date, mentor_exp_update_date)
        VALUES (@mentor_dtls_id, @mentor_expertise, @mentor_exp_cr_date, @mentor_exp_update_date)
`;
// fetch single mentor working
export const fetchSingleMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_dtls_cr_date],
    m.[mentor_dtls_update_date],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_pricing],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id 
AND
    m.[mentor_approved_status] = 'Yes'
`;
// fetch all mentor queries
export const fetchAllMentorQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_dtls_cr_date],
    m.[mentor_dtls_update_date],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_pricing],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
`;

// to fetch the booking details and timeslots feedbacks also and everything this is working right now
export const fetchSingleMentorQueryWithBookings = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_pricing],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list,
    (
        SELECT 
            b.[mentor_dtls_id],
            b.[mentor_session_booking_date],
            b.[mentor_booked_date],
            b.[mentor_booking_starts_time],
            b.[mentor_booking_end_time],
            b.[mentor_booking_time],
            b.[mentor_booking_confirmed],
            b.[mentor_session_status]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT 
            f.[mentor_feedback_dtls_id],
            f.[mentor_appt_booking_dtls_id],
            f.[mentee_user_dtls_id],
            f.[mentor_feedback_session_relevant],
            f.[mentor_feedback_communication_skills],
            f.[mentor_feedback_session_appropriate],
            f.[mentor_feedback_detailed_fb],
            f.[mentor_feedback_add_fb_sugg],
            f.[mentor_feedback_another_session],
            f.[mentor_feedback_session_overall_rating]
        FROM 
            [dbo].[mentor_feedback_dtls] f
        WHERE 
            f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id 
AND 
    m.[mentor_approved_status] = 'Yes';

`;

export const fetchSingleMentorProfileForPublicQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status],
    m.[mentor_pricing],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date],
            t.[mentor_timeslot_booking_status]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list,
    (
        SELECT 
            b.[mentor_dtls_id],
            b.[mentor_session_booking_date],
            b.[mentor_booked_date],
            b.[mentor_booking_starts_time],
            b.[mentor_booking_end_time],
            b.[mentor_booking_time],
            b.[mentor_booking_confirmed],
            b.[mentor_session_status]
        FROM 
            [dbo].[mentor_booking_appointments_dtls] b
        WHERE 
            b.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS booking_dtls_list,
    ISNULL(
        (SELECT COUNT(*) 
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]),
        0
    ) AS feedback_count,
    (
        SELECT 
            f.[mentor_feedback_dtls_id],
            f.[mentor_appt_booking_dtls_id],
            f.[mentee_user_dtls_id],
            f.[mentor_feedback_detailed_fb],
            f.[mentor_feedback_add_fb_sugg],
            f.[mentor_feedback_session_overall_rating],
            f.[mentor_feedback_dtls_cr_date],
            mentee.[mentee_profile],
            uma.[user_firstname] as mentee_firstname,
            uma.[user_lastname] as mentee_lastname
        FROM 
            [dbo].[mentor_feedback_dtls] f
        JOIN
            [dbo].[mentee_dtls] mentee
        ON
            f.[mentee_user_dtls_id] = mentee.[mentee_user_dtls_id] 
        JOIN 
            [dbo].[users_dtls] uma
        ON
            f.[mentee_user_dtls_id] = uma.[user_dtls_id]
        WHERE 
            f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
        FOR JSON PATH
    ) AS feedback_details,
    (
        SELECT AVG(CAST(f.[mentor_feedback_session_overall_rating] AS FLOAT))
        FROM [dbo].[mentor_feedback_dtls] f
        WHERE f.[mentor_user_dtls_id] = m.[mentor_user_dtls_id]
    ) AS avg_mentor_rating
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE 
    u.[user_dtls_id] = @desired_mentor_dtls_id
AND 
    m.[mentor_approved_status] = 'Yes';
`;
// Prepare the SQL query
export const MentorBookingOrderQuery = `
            INSERT INTO [dbo].[mentor_bookings_raz_order_dtls] 
            (
                [mentor_booking_raz_dlts_id],
                [mentee_booking_raz_user_dtls_id],
                [mentee_email],
                [amount],
                [amount_due],
                [amount_paid],
                [attempts],
                [created_at],
                [currency],
                [entity],
                [id],
                [offer_id],
                [receipt],
                [status]
            ) 
            VALUES 
            (
                @mentorBookingRazDltsId,
                @menteeBookingRazUserDtlsId,
                @menteeEmail,
                @amount,
                @amountDue,
                @amountPaid,
                @attempts,
                @createdAt,
                @currency,
                @entity,
                @id,
                @offerId,
                @receipt,
                @status
            )
        `;

// Prepare the SQL query
export const MentorBookingAppointmentQuery = `
            INSERT INTO [dbo].[mentor_booking_appointments_dtls] 
            (
                [mentor_dtls_id],
                [mentee_user_dtls_id],
                [mentor_session_booking_date],
                [mentor_booked_date],
                [mentor_booking_starts_time],
                [mentor_booking_end_time],
                [mentor_booking_time],
                [mentor_amount],
                [mentor_options],
                [mentor_questions],
                [mentor_razorpay_payment_id],
                [mentor_razorpay_order_id],
                [mentor_razorpay_signature],
                [mentor_host_url],
                [trainee_join_url],
                [mentor_amount_paid_status]
            ) 
            VALUES 
            (
                @mentorDtlsId,
                @menteeUserDtlsId,
                @mentorSessionBookingDate,
                @mentorBookedDate,
                @mentorBookingStartsTime,
                @mentorBookingEndTime,
                @mentorBookingTime,
                @mentorAmount,
                @mentorOptions,
                @mentorQuestions,
                @mentorRazorpayPaymentId,
                @mentorRazorpayOrderId,
                @mentorRazorpaySignature,
                @mentorHostUrl,
                @traineeJoinUrl,
                @mentorAmountPaidStatus
            )
        `;

// fetch top 10 mentor queries in Home page
export const fetch10MentorQuery = `SELECT TOP 10
    u.[user_dtls_id],
    u.[user_email] AS mentor_email,
    u.[user_firstname] AS mentor_firstname,
    u.[user_lastname] AS mentor_lastname,
    u.[user_type],
    m.[mentor_user_dtls_id],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status],
    COUNT(mfd.[mentor_user_dtls_id]) AS feedback_count,
    AVG(mfd.[mentor_feedback_session_overall_rating]) AS avg_feedback_rating
FROM 
    [dbo].[users_dtls] u
LEFT JOIN 
    [dbo].[mentor_dtls] m
    ON u.[user_dtls_id] = m.[mentor_user_dtls_id]
LEFT JOIN 
    [dbo].[mentor_feedback_dtls] mfd
    ON m.[mentor_user_dtls_id] = mfd.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes'
GROUP BY
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_type],
    m.[mentor_user_dtls_id],
    m.[mentor_profile_photo],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_headline],
    m.[mentor_approved_status]
ORDER BY
    feedback_count DESC;
`;

export const fetchGuestLecturesQuery = `SELECT
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_email],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_country],
    m.[mentor_approved_status],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
WHERE
    m.[mentor_approved_status] = 'Yes' AND m.[mentor_guest_lectures_interest] = 'Yes' 
`;

// end of queries
export const testQuery = `SELECT 
    u.[user_dtls_id],
    u.[user_email],
    u.[user_firstname],
    u.[user_lastname],
    u.[user_phone_number],
    u.[user_type],
    u.[user_is_superadmin],
    m.[mentor_dtls_id],
    m.[mentor_user_dtls_id],
    m.[mentor_phone_number],
    m.[mentor_email],
    m.[mentor_profile_photo],
    m.[mentor_social_media_profile],
    m.[mentor_job_title],
    m.[mentor_company_name],
    m.[mentor_years_of_experience],
    m.[mentor_academic_qualification],
    m.[mentor_recommended_area_of_mentorship],
    m.[mentor_guest_lectures_interest],
    m.[mentor_curating_case_studies_interest],
    m.[mentor_sessions_free_of_charge],
    m.[mentor_language],
    m.[mentor_timezone],
    m.[mentor_country],
    m.[mentor_dtls_cr_date],
    m.[mentor_dtls_update_date],
    m.[mentor_headline],
    m.[mentor_approved_status],
    (
        SELECT 
            e.[mentor_expertise_id],
            e.[mentor_expertise],
            e.[mentor_exp_cr_date],
            e.[mentor_exp_update_date]
        FROM 
            [dbo].[mentor_expertise_dtls] e
        WHERE 
            e.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS expertise_list,
    (
        SELECT 
            p.[mentor_passion_id],
            p.[mentor_passion],
            p.[mentor_passion_cr_date],
            p.[mentor_passion_update_date]
        FROM 
            [dbo].[mentor_passion_dtls] p
        WHERE 
            p.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS passion_list,
    (
        SELECT 
            t.[mentor_timeslot_id],
            t.[mentor_dtls_id],
            t.[mentor_timeslot_day],
            t.[mentor_timeslot_from],
            t.[mentor_timeslot_to],
            t.[mentor_timeslot_rec_indicator],
            t.[mentor_timeslot_rec_end_timeframe],
            t.[mentor_timeslot_rec_cr_date]
        FROM 
            [dbo].[mentor_timeslots_dtls] t
        WHERE 
            t.[mentor_dtls_id] = m.[mentor_dtls_id]
        FOR JSON PATH
    ) AS timeslot_list
FROM 
    [dbo].[users_dtls] u
JOIN 
    [dbo].[mentor_dtls] m
ON 
    u.[user_dtls_id] = m.[mentor_user_dtls_id]
`;
