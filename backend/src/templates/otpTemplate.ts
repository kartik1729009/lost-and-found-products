export const otpTemplate = (otp: string) => `
  <div style="font-family: Arial; padding: 20px;">
    <h2>Your Verification Code</h2>
    <p>Use the OTP below to verify your login:</p>

    <h1 style="background: #f3f3f3; padding: 10px; width: max-content; border-radius: 6px;">
      ${otp}
    </h1>

    <p>This OTP is valid for 10 minutes.</p>

    <img src="https://upload.wikimedia.org/wikipedia/commons/5/56/Tiger.50.jpg" 
         width="200" style="margin-top:12px;border-radius:8px;" />
  </div>
`;
