/**
 * MEDIQ Pharma Inc. — Branded HTML Contact Mailer & Auto-Responder (Google Apps Script)
 * ====================================================================================
 * Matches the official MEDIQ inquiry & confirmation card design:
 *   - Sends from display name "MEDIQ Pharma Inc." <mediqtechsupport@gmail.com>
 *   - Embeds official white MEDIQ PNG logo inline via cid:mediqLogo
 *   - Dispatches BOTH the branded inquiry notification to mediqtechsupport@gmail.com
 *     AND an automatic confirmation email to the sender's email address.
 *
 * SETUP (1 minute, free under mediqtechsupport@gmail.com):
 *   1. Open https://script.google.com while signed into mediqtechsupport@gmail.com -> New project.
 *   2. Paste this entire file into Code.gs and Save.
 *   3. Click Deploy -> New deployment -> Web app:
 *        Execute as: Me (mediqtechsupport@gmail.com)
 *        Who has access: Anyone
 *      Authorize when prompted, then copy the Web App URL (https://script.google.com/macros/s/.../exec).
 *   4. Paste that Web App URL into CUSTOM_MAILER_URL in assets/js/main.js.
 */

var MEDIQ_TARGET_EMAIL = 'mediqtechsupport@gmail.com';
var MEDIQ_SENDER_NAME = 'MEDIQ Pharma Inc.';
var MEDIQ_LOGO_WHITE_BASE64 = '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';

function escapeHtml_(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getLogoInlineBlob_() {
  var bytes = Utilities.base64Decode(MEDIQ_LOGO_WHITE_BASE64);
  return Utilities.newBlob(bytes, 'image/png', 'mediq-logo-white.png');
}

function buildAdminNotificationHtml_(data) {
  var contactName = escapeHtml_(data.contact_name || data.name);
  var org = escapeHtml_(data.organization);
  var emailAddr = escapeHtml_(data.email_address || data.email);
  var topic = escapeHtml_(data.inquiry_topic || data.topic || 'General Institutional Inquiry');
  var message = escapeHtml_(data.message).replace(/\n/g, '<br>');
  var refId = escapeHtml_(data.reference || data.referenceId);
  var ts = escapeHtml_(data.submitted_at || data.submittedAt);

  return (
    '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#eef3f9;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;color:#0f172a;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef3f9;padding:28px 16px;"><tr><td align="center">' +
    '<table role="presentation" width="580" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9e3f0;">' +
      '<tr><td style="background:#05132e;padding:28px 34px 30px;">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;"><tr>' +
          '<td align="left" valign="middle">' +
            '<table cellspacing="0" cellpadding="0" border="0"><tr>' +
              '<td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:9px;height:9px;border-radius:999px;background:#38a3f1;"></span></td>' +
              '<td valign="middle"><img src="cid:mediqLogo" alt="MEDIQ PHARMA" height="22" style="display:block;height:22px;width:auto;border:0;" /></td>' +
            '</tr></table>' +
          '</td>' +
          '<td align="right" valign="middle" style="font-size:12px;color:#93c5fd;">' + ts + '</td>' +
        '</tr></table>' +
        '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#60a5fa;">NEW INQUIRY</p>' +
        '<h1 style="margin:0 0 4px;font-size:27px;line-height:1.2;font-weight:700;color:#ffffff;">' + contactName + '</h1>' +
        '<p style="margin:0 0 22px;font-size:14.5px;line-height:1.45;color:#cbd5e1;">' + org + '</p>' +
        '<table cellspacing="0" cellpadding="0" border="0"><tr>' +
          '<td valign="middle" style="padding-right:10px;"><span style="display:inline-block;padding:6px 15px;border-radius:999px;background:#38a3f1;color:#041022;font-size:12px;font-weight:700;">' + topic + '</span></td>' +
          '<td valign="middle"><span style="display:inline-block;padding:5px 15px;border-radius:999px;border:1px solid #35598c;background:#0a214a;color:#dbeafe;font-size:12px;font-family:monospace;">Ref ' + refId + '</span></td>' +
        '</tr></table>' +
      '</td></tr>' +
      '<tr><td style="padding:30px 34px 28px;background:#ffffff;">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-bottom:1px solid #e2e8f0;"><tr>' +
          '<td width="50%" valign="top" style="padding:0 12px 18px 0;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">CONTACT</p><p style="margin:0;font-size:14.5px;font-weight:600;color:#0a1d40;">' + contactName + '</p></td>' +
          '<td width="50%" valign="top" style="padding:0 0 18px 12px;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">ORGANIZATION</p><p style="margin:0;font-size:14.5px;font-weight:600;color:#0a1d40;">' + org + '</p></td>' +
        '</tr></table>' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0"><tr>' +
          '<td width="50%" valign="top" style="padding:18px 12px 22px 0;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">EMAIL</p><p style="margin:0;font-size:14.5px;font-weight:500;"><a href="mailto:' + emailAddr + '" style="color:#0284c7;text-decoration:none;">' + emailAddr + '</a></p></td>' +
          '<td width="50%" valign="top" style="padding:18px 0 22px 12px;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">TOPIC</p><p style="margin:0;font-size:14.5px;font-weight:600;color:#0a1d40;">' + topic + '</p></td>' +
        '</tr></table>' +
        '<p style="margin:2px 0 10px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">MESSAGE</p>' +
        '<div style="margin:0 0 26px;padding:18px 20px;background:#f0f6fc;border-left:3px solid #38a3f1;border-radius:0 10px 10px 0;font-size:14px;line-height:1.65;color:#1e293b;">' + message + '</div>' +
        '<table cellspacing="0" cellpadding="0" border="0" style="margin-bottom:16px;"><tr><td style="border-radius:999px;background:#38a3f1;">' +
          '<a href="mailto:' + emailAddr + '" style="display:inline-block;padding:12px 26px;font-size:14px;font-weight:700;color:#041022;text-decoration:none;border-radius:999px;">Reply to ' + contactName + ' &rarr;</a>' +
        '</td></tr></table>' +
        '<p style="margin:0;font-size:12px;color:#64748b;">Replies go straight to the sender. Please quote the reference number.</p>' +
      '</td></tr>' +
      '<tr><td style="background:#061634;padding:20px 34px;font-size:12px;line-height:1.6;color:#93c5fd;">' +
        '<strong style="color:#ffffff;">MEDIQ Pharma Inc.</strong> &middot; Philippine National Commercial Desk<br/>' +
        '<span style="color:#94a3b8;">Marikina &ndash; Pasig, Metro Manila &middot; mediqvision.com</span>' +
      '</td></tr>' +
    '</table></td></tr></table></body></html>'
  );
}

function buildSenderConfirmationHtml_(data) {
  var contactName = escapeHtml_(data.contact_name || data.name);
  var org = escapeHtml_(data.organization);
  var topic = escapeHtml_(data.inquiry_topic || data.topic || 'General Institutional Inquiry');
  var message = escapeHtml_(data.message).replace(/\n/g, '<br>');
  var refId = escapeHtml_(data.reference || data.referenceId);
  var ts = escapeHtml_(data.submitted_at || data.submittedAt);

  return (
    '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#eef3f9;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;color:#0f172a;">' +
    '<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#eef3f9;padding:28px 16px;"><tr><td align="center">' +
    '<table role="presentation" width="580" cellspacing="0" cellpadding="0" border="0" style="max-width:580px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #d9e3f0;">' +
      '<tr><td style="background:#05132e;padding:28px 34px 30px;">' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-bottom:24px;"><tr>' +
          '<td align="left" valign="middle">' +
            '<table cellspacing="0" cellpadding="0" border="0"><tr>' +
              '<td valign="middle" style="padding-right:10px;"><span style="display:inline-block;width:9px;height:9px;border-radius:999px;background:#34d399;"></span></td>' +
              '<td valign="middle"><img src="cid:mediqLogo" alt="MEDIQ PHARMA" height="22" style="display:block;height:22px;width:auto;border:0;" /></td>' +
            '</tr></table>' +
          '</td>' +
          '<td align="right" valign="middle" style="font-size:12px;color:#93c5fd;">' + ts + '</td>' +
        '</tr></table>' +
        '<p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#6ee7b7;">CONFIRMATION RECEIPT</p>' +
        '<h1 style="margin:0 0 6px;font-size:24px;line-height:1.25;font-weight:700;color:#ffffff;">We received your message, ' + contactName + '</h1>' +
        '<p style="margin:0 0 22px;font-size:14.5px;line-height:1.45;color:#cbd5e1;">Logged for ' + org + ' &bull; MEDIQ Commercial &amp; Technical Desk</p>' +
        '<table cellspacing="0" cellpadding="0" border="0"><tr>' +
          '<td valign="middle" style="padding-right:10px;"><span style="display:inline-block;padding:6px 15px;border-radius:999px;background:#38a3f1;color:#041022;font-size:12px;font-weight:700;">' + topic + '</span></td>' +
          '<td valign="middle"><span style="display:inline-block;padding:5px 15px;border-radius:999px;border:1px solid #1e604e;background:#0a2a24;color:#a7f3d0;font-size:12px;font-family:monospace;">Ref ' + refId + '</span></td>' +
        '</tr></table>' +
      '</td></tr>' +
      '<tr><td style="padding:30px 34px 28px;background:#ffffff;">' +
        '<p style="margin:0 0 22px;font-size:14px;line-height:1.65;color:#334155;">Thank you for contacting <strong>MEDIQ Pharma and Medical Supplies Distribution Inc.</strong> We have received your inquiry and a representative will reach out to you shortly.</p>' +
        '<table width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;margin-bottom:22px;"><tr>' +
          '<td width="50%" valign="top" style="padding:16px 12px 16px 0;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">ORGANIZATION</p><p style="margin:0;font-size:14.5px;font-weight:600;color:#0a1d40;">' + org + '</p></td>' +
          '<td width="50%" valign="top" style="padding:16px 0 16px 12px;"><p style="margin:0 0 5px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">TOPIC</p><p style="margin:0;font-size:14.5px;font-weight:600;color:#0a1d40;">' + topic + '</p></td>' +
        '</tr></table>' +
        '<p style="margin:0 0 10px;font-size:10.5px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#64748b;">YOUR SUBMITTED MESSAGE</p>' +
        '<div style="margin:0 0 24px;padding:18px 20px;background:#f0f6fc;border-left:3px solid #38a3f1;border-radius:0 10px 10px 0;font-size:14px;line-height:1.65;color:#1e293b;">' + message + '</div>' +
        '<div style="padding:16px 18px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:13px;line-height:1.75;color:#334155;">' +
          '<strong style="color:#0a1d40;">Direct Institutional Channels</strong><br/>' +
          'Mobile / Viber: <a href="tel:+639457954365" style="color:#0284c7;text-decoration:none;font-weight:600;">+63 945 795 4365</a><br/>' +
          'Telegram: <a href="https://t.me/mediqpharma" style="color:#0284c7;text-decoration:none;font-weight:600;">t.me/mediqpharma</a><br/>' +
          'Email: <a href="mailto:mediqtechsupport@gmail.com" style="color:#0284c7;text-decoration:none;font-weight:600;">mediqtechsupport@gmail.com</a>' +
        '</div>' +
      '</td></tr>' +
      '<tr><td style="background:#061634;padding:20px 34px;font-size:12px;line-height:1.6;color:#93c5fd;">' +
        '<strong style="color:#ffffff;">MEDIQ Pharma Inc.</strong> &middot; Philippine National Commercial Desk<br/>' +
        '<span style="color:#94a3b8;">Marikina &ndash; Pasig, Metro Manila &middot; Exclusive Distributor of Rayner UK</span>' +
      '</td></tr>' +
    '</table></td></tr></table></body></html>'
  );
}

function doPost(e) {
  try {
    var raw = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = JSON.parse(raw);
    var senderEmail = data.email_address || data.email;
    var senderName = data.contact_name || data.name;
    if (!senderEmail || !senderName) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: 'Missing required fields' }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var logoBlob = getLogoInlineBlob_();
    var refId = data.reference || data.referenceId || ('MQ-' + String(Date.now()).slice(-6));
    data.reference = refId;
    if (!data.submitted_at && !data.submittedAt) {
      data.submitted_at = Utilities.formatDate(new Date(), 'Asia/Manila', 'MMM dd, yyyy \u00b7 h:mm a');
    }

    MailApp.sendEmail({
      to: MEDIQ_TARGET_EMAIL,
      // When deployed on a separate sender Gmail account (e.g. mediqwebsite.mailer@gmail.com),
      // Gmail displays the inquirer's name instead of "me" in mediqtechsupport@gmail.com's inbox.
      name: senderName + ' (MEDIQ Inquiry)',
      replyTo: senderEmail,
      subject: data.subject || ('[MEDIQ Inquiry] ' + senderName + ' (' + (data.organization || refId) + ')'),
      htmlBody: buildAdminNotificationHtml_(data),
      inlineImages: { mediqLogo: logoBlob }
    });

    MailApp.sendEmail({
      to: senderEmail,
      name: MEDIQ_SENDER_NAME,
      replyTo: MEDIQ_TARGET_EMAIL,
      subject: '[MEDIQ Confirmation ' + refId + '] We have received your message',
      htmlBody: buildSenderConfirmationHtml_(data),
      inlineImages: { mediqLogo: logoBlob }
    });

    return ContentService.createTextOutput(JSON.stringify({ ok: true, reference: refId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
