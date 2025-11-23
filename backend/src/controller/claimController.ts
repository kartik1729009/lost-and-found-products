import { Request, Response } from "express";
import nodemailer from "nodemailer";

export const submitClaimController = async (req: Request, res: Response) => {
  try {
    // Get data from request body
    const { studentEmail, itemName, imageUrl } = req.body;

    // Validate required fields
    if (!studentEmail || !itemName || !imageUrl) {
      return res.status(400).json({
        success: false,
        message: "studentEmail, itemName and imageUrl are required"
      });
    }

    // Check environment variables
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const adminEmail = process.env.ADMIN_EMAIL;

    if (!smtpUser || !smtpPass) {
      return res.status(500).json({
        success: false,
        message: "SMTP configuration missing"
      });
    }

    if (!adminEmail) {
      return res.status(500).json({
        success: false,
        message: "ADMIN_EMAIL not configured"
      });
    }

    // Create new transporter (completely separate)
    const claimTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    // Create email templates
    const studentEmailHtml = `
      <div style="font-family: Arial; padding: 20px;">
        <div style="text-align: center; background: #2c3e50; color: white; padding: 15px; border-radius: 8px;">
          <h1 style="margin: 0;">K.R. Mangalam University</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Lost & Found Department</p>
        </div>
        
        <h2>Claim Request Received</h2>
        <p>Your claim request has been received and is being processed by the K.R. Mangalam University Lost & Found Department.</p>
        
        <p><strong>Registered Email:</strong> ${studentEmail}</p>
        <h3>Item: ${itemName}</h3>

        <img src="${imageUrl}" 
             width="200" style="margin-top:12px;border-radius:8px;" />

        <p>Please visit the K.R. Mangalam University Lost & Found office to complete verification and collect your item.</p>
        <p style="margin-top:10px;">Make sure to bring your K.R. Mangalam University Student ID and the original bill or purchase receipt for verification purposes.</p>
        <p>Without proper documentation and identification, we cannot release the item to you as per university policy.</p>

        <p><strong>Office Hours:</strong> Monday-Friday, 9AM-5PM</p>
        <p><strong>Location:</strong> K.R. Mangalam University Campus, Administration Block, Room 101</p>
        <p><strong>Contact:</strong> lostfound@krmangalam.edu | +1 (555) 123-4567</p>
        
        <div style="margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 6px;">
          <p style="margin: 0; color: #666; font-size: 14px;">K.R. Mangalam University - Committed to Student Welfare and Security</p>
        </div>
      </div>
    `;

    const adminEmailHtml = `
      <div style="font-family: Arial; padding: 20px;">
        <div style="text-align: center; background: #2c3e50; color: white; padding: 15px; border-radius: 8px;">
          <h1 style="margin: 0;">K.R. Mangalam University</h1>
          <p style="margin: 5px 0 0 0; font-size: 16px;">Lost & Found Department - Admin Notification</p>
        </div>
        
        <h2>New Item Claim Submitted</h2>
        <p>A K.R. Mangalam University student has submitted a claim request for a lost item in the university's lost and found system.</p>

        <p><strong>Student Email:</strong> ${studentEmail}</p>
        <p><strong>Claimed Item:</strong> ${itemName}</p>
        <p><strong>Claim Date:</strong> ${new Date().toLocaleDateString()}</p>
        <p><strong>Item Description:</strong> Student has claimed this item from the K.R. Mangalam University lost and found section. Please verify the claim details below.</p>

        <img src="${imageUrl}" 
             width="200" style="margin-top:12px;border-radius:8px;" />

        <p><strong>Action Required:</strong> Please contact the K.R. Mangalam University student to schedule item handover and verify their identity along with original purchase receipt or bill.</p>
        <p>Ensure proper documentation is maintained for the handover process as per K.R. Mangalam University guidelines.</p>
        <p>The student has been instructed to bring their K.R. Mangalam University Student ID and purchase proof for verification.</p>
        
        <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 6px;">
          <p style="margin: 0; color: #2c3e50; font-size: 14px;"><strong>K.R. Mangalam University Protocol:</strong> All item handovers must be properly documented and verified by authorized personnel only.</p>
        </div>
      </div>
    `;

    // Send student email
    const studentEmailInfo = await claimTransporter.sendMail({
      from: `"K.R. Mangalam University Lost & Found" <${smtpUser}>`,
      to: studentEmail,
      subject: "K.R. Mangalam University - Your Claim Request Has Been Received",
      html: studentEmailHtml,
    });

    // Send admin email
    const adminEmailInfo = await claimTransporter.sendMail({
      from: `"K.R. Mangalam University Lost & Found" <${smtpUser}>`,
      to: adminEmail,
      subject: "K.R. Mangalam University - New Item Claim Submitted - Action Required",
      html: adminEmailHtml,
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Claim emails sent successfully",
      studentMessageId: studentEmailInfo.messageId,
      adminMessageId: adminEmailInfo.messageId
    });

  } catch (error: any) {
    console.error("Claim submission error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to submit claim",
      error: error.message
    });
  }
};