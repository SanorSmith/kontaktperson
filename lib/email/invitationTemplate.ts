// ============================================
// Email Template: Social Worker Invitation
// ============================================

export interface InvitationEmailData {
  name: string;
  municipality: string;
  department: string;
  position: string;
  work_email: string;
  access_level: string;
  activation_link: string;
  invited_by_name: string;
  expires_in_days: number;
}

export function generateInvitationEmailHTML(data: InvitationEmailData): string {
  const accessLevelText = {
    viewer: 'Läsare - Kan söka och visa volontärer',
    approver: 'Godkännare - Kan godkänna/avslå ansökningar',
    admin: 'Administratör - Full behörighet för kommunen'
  }[data.access_level] || data.access_level;

  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Inbjudan till Kontaktperson Platform</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #2C3E50;
      background-color: #F8F9FA;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #003D5C 0%, #006B7D 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .header .icon {
      width: 60px;
      height: 60px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 30px;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #003D5C;
      font-size: 24px;
      margin: 0 0 20px 0;
      font-weight: 600;
    }
    .content p {
      line-height: 1.6;
      margin: 0 0 16px 0;
      color: #475569;
    }
    .info-box {
      background: #E8F4F8;
      border-left: 4px solid #006B7D;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .info-box h3 {
      margin: 0 0 15px 0;
      color: #003D5C;
      font-size: 16px;
      font-weight: 600;
    }
    .info-box p {
      margin: 8px 0;
      color: #2C3E50;
      font-size: 14px;
    }
    .info-box strong {
      color: #003D5C;
      font-weight: 600;
    }
    .button-container {
      text-align: center;
      margin: 40px 0;
    }
    .button {
      display: inline-block;
      background: #F39C12;
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
      box-shadow: 0 4px 12px rgba(243, 156, 18, 0.3);
      transition: all 0.3s ease;
    }
    .button:hover {
      background: #E67E22;
      box-shadow: 0 6px 16px rgba(243, 156, 18, 0.4);
    }
    .warning-box {
      background: #FFF3CD;
      border: 1px solid #FFE69C;
      border-radius: 8px;
      padding: 16px;
      margin: 30px 0;
    }
    .warning-box p {
      margin: 0;
      font-size: 14px;
      color: #856404;
    }
    .footer {
      background: #F8F9FA;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #E2E8F0;
    }
    .footer p {
      margin: 8px 0;
      font-size: 13px;
      color: #94A3B8;
    }
    .footer a {
      color: #006B7D;
      text-decoration: none;
    }
    .footer a:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background: #E2E8F0;
      margin: 30px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .header {
        padding: 30px 20px;
      }
      .button {
        padding: 14px 30px;
        font-size: 15px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Header -->
    <div class="header">
      <div class="icon">👥</div>
      <h1>Kontaktperson Platform</h1>
    </div>
    
    <!-- Content -->
    <div class="content">
      <h2>Välkommen, ${data.name}! 👋</h2>
      
      <p>Du har blivit inbjuden av <strong>${data.invited_by_name}</strong> att använda Kontaktperson Platform för <strong>${data.municipality}</strong>.</p>
      
      <p>Kontaktperson Platform är ett säkert verktyg för att koppla samman kommuner med engagerade volontärer som kan bli kontaktpersoner för era klienter.</p>
      
      <!-- User Info Box -->
      <div class="info-box">
        <h3>📋 Dina uppgifter</h3>
        <p><strong>Roll:</strong> ${data.position}</p>
        <p><strong>Avdelning:</strong> ${data.department}</p>
        <p><strong>Kommun:</strong> ${data.municipality}</p>
        <p><strong>Arbetsmail:</strong> ${data.work_email}</p>
        <p><strong>Behörighetsnivå:</strong> ${accessLevelText}</p>
      </div>
      
      <p>För att komma igång behöver du aktivera ditt konto och sätta ett lösenord. Klicka på knappen nedan:</p>
      
      <!-- CTA Button -->
      <div class="button-container">
        <a href="${data.activation_link}" class="button">
          🔐 Aktivera mitt konto
        </a>
      </div>
      
      <!-- Warning Box -->
      <div class="warning-box">
        <p>
          ⏰ <strong>Viktigt:</strong> Denna inbjudan är giltig i ${data.expires_in_days} dagar. 
          Om länken har löpt ut, kontakta din administratör för att få en ny inbjudan.
        </p>
      </div>
      
      <div class="divider"></div>
      
      <p style="font-size: 14px; color: #64748B;">
        <strong>Vad händer härnäst?</strong><br>
        1. Klicka på aktiveringslänken ovan<br>
        2. Sätt ett säkert lösenord (minst 8 tecken)<br>
        3. Acceptera användarvillkoren<br>
        4. Börja använda plattformen direkt!
      </p>
      
      <div class="divider"></div>
      
      <p style="font-size: 13px; color: #94A3B8;">
        Om du inte begärt detta konto eller fått detta mail av misstag, vänligen kontakta din IT-avdelning eller kommunens administratör.
      </p>
    </div>
    
    <!-- Footer -->
    <div class="footer">
      <p style="font-weight: 600; color: #64748B; margin-bottom: 12px;">
        Kontaktperson Platform
      </p>
      <p>
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/privacy">Integritetspolicy</a> · 
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/terms">Användarvillkor</a> · 
        <a href="${process.env.NEXT_PUBLIC_BASE_URL}/contact">Kontakt</a>
      </p>
      <p style="margin-top: 16px;">
        © ${new Date().getFullYear()} Kontaktperson Platform AB
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateInvitationEmailText(data: InvitationEmailData): string {
  const accessLevelText = {
    viewer: 'Läsare - Kan söka och visa volontärer',
    approver: 'Godkännare - Kan godkänna/avslå ansökningar',
    admin: 'Administratör - Full behörighet för kommunen'
  }[data.access_level] || data.access_level;

  return `
Välkommen till Kontaktperson Platform!

Hej ${data.name},

Du har blivit inbjuden av ${data.invited_by_name} att använda Kontaktperson Platform för ${data.municipality}.

DINA UPPGIFTER:
- Roll: ${data.position}
- Avdelning: ${data.department}
- Kommun: ${data.municipality}
- Arbetsmail: ${data.work_email}
- Behörighetsnivå: ${accessLevelText}

AKTIVERA DITT KONTO:
Klicka på länken nedan för att aktivera ditt konto och sätta ett lösenord:

${data.activation_link}

VIKTIGT: Denna inbjudan är giltig i ${data.expires_in_days} dagar.

VAD HÄNDER HÄRNÄST?
1. Klicka på aktiveringslänken
2. Sätt ett säkert lösenord (minst 8 tecken)
3. Acceptera användarvillkoren
4. Börja använda plattformen direkt!

Om du inte begärt detta konto, kontakta din IT-avdelning.

Med vänliga hälsningar,
Kontaktperson Platform

---
Kontaktperson Platform AB
${process.env.NEXT_PUBLIC_BASE_URL}
  `.trim();
}

// Resend invitation email (simpler version)
export function generateResendInvitationEmailHTML(data: InvitationEmailData): string {
  return `
<!DOCTYPE html>
<html lang="sv">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ny inbjudan till Kontaktperson Platform</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #2C3E50;
      background-color: #F8F9FA;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: #003D5C;
      color: white;
      padding: 30px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      background: #F39C12;
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      background: #F8F9FA;
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Ny inbjudan skickad</h1>
    </div>
    <div class="content">
      <p>Hej ${data.name},</p>
      <p>Din tidigare inbjudan till Kontaktperson Platform har löpt ut. Här är en ny aktiveringslänk:</p>
      <div style="text-align: center;">
        <a href="${data.activation_link}" class="button">Aktivera mitt konto</a>
      </div>
      <p style="font-size: 14px; color: #64748B;">
        Denna länk är giltig i ${data.expires_in_days} dagar.
      </p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Kontaktperson Platform AB</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
