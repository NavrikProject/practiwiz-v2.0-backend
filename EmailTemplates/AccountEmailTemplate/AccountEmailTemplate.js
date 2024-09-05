export const accountCreatedEmailTemplate = (email, username, url) => {
  return {
    to: `${email}`, // Change to your recipient
    from: "no-reply@practiwiz.com", // Change to your verified sender
    subject: `Account created successfully`,
    html: `
  <section
  style="
    font-family: 'Poppins', sans-serif;
    background-color: #e9f5ff;
    padding: 50px 0;
  "
>
  <div
    style="
      max-width: 600px;
      margin: auto;
      padding: 40px;
      background-color: #ffffff;
      border-radius: 15px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    "
  >
    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://res.cloudinary.com/droa7dncb/image/upload/v1665987569/practiwiz-logo3_xifxbc.png"
        alt="Practiwiz Logo"
        style="max-width: 160px; margin-bottom: 20px;"
      />
      <h2
        style="
          font-size: 24px;
          text-transform: uppercase;
          color: #34495e;
          margin: 0;
        "
      >
        Welcome to Practiwiz
      </h2>
      <hr style="width: 80px; border: 1px solid #1abc9c; margin: 20px auto;" />
    </div>

    <div style="text-align: center; margin-bottom: 30px;">
      <img
        src="https://via.placeholder.com/600x200?text=Welcome+to+Practiwiz+Training+Program"
        alt="Welcome Banner"
        style="max-width: 100%; border-radius: 10px;"
      />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Hi <b>${username}</b>,
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      Congratulations! Your account has been successfully activated on <b>Practiwiz</b>.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      You can now log in and explore our services whenever you like. We're thrilled to have you with us!
    </p>

    <div
      style="
        text-align: center;
        margin: 30px 0;
      "
    >
      <a
        href="${url}"
        style="
          text-decoration: none;
          padding: 15px 40px;
          background-color: #1abc9c;
          color: #ffffff;
          border-radius: 50px;
          font-size: 16px;
          display: inline-block;
          box-shadow: 0 5px 15px rgba(26, 188, 156, 0.3);
        "
        >Log In Now</a
      >
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <img
        src="https://via.placeholder.com/600x200?text=Explore+Our+Services"
        alt="Explore Services"
        style="max-width: 100%; border-radius: 10px;"
      />
    </div>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      We look forward to supporting your journey and helping you achieve your goals.
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555;">
      If you have any questions, feel free to reach out to us at 
      <a href="mailto:wecare@practiwiz.com" style="color: #1abc9c; text-decoration: none;">
        wecare@practiwiz.com
      </a>. We're here to help!
    </p>

    <p style="font-size: 16px; line-height: 1.8; color: #555; margin-top: 40px;">
      Best Regards,<br />The Practiwiz Team
    </p>

    <div style="text-align: center; margin-top: 40px;">
      <img
        src="https://via.placeholder.com/150x50?text=Practiwiz+Footer+Logo"
        alt="Practiwiz Footer Logo"
        style="max-width: 120px;"
      />
    </div>
  </div>
</section>

    `,
  };
};
