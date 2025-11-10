const fs = require("fs");
const path = require("path");
const pdfService = require("../services/machine-learning/pdf.service");

const pdfsPath = path.join(__dirname, "../models/test-files/pdfs");
const outputPath = path.join(__dirname, "../models/training-data/emails.json");

const categories = {
  peminjaman: { folder: "peminjaman", sender: "peminjaman@university.ac.id" },
  izin: { folder: "izin", sender: "izin@university.ac.id" },
  pengaduan: { folder: "pengaduan", sender: "pengaduan@university.ac.id" },
};

const SAMPLES_PER_CATEGORY = 50;

const spamTemplates = [
  {
    subjects: [
      "CONGRATULATIONS!!! You Won $10,000 Cash Prize!!!",
      "YOU ARE THE LUCKY WINNER OF $50,000!!!",
      "CLAIM YOUR $25,000 PRIZE MONEY NOW!!!",
      "🎉 YOU WON $100,000 - CLAIM IMMEDIATELY!!!",
      "BREAKING: You've Won the Mega Lottery!!!",
    ],
    bodies: [
      "DEAR LUCKY WINNER! You have been randomly selected from 10 million participants to receive ${amount} USD cash prize! This is 100% REAL and LEGITIMATE! Click this link IMMEDIATELY to claim your reward before {date}! DON'T MISS THIS OPPORTUNITY! ACT NOW!!!",
      "Congratulations! Your email has won ${amount} in our international lottery draw! To claim your prize, click here and provide your banking details. This offer expires in 24 hours!",
      "YOU ARE A WINNER! We are pleased to inform you that you have won ${amount} in cash! No purchase necessary! Claim your prize by clicking this link now!",
    ],
  },
  {
    subjects: [
      "URGENT: Your Bank Account Will Be Suspended!",
      "FINAL WARNING: Verify Your Account Now!",
      "ALERT: Unusual Activity Detected on Your Account",
      "Your Account Has Been Locked - Verify Immediately",
      "Security Alert: Your Account Will Be Closed",
    ],
    bodies: [
      "URGENT ACTION REQUIRED! We detected suspicious activity on your bank account. Your account will be PERMANENTLY CLOSED in 24 HOURS if you don't verify your identity immediately. Click here to verify now: {link}",
      "Dear Customer, We have temporarily limited your account due to security concerns. Please verify your information within 48 hours to restore full access. Failure to do so will result in permanent account closure.",
      "Security Alert! Multiple login attempts from unknown locations. Your account has been locked for your protection. Verify your identity now to unlock: {link}",
    ],
  },
  {
    subjects: [
      "Make $5,000 Per Day Working From Home - No Experience!",
      "Earn $10,000/Month From Your Laptop!",
      "Work From Home: $500/Day Guaranteed Income!",
      "Be Your Own Boss - Make $3,000 Weekly!",
      "Easy Money: $8,000/Month Working 2 Hours Daily",
    ],
    bodies: [
      "Amazing work from home opportunity! Earn ${amount} per day with ZERO experience needed! Flexible hours! Be your own boss! Join thousands of people already making money! Limited slots available! Click here to start NOW!",
      "Stop working 9-5! Make ${amount} per month working from home on your own schedule. No experience required. No selling. No recruiting. Just easy money! Sign up now!",
      "Exclusive opportunity: Earn ${amount} weekly from home! Simple tasks, flexible hours, no experience needed. Join now before spots fill up!",
    ],
  },
  {
    subjects: [
      "FREE iPhone 15 Pro Max - 100% FREE - Claim Today!",
      "Get Your Free MacBook Pro - Limited Offer!",
      "Claim Your FREE Samsung Galaxy S24 Ultra Now!",
      "🎁 FREE PlayStation 5 - No Payment Required!",
      "Win a FREE Tesla Model 3 - Enter Now!",
    ],
    bodies: [
      "Congratulations! You've been selected to receive a BRAND NEW {product} ABSOLUTELY FREE! No payment, no shipping fee! This is a limited time offer! Click here to claim yours before stock runs out!",
      "SPECIAL OFFER: Get your {product} completely FREE! Just pay $1 shipping. Limited quantity available. Don't miss out on this incredible deal!",
      "You've been chosen! Claim your FREE {product} today! No strings attached! Simply click here and enter your shipping details. Hurry, only 10 left!",
    ],
  },
  {
    subjects: [
      "Hot Singles in Your Area Want to Meet You Tonight!",
      "Beautiful Women Are Waiting to Chat with You!",
      "Find Your Perfect Match Tonight - 100% Free!",
      "Lonely? Meet Singles Near You Right Now!",
      "Thousands of Singles Want to Meet You!",
    ],
    bodies: [
      "Meet beautiful single women in your area TONIGHT! 100% free to join! Thousands of profiles! Start chatting instantly! No credit card required! Click here: {link}",
      "Feeling lonely? Connect with attractive singles in your city tonight! Free registration! Real profiles! Start messaging now!",
      "Don't spend another night alone! Thousands of singles are waiting to meet you. Join free and start dating tonight!",
    ],
  },
  {
    subjects: [
      "You have inherited $5 Million USD from a distant relative",
      "Urgent: Inheritance Fund of $8.5M Awaiting Your Claim",
      "Unclaimed Inheritance: $12 Million in Your Name",
      "Your Late Uncle Left You $7.2 Million",
      "Family Inheritance: $9M Awaiting Transfer",
    ],
    bodies: [
      "Dear Sir/Madam, I am writing to inform you that you have inherited ${amount} from your late uncle in Nigeria. To claim this inheritance, please send your bank details and processing fee of $500.",
      "Greetings! I am a lawyer representing your late relative who left an estate worth ${amount}. As the sole beneficiary, you need to pay legal fees of $1,000 to process the transfer.",
      "Confidential: Your distant relative passed away leaving ${amount} inheritance. Contact us immediately with your banking information to claim your funds.",
    ],
  },
  {
    subjects: [
      "FINAL WARNING: Your Computer is Infected with Virus!!!",
      "CRITICAL ALERT: 24 Viruses Detected on Your PC!",
      "Your Computer Has Been Infected - Act Now!",
      "MALWARE WARNING: Your Files Will Be Deleted!",
      "Virus Alert: Your System is Compromised!",
    ],
    bodies: [
      "CRITICAL ALERT! Your computer has been infected with 24 viruses! Your files will be deleted in 12 hours! Click here to download antivirus software NOW! Don't wait!",
      "WARNING! We detected {number} malicious threats on your device. Your personal information is at risk! Download our security software immediately to protect your computer!",
      "URGENT: Your PC is infected with dangerous malware! All your files will be encrypted unless you take action now. Click here to remove viruses!",
    ],
  },
  {
    subjects: [
      "Lose 30 Pounds in 7 Days - Miracle Weight Loss Pill!",
      "Burn Fat While You Sleep - Revolutionary Formula!",
      "Lose Weight Without Diet or Exercise - Guaranteed!",
      "Shocking: Lose 50 Pounds in 2 Weeks!",
      "Celebrity Secret: Weight Loss Breakthrough!",
    ],
    bodies: [
      "Revolutionary weight loss breakthrough! Lose {amount} pounds in just 7 days WITHOUT DIET OR EXERCISE! 100% natural ingredients! FDA approved! Order now and get 3 bottles FREE!",
      "Doctors hate this! New weight loss pill melts fat overnight! Lose up to {amount} pounds per week! No side effects! Limited supply available!",
      "Celebrity-endorsed weight loss secret revealed! Drop {amount} pounds in {days} days! No exercise needed! Risk-free trial!",
    ],
  },
  {
    subjects: [
      "Bitcoin Investment - Make 500% Profit in 30 Days",
      "Crypto Trading Bot - 99% Win Rate Guaranteed!",
      "Turn $100 into $10,000 with Bitcoin Trading!",
      "Cryptocurrency Secret: Make $5,000 Daily!",
      "Guaranteed Bitcoin Profits - No Risk Investment!",
    ],
    bodies: [
      "Don't miss this incredible Bitcoin investment opportunity! Guaranteed {percent}% profit in just 30 days! Minimum investment $100! Join 10,000+ successful investors! Act now before it's too late!",
      "Revolutionary crypto trading algorithm with {percent}% success rate! Make ${amount} per day automatically! Limited spots available! Join now!",
      "Exclusive Bitcoin investment program. Turn ${min} into ${max} in just {days} days! Risk-free guarantee! Don't miss out!",
    ],
  },
  {
    subjects: [
      "Your PayPal Account Has Been Limited - Verify Now",
      "Amazon Account Suspended - Immediate Action Required",
      "Netflix: Update Payment Method to Continue Service",
      "Apple ID Security Alert - Verify Your Account",
      "Google Account: Unusual Activity Detected",
    ],
    bodies: [
      "We have limited your {service} account due to suspicious activity. Please verify your information within 24 hours or your account will be permanently suspended. Click here to verify: {link}",
      "Your {service} account requires immediate verification. Failure to confirm your details within 48 hours will result in permanent closure. Update now: {link}",
      "Security alert for your {service} account. We detected unauthorized access attempts. Verify your identity immediately to secure your account: {link}",
    ],
  },
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateSpamEmail(id) {
  const template = getRandomItem(spamTemplates);
  const subject = getRandomItem(template.subjects);
  let body = getRandomItem(template.bodies);

  body = body
    .replace("${amount}", Math.floor(Math.random() * 90000) + 10000)
    .replace("${percent}", Math.floor(Math.random() * 400) + 100)
    .replace("${min}", 100)
    .replace("${max}", Math.floor(Math.random() * 50000) + 10000)
    .replace("${days}", Math.floor(Math.random() * 20) + 10)
    .replace("{amount}", Math.floor(Math.random() * 40) + 10)
    .replace("{number}", Math.floor(Math.random() * 50) + 10)
    .replace("{days}", Math.floor(Math.random() * 10) + 3)
    .replace("{date}", "December 31, 2024")
    .replace("{link}", "http://fake-site.com/verify")
    .replace(
      "{product}",
      getRandomItem([
        "iPhone 15 Pro Max",
        "MacBook Pro",
        "Samsung Galaxy S24",
        "PlayStation 5",
        "Xbox Series X",
      ])
    )
    .replace(
      "{service}",
      getRandomItem(["PayPal", "Amazon", "Netflix", "Apple ID", "Google"])
    );

  return {
    id: id,
    subject: subject,
    body: body,
    sender: `spam${id}@fake-site.com`,
    category: "spam",
    hasAttachment: false,
  };
}

async function extractPdfsFromFolders() {
  console.log("🚀 Starting PDF extraction from folders...\n");

  const emails = [];
  let emailId = 1;

  for (const [category, config] of Object.entries(categories)) {
    const categoryPath = path.join(pdfsPath, config.folder);

    if (!fs.existsSync(categoryPath)) {
      console.log(`⚠️  Folder not found: ${categoryPath}\n`);
      continue;
    }

    const files = fs
      .readdirSync(categoryPath)
      .filter((file) => file.toLowerCase().endsWith(".pdf"));

    console.log(`📁 ${category.toUpperCase()}: Found ${files.length} PDFs`);
    console.log("─".repeat(60));

    // Process original PDFs
    for (const file of files) {
      const filePath = path.join(categoryPath, file);

      try {
        console.log(`${emailId}. Processing: ${file}`);

        const extractedText = await pdfService.extractFromFile(filePath);
        const subject = file.replace(".pdf", "");

        emails.push({
          id: emailId++,
          subject: subject,
          body: "",
          sender: config.sender,
          category: category,
          hasAttachment: true,
          attachments: [
            {
              filename: file,
              mimeType: "application/pdf",
              extractedText: extractedText,
            },
          ],
        });

        console.log(`   ✅ Extracted: ${extractedText.length} chars`);
        console.log(`   📊 Subject: ${subject}\n`);
      } catch (error) {
        console.log(`   ❌ Error: ${error.message}\n`);
      }
    }

    // ✅ Generate variations (50% with attachments, 50% without)
    const currentCount = emails.filter((e) => e.category === category).length;
    const neededSamples = SAMPLES_PER_CATEGORY - currentCount;

    if (neededSamples > 0 && files.length > 0) {
      console.log(
        `📝 Generating ${neededSamples} variations for ${category}...\n`
      );

      const originalEmails = emails.filter(
        (e) => e.category === category && e.hasAttachment
      );

      for (let i = 0; i < neededSamples; i++) {
        const template = getRandomItem(originalEmails);

        const variations = [
          "Re: ",
          "Fwd: ",
          "Urgent: ",
          "Follow-up: ",
          "Update: ",
          "[Important] ",
          "[Action Required] ",
          "[Reminder] ",
        ];

        const prefix =
          i < variations.length ? variations[i] : getRandomItem(variations);

        // ✅ 50% chance to have attachment
        const hasAttachment = i < neededSamples / 2;

        const email = {
          id: emailId++,
          subject: prefix + template.subject,
          body: hasAttachment
            ? ""
            : template.attachments[0].extractedText.substring(0, 500),
          sender: template.sender,
          category: category,
          hasAttachment: hasAttachment,
        };

        // ✅ Add attachment if hasAttachment is true
        if (hasAttachment) {
          email.attachments = [
            {
              filename: template.attachments[0].filename,
              mimeType: "application/pdf",
              extractedText: template.attachments[0].extractedText,
            },
          ];
        }

        emails.push(email);

        console.log(
          `${emailId - 1}. Generated variation ${i + 1} (${
            hasAttachment ? "with" : "without"
          } attachment)`
        );
      }

      console.log(`   ✅ Generated ${neededSamples} variations\n`);
    }

    console.log();
  }

  // Generate spam
  console.log(`📁 SPAM: Generating ${SAMPLES_PER_CATEGORY} samples`);
  console.log("─".repeat(60));

  for (let i = 0; i < SAMPLES_PER_CATEGORY; i++) {
    const spamEmail = generateSpamEmail(emailId++);
    emails.push(spamEmail);
    console.log(`${emailId - 1}. Generated spam email ${i + 1}`);
  }

  console.log("\n");

  // Save to JSON
  fs.writeFileSync(outputPath, JSON.stringify(emails, null, 2));

  // Print summary
  console.log("=".repeat(60));
  console.log("✅ EXTRACTION COMPLETE!");
  console.log("=".repeat(60));
  console.log("\n📊 Summary:");

  const summary = {};
  const attachmentCount = {};

  emails.forEach((email) => {
    summary[email.category] = (summary[email.category] || 0) + 1;

    if (email.hasAttachment) {
      attachmentCount[email.category] =
        (attachmentCount[email.category] || 0) + 1;
    }
  });

  Object.entries(summary).forEach(([category, count]) => {
    const withAttachments = attachmentCount[category] || 0;
    const withoutAttachments = count - withAttachments;
    console.log(
      `   ${category}: ${count} emails (${withAttachments} with attachments, ${withoutAttachments} without)`
    );
  });

  console.log(`\n   TOTAL: ${emails.length} emails`);
  console.log(`\n📁 Saved to: ${outputPath}`);
  console.log("\n🚀 Next: npm run train-ml");
  console.log("=".repeat(60));
}

extractPdfsFromFolders().catch(console.error);
