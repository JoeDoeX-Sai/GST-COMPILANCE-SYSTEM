/**
 * GST System — Sample Data Seeder
 * Run: node backend/utils/seedData.js
 * Seeds: Business, Parties, Invoices, Purchases, Compliance, Returns, TDS, HSN
 */

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const {
  initDb, User, Business, UserBusiness,
  Party, Invoice, InvoiceItem, Purchase,
  Return, Compliance, TdsTcs, Hsn,
} = require('./db');

// ── Helpers ───────────────────────────────────────────────────────────────────
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const pick = arr => arr[rand(0, arr.length - 1)];
const fmt2 = n => parseFloat(n.toFixed(2));

function calcGST(taxable, rate, isInter) {
  const tax = fmt2(taxable * rate / 100);
  return {
    taxable_value: fmt2(taxable),
    cgst:  isInter ? 0 : fmt2(tax / 2),
    sgst:  isInter ? 0 : fmt2(tax / 2),
    igst:  isInter ? tax : 0,
    cess:  0,
    total_amount: fmt2(taxable + tax),
  };
}

// ── Main Seeder ───────────────────────────────────────────────────────────────
async function seed() {
  await initDb();
  console.log('\n🌱 Starting sample data seeding...\n');

  // ── 1. Business ─────────────────────────────────────────────────────────────
  let biz = await Business.findOne({ gstin: '29AABCT1332L1ZT' });
  if (!biz) {
    biz = await Business.create({
      gstin: '29AABCT1332L1ZT',
      legal_name: 'TechSoft Solutions Pvt Ltd',
      trade_name: 'TechSoft Solutions',
      address: '42, MG Road, Bengaluru, Karnataka - 560001',
      state_code: '29',
      registration_type: 'Regular',
      pan: 'AABCT1332L',
      email: 'accounts@techsoft.in',
      phone: '9876543210',
      active: 1,
    });
    console.log('✅ Business created:', biz.trade_name);
  } else {
    console.log('ℹ️  Business already exists:', biz.trade_name);
  }

  // ── 2. Link admin to business ────────────────────────────────────────────────
  const admin = await User.findOne({ email: 'admin@gst.local' });
  if (admin) {
    const exists = await UserBusiness.findOne({ user_id: admin._id, business_id: biz._id });
    if (!exists) {
      await UserBusiness.create({ user_id: admin._id, business_id: biz._id });
      console.log('✅ Admin linked to business');
    }
  }

  // ── 3. Sample Users ──────────────────────────────────────────────────────────
  const sampleUsers = [
    { name: 'Priya Sharma',   email: 'priya@techsoft.in',   role: 'accountant' },
    { name: 'Ravi Kumar',     email: 'ravi@techsoft.in',    role: 'accountant' },
    { name: 'Anita Verma',    email: 'anita@techsoft.in',   role: 'viewer'     },
  ];
  for (const u of sampleUsers) {
    const exists = await User.findOne({ email: u.email });
    if (!exists) {
      const hash = bcrypt.hashSync('Pass@123', 10);
      const newUser = await User.create({ ...u, password: hash, emailVerified: true, active: 1 });
      await UserBusiness.create({ user_id: newUser._id, business_id: biz._id });
      console.log(`✅ User created: ${u.name} (${u.role})`);
    }
  }

  // ── 4. Parties (Customers & Vendors) ────────────────────────────────────────
  const partyCount = await Party.countDocuments({ business_id: biz._id });
  let parties = [];
  if (partyCount < 5) {
    const partyData = [
      { name: 'Infosys Limited',          gstin: '29AABCI1681G1ZK', state_code: '29', party_type: 'customer', is_registered: 1 },
      { name: 'Wipro Technologies',        gstin: '29AABCW0788A1ZP', state_code: '29', party_type: 'customer', is_registered: 1 },
      { name: 'Tata Consultancy Services', gstin: '27AAACT2727Q1ZW', state_code: '27', party_type: 'customer', is_registered: 1 },
      { name: 'HCL Technologies',          gstin: '06AAACH0997P1ZQ', state_code: '06', party_type: 'customer', is_registered: 1 },
      { name: 'Cognizant India',           gstin: '33AABCC4253H1ZX', state_code: '33', party_type: 'customer', is_registered: 1 },
      { name: 'Amazon Web Services',       gstin: '29AABCA4268J1ZX', state_code: '29', party_type: 'both',     is_registered: 1 },
      { name: 'Microsoft India',           gstin: '29AABCM4268J1ZX', state_code: '29', party_type: 'vendor',   is_registered: 1 },
      { name: 'Dell Technologies',         gstin: '29AABCD4268J1ZX', state_code: '29', party_type: 'vendor',   is_registered: 1 },
      { name: 'Lenovo India',              gstin: '29AABCL4268J1ZX', state_code: '29', party_type: 'vendor',   is_registered: 1 },
      { name: 'Retail Customer (B2C)',     gstin: '',                 state_code: '29', party_type: 'customer', is_registered: 0 },
    ];
    for (const p of partyData) {
      const exists = await Party.findOne({ business_id: biz._id, name: p.name });
      if (!exists) {
        await Party.create({ business_id: biz._id, ...p });
      }
    }
    console.log('✅ Parties created (10 customers/vendors)');
  }
  parties = await Party.find({ business_id: biz._id }).lean();

  // ── 5. Sales Invoices (12 months of data) ───────────────────────────────────
  const invCount = await Invoice.countDocuments({ business_id: biz._id });
  if (invCount < 10) {
    const customers = parties.filter(p => ['customer','both'].includes(p.party_type));
    const hsnCodes  = ['8471','8517','998311','997212','999299'];
    const gstRates  = [18, 18, 18, 18, 18];
    const descriptions = [
      'IT Software Development Services',
      'Cloud Infrastructure Services',
      'IT Consulting & Advisory',
      'Software License - Annual',
      'Technical Support Services',
      'Data Analytics Platform',
      'Cybersecurity Services',
      'ERP Implementation Services',
      'Mobile App Development',
      'API Integration Services',
    ];

    let invSeq = 1;
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

    // Generate 2-4 invoices per month for 12 months
    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(fyStart, 3 + m, 1); // April = month 3
      const year  = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, '0');
      const count = rand(2, 4);

      for (let i = 0; i < count; i++) {
        const day = String(rand(1, 25)).padStart(2, '0');
        const date = `${year}-${month}-${day}`;
        const customer = pick(customers);
        const isInter  = customer.state_code !== '29';
        const taxable  = rand(50000, 500000);
        const rate     = 18;
        const gst      = calcGST(taxable, rate, isInter);
        const invNo    = `TSS/2024-25/${String(invSeq).padStart(4, '0')}`;
        invSeq++;

        const inv = await Invoice.create({
          business_id:      biz._id,
          invoice_number:   invNo,
          invoice_date:     date,
          invoice_type:     customer.is_registered ? 'B2B' : 'B2C',
          supply_type:      isInter ? 'inter' : 'intra',
          party_id:         customer._id,
          party_name:       customer.name,
          party_gstin:      customer.gstin || '',
          party_state_code: customer.state_code,
          place_of_supply:  customer.state_code,
          ...gst,
          status:           m < 11 ? 'confirmed' : pick(['draft','confirmed']),
          payment_status:   m < 9 ? 'paid' : m < 11 ? 'partial' : 'unpaid',
          amount_paid:      m < 9 ? gst.total_amount : m < 11 ? fmt2(gst.total_amount * 0.5) : 0,
          payment_due_date: `${year}-${month}-${String(parseInt(day) + 30 > 28 ? 28 : parseInt(day) + 30).padStart(2,'0')}`,
          created_by:       admin._id,
        });

        // Add invoice items
        const desc = pick(descriptions);
        const hsnIdx = rand(0, hsnCodes.length - 1);
        await InvoiceItem.create({
          invoice_id:   inv._id,
          description:  desc,
          hsn_sac:      hsnCodes[hsnIdx],
          uom:          'NOS',
          quantity:     rand(1, 10),
          unit_price:   fmt2(taxable / rand(1, 10)),
          discount:     0,
          taxable_value: gst.taxable_value,
          gst_rate:     rate,
          cgst_rate:    isInter ? 0 : rate / 2,
          sgst_rate:    isInter ? 0 : rate / 2,
          igst_rate:    isInter ? rate : 0,
          cgst:         gst.cgst,
          sgst:         gst.sgst,
          igst:         gst.igst,
          cess_rate:    0,
          cess:         0,
          total:        gst.total_amount,
        });
      }
    }
    console.log(`✅ Sales Invoices created (${invSeq - 1} invoices across 12 months)`);
  } else {
    console.log(`ℹ️  Invoices already exist (${invCount} found)`);
  }

  // ── 6. Purchase Invoices ─────────────────────────────────────────────────────
  const purCount = await Purchase.countDocuments({ business_id: biz._id });
  if (purCount < 5) {
    const vendors = parties.filter(p => ['vendor','both'].includes(p.party_type));
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    let purSeq = 1;

    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(fyStart, 3 + m, 1);
      const year  = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, '0');
      const count = rand(1, 3);

      for (let i = 0; i < count; i++) {
        const day     = String(rand(1, 20)).padStart(2, '0');
        const date    = `${year}-${month}-${day}`;
        const vendor  = pick(vendors);
        const taxable = rand(20000, 200000);
        const rate    = 18;
        const isInter = vendor.state_code !== '29';
        const gst     = calcGST(taxable, rate, isInter);
        const statuses = ['matched', 'matched', 'pending', 'mismatch'];

        await Purchase.create({
          business_id:    biz._id,
          invoice_number: `VND/${String(purSeq).padStart(4,'0')}`,
          invoice_date:   date,
          party_id:       vendor._id,
          party_gstin:    vendor.gstin || '',
          supplier_name:  vendor.name,
          ...gst,
          itc_eligible:   1,
          itc_availed:    m < 10 ? 1 : 0,
          match_status:   pick(statuses),
          gstr2b_matched: m < 10 ? 1 : 0,
          payment_status: m < 9 ? 'paid' : 'unpaid',
          amount_paid:    m < 9 ? gst.total_amount : 0,
          created_by:     admin._id,
        });
        purSeq++;
      }
    }
    console.log(`✅ Purchase Invoices created (${purSeq - 1} purchases across 12 months)`);
  } else {
    console.log(`ℹ️  Purchases already exist (${purCount} found)`);
  }

  // ── 7. Compliance Calendar ───────────────────────────────────────────────────
  const compCount = await Compliance.countDocuments({ business_id: biz._id });
  if (compCount < 5) {
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;
    const compEntries = [];

    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(fyStart, 3 + m, 1);
      const year  = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, '0');
      const period = `${month}${year}`;

      // GSTR-1 due on 11th of next month
      const nextMonth = new Date(fyStart, 3 + m + 1, 11);
      const gstr1Due  = nextMonth.toISOString().split('T')[0];

      // GSTR-3B due on 20th of next month
      const gstr3bDate = new Date(fyStart, 3 + m + 1, 20);
      const gstr3bDue  = gstr3bDate.toISOString().split('T')[0];

      const today = new Date().toISOString().split('T')[0];
      const gstr1Status  = gstr1Due  < today ? (m < 9 ? 'filed' : 'overdue') : 'pending';
      const gstr3bStatus = gstr3bDue < today ? (m < 9 ? 'filed' : 'overdue') : 'pending';

      compEntries.push({
        business_id:  biz._id,
        return_type:  'GSTR-1',
        period,
        due_date:     gstr1Due,
        status:       gstr1Status,
        filed_date:   gstr1Status === 'filed' ? gstr1Due : null,
      });
      compEntries.push({
        business_id:  biz._id,
        return_type:  'GSTR-3B',
        period,
        due_date:     gstr3bDue,
        status:       gstr3bStatus,
        filed_date:   gstr3bStatus === 'filed' ? gstr3bDue : null,
      });
    }

    // Annual returns
    compEntries.push({
      business_id: biz._id,
      return_type: 'GSTR-9',
      period:      `${fyStart}-${fyStart+1}`,
      due_date:    `${fyStart+1}-12-31`,
      status:      'pending',
    });

    await Compliance.insertMany(compEntries);
    console.log(`✅ Compliance Calendar created (${compEntries.length} entries)`);
  } else {
    console.log(`ℹ️  Compliance entries already exist (${compCount} found)`);
  }

  // ── 8. GST Returns ───────────────────────────────────────────────────────────
  const retCount = await Return.countDocuments({ business_id: biz._id });
  if (retCount < 3) {
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

    for (let m = 0; m < 9; m++) {
      const monthDate = new Date(fyStart, 3 + m, 1);
      const year  = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, '0');
      const period = `${month}${year}`;
      const taxable = rand(200000, 800000);
      const cgst = fmt2(taxable * 0.09);
      const sgst = fmt2(taxable * 0.09);
      const igst = fmt2(taxable * 0.05);
      const itc  = fmt2((cgst + sgst + igst) * 0.6);

      await Return.create({
        business_id:    biz._id,
        return_type:    'GSTR1',
        period,
        status:         'filed',
        total_taxable:  taxable,
        total_cgst:     cgst,
        total_sgst:     sgst,
        total_igst:     igst,
        total_cess:     0,
        itc_claimed:    0,
        net_liability:  cgst + sgst + igst,
        filed_at:       new Date(parseInt(year), parseInt(month), 11),
        created_by:     admin._id,
      });

      await Return.create({
        business_id:    biz._id,
        return_type:    'GSTR3B',
        period,
        status:         'filed',
        total_taxable:  taxable,
        total_cgst:     cgst,
        total_sgst:     sgst,
        total_igst:     igst,
        total_cess:     0,
        itc_claimed:    itc,
        net_liability:  fmt2(cgst + sgst + igst - itc),
        filed_at:       new Date(parseInt(year), parseInt(month), 20),
        created_by:     admin._id,
      });
    }
    console.log('✅ GST Returns created (GSTR-1 & GSTR-3B for 9 months)');
  } else {
    console.log(`ℹ️  Returns already exist (${retCount} found)`);
  }

  // ── 9. TDS Entries ───────────────────────────────────────────────────────────
  const tdsCount = await TdsTcs.countDocuments({ business_id: biz._id });
  if (tdsCount < 3) {
    const vendors = parties.filter(p => ['vendor','both'].includes(p.party_type));
    const sections = ['194C', '194J', '194I', '194H'];
    const now = new Date();
    const fyStart = now.getMonth() >= 3 ? now.getFullYear() : now.getFullYear() - 1;

    for (let m = 0; m < 12; m++) {
      const monthDate = new Date(fyStart, 3 + m, 1);
      const year  = monthDate.getFullYear();
      const month = String(monthDate.getMonth() + 1).padStart(2, '0');
      const period = `${month}${year}`;
      const vendor = pick(vendors);
      const base   = rand(50000, 300000);
      const rate   = pick([1, 2, 10]);

      await TdsTcs.create({
        business_id: biz._id,
        entry_type:  'TDS',
        party_id:    vendor._id,
        section:     pick(sections),
        base_amount: base,
        rate,
        amount:      fmt2(base * rate / 100),
        period,
        status:      'pending',
      });
    }
    console.log('✅ TDS Entries created (12 monthly entries)');
  } else {
    console.log(`ℹ️  TDS entries already exist (${tdsCount} found)`);
  }

  // ── 10. Extra HSN Codes ──────────────────────────────────────────────────────
  const hsnCount = await Hsn.countDocuments();
  if (hsnCount < 30) {
    const extraHsn = [
      ['0201','HSN','Meat of bovine animals, fresh or chilled',0,0],
      ['0302','HSN','Fish, fresh or chilled',5,0],
      ['0401','HSN','Milk and cream, not concentrated',0,0],
      ['0701','HSN','Potatoes, fresh or chilled',0,0],
      ['0803','HSN','Bananas, fresh or dried',0,0],
      ['1006','HSN','Rice',5,0],
      ['1507','HSN','Soya-bean oil',5,0],
      ['2106','HSN','Food preparations not elsewhere specified',18,0],
      ['2402','HSN','Cigars, cheroots, cigarillos and cigarettes',28,0],
      ['2501','HSN','Salt; pure sodium chloride',0,0],
      ['3301','HSN','Essential oils',18,0],
      ['3808','HSN','Insecticides, rodenticides, fungicides',18,0],
      ['4011','HSN','New pneumatic tyres, of rubber',28,0],
      ['4901','HSN','Printed books, brochures, leaflets',0,0],
      ['5201','HSN','Cotton, not carded or combed',0,0],
      ['6109','HSN','T-shirts, singlets and other vests',12,0],
      ['7204','HSN','Ferrous waste and scrap',18,0],
      ['8414','HSN','Air or vacuum pumps, compressors',18,0],
      ['8516','HSN','Electric water heaters, hair dryers',28,0],
      ['9006','HSN','Photographic cameras',18,0],
      ['996112','SAC','Room or unit accommodation services',18,0],
      ['996312','SAC','Catering services',18,0],
      ['997111','SAC','Legal advisory and representation services',18,0],
      ['997211','SAC','Real estate services on a fee/commission basis',18,0],
      ['998221','SAC','Accounting and bookkeeping services',18,0],
      ['998222','SAC','Tax preparation and filing services',18,0],
      ['998313','SAC','Software development and production services',18,0],
      ['998314','SAC','IT infrastructure and network management',18,0],
      ['998411','SAC','Employment and staffing services',18,0],
      ['999100','SAC','Services by government',0,0],
    ];
    const existingCodes = (await Hsn.find({}, 'code').lean()).map(h => h.code);
    const toInsert = extraHsn.filter(([code]) => !existingCodes.includes(code));
    if (toInsert.length) {
      await Hsn.insertMany(toInsert.map(([code,type,description,gst_rate,cess_rate]) => ({ code,type,description,gst_rate,cess_rate })));
      console.log(`✅ HSN/SAC codes expanded (+${toInsert.length} codes, total: ${hsnCount + toInsert.length})`);
    }
  } else {
    console.log(`ℹ️  HSN codes already sufficient (${hsnCount} found)`);
  }

  console.log('\n✅ Sample data seeding complete!\n');
  console.log('📧 Admin Login:     admin@gst.local / Admin@123');
  console.log('📧 Accountant:      priya@techsoft.in / Pass@123');
  console.log('🏢 Business:        TechSoft Solutions (GSTIN: 29AABCT1332L1ZT)');
  console.log('📊 Data seeded:     12 months of invoices, purchases, compliance, TDS\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
