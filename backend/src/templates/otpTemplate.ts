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

// export const claimStudentTemplate = (studentEmail: string, itemName: string, imageUrl: string) => `
//   <div style="font-family: Arial; padding: 20px;">
//     <h2>Claim Request Received</h2>
//     <p>Your claim request has been received and is being processed.</p>
    
//     <p><strong>Registered Email:</strong> ${studentEmail}</p>
//     <h3>Item: ${itemName}</h3>

//     <img src="${imageUrl}" 
//          width="200" style="margin-top:12px;border-radius:8px;" />

//     <p>Please visit the Lost & Found office to complete verification.</p>
//     <p style="margin-top:10px;">Make sure to bring your Student ID.</p>

//     <p><strong>Office Hours:</strong> Monday-Friday, 9AM-5PM</p>
//     <p><strong>Location:</strong> Campus Building A, Room 101</p>
//   </div>
// `;

// export const claimAdminTemplate = (studentEmail: string, itemName: string, imageUrl: string) => `
//   <div style="font-family: Arial; padding: 20px;">
//     <h2>New Item Claim Submitted</h2>

//     <p><strong>Student Email:</strong> ${studentEmail}</p>
//     <p><strong>Claimed Item:</strong> ${itemName}</p>
//     <p><strong>Item Description:</strong> Please check the image for item details</p>

//     <img src="${imageUrl}" 
//          width="200" style="margin-top:12px;border-radius:8px;" />

//     <p>Please verify the student's identity and handle the item handover process.</p>
//   </div>
// `;