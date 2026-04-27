const API_BASE = 'https://gst-compilance-system-backend.onrender.com/api';
let token = '';
let bizId = '';

async function run() {
  console.log('Logging in...');
  const resLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ email: 'admin@gst.local', password: 'Admin@123' })
  }).then(r => r.json());
  
  if(!resLogin.token) { console.error('Login failed', resLogin); return; }
  token = resLogin.token;
  console.log('Logged in successfully. Admin Token Acquired.');

  // Check existing businesses
  const list = await fetch(`${API_BASE}/businesses`, { headers: { 'Authorization': `Bearer ${token}` }}).then(r=>r.json());
  if (list.data && list.data.length > 0) {
    // Find the one in the screenshot or first one
    const lovelyTrust = list.data.find(b => b.legal_name && b.legal_name.toLowerCase().includes('lovely trust'));
    if (lovelyTrust) {
      bizId = lovelyTrust._id || lovelyTrust.id;
      console.log('Using existing Business:', lovelyTrust.legal_name);
    } else {
      bizId = list.data[0]._id || list.data[0].id;
      console.log('Using existing Business:', list.data[0].legal_name);
    }
  } else {
    console.log('No businesses found. Creating one...');
    const bizData = {
      gstin: '36AACCM9910C1ZP',
      legal_name: 'Lovely Trust',
      trade_name: 'Lovely Trust',
      address: 'Hyderabad, Telangana',
      state_code: '36',
      registration_type: 'Regular',
      pan: 'AACCM9910C',
      email: 'admin@lovelytrust.com',
      phone: '9876543210'
    };
    const biz = await fetch(`${API_BASE}/businesses`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(bizData)
    }).then(r => r.json());
    bizId = biz.data._id || biz.data.id;
    console.log('Created Business ID:', bizId);
  }

  // Create Parties
  console.log('Creating parties...');
  const customerData = [
    { business_id: bizId, name: 'Tech Mahindra Ltd', gstin: '36ABCDE1234F1Z5', pan: 'ABCDE1234F', email: 'billing@techm.com', phone: '1111111111', address: 'Hitec City, Hyd', state_code: '36', party_type: 'customer' },
    { business_id: bizId, name: 'Infosys Limited', gstin: '29LMNOP9876F1Z5', pan: 'LMNOP9876F', email: 'accounts@infosys.com', phone: '2222222222', address: 'Electronic City, Blr', state_code: '29', party_type: 'customer' }
  ];
  
  let cust1, cust2;
  for(const c of customerData) {
    const res = await fetch(`${API_BASE}/parties`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(c)
    }).then(r => r.json());
    if (res.data) {
      if(c.name.includes('Tech Mahindra')) cust1 = res.data;
      else cust2 = res.data;
      console.log('Created Party:', c.name);
    }
  }

  const supplierData = [
    { business_id: bizId, name: 'Office Depot', gstin: '36VWXYZ1234F1Z5', pan: 'VWXYZ1234F', email: 'sales@officedepot.in', phone: '3333333333', address: 'Secunderabad, TS', state_code: '36', party_type: 'supplier' },
    { business_id: bizId, name: 'Cloud AWS India', gstin: '27AWSCD1234F1Z5', pan: 'AWSCD1234F', email: 'billing@aws.in', phone: '4444444444', address: 'Mumbai, MH', state_code: '27', party_type: 'supplier' }
  ];
  let supp1, supp2;
  for(const s of supplierData) {
    const res = await fetch(`${API_BASE}/parties`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(s)
    }).then(r => r.json());
    if (res.data) {
      if(s.name.includes('Office Depot')) supp1 = res.data;
      else supp2 = res.data;
      console.log('Created Party:', s.name);
    }
  }

  // Create Invoices (Sales)
  console.log('Creating invoices...');
  const invoices = [
    {
      business_id: bizId,
      invoice_number: 'INV-2026-001',
      invoice_date: new Date(Date.now() - 5*24*60*60*1000).toISOString().split('T')[0],
      invoice_type: 'B2B',
      supply_type: 'intra', // Intra-state (CGST + SGST)
      party_id: cust1?.id || cust1?._id,
      party_name: cust1?.name,
      party_gstin: cust1?.gstin,
      party_state_code: cust1?.state_code,
      items: [
        { description: 'Software Development Services', hsn_sac: '998311', uom: 'NOS', quantity: 1, unit_price: 50000, taxable_value: 50000, gst_rate: 18 }
      ]
    },
    {
      business_id: bizId,
      invoice_number: 'INV-2026-002',
      invoice_date: new Date(Date.now() - 2*24*60*60*1000).toISOString().split('T')[0],
      invoice_type: 'B2B',
      supply_type: 'inter', // Inter-state (IGST)
      party_id: cust2?.id || cust2?._id,
      party_name: cust2?.name,
      party_gstin: cust2?.gstin,
      party_state_code: cust2?.state_code,
      items: [
        { description: 'Cloud Infrastructure Setup', hsn_sac: '998311', uom: 'NOS', quantity: 1, unit_price: 120000, taxable_value: 120000, gst_rate: 18 },
        { description: 'Annual Maintenance Contract', hsn_sac: '998311', uom: 'NOS', quantity: 1, unit_price: 30000, taxable_value: 30000, gst_rate: 18 }
      ]
    }
  ];

  for(const inv of invoices) {
    const res = await fetch(`${API_BASE}/invoices`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(inv)
    }).then(r => r.json());
    console.log('Invoice created:', res.message || res.success);
    
    if (res.success && res.data) {
      if (inv.invoice_number === 'INV-2026-001') {
        await fetch(`${API_BASE}/invoices/${res.data.id}/confirm`, {
          method: 'PATCH', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ business_id: bizId })
        }).then(r => r.json());
        console.log('Invoice confirmed:', inv.invoice_number);
      }
    }
  }

  // Create Purchases
  console.log('Creating purchases...');
  const purchases = [
    {
      business_id: bizId,
      invoice_number: 'BILL-1092',
      invoice_date: new Date(Date.now() - 10*24*60*60*1000).toISOString().split('T')[0],
      party_id: supp1?.id || supp1?._id,
      party_gstin: supp1?.gstin,
      supplier_name: supp1?.name,
      taxable_value: 15000,
      cgst: 1350,
      sgst: 1350,
      igst: 0,
      cess: 0,
      itc_eligible: 1
    },
    {
      business_id: bizId,
      invoice_number: 'AWS-2026-04',
      invoice_date: new Date(Date.now() - 3*24*60*60*1000).toISOString().split('T')[0],
      party_id: supp2?.id || supp2?._id,
      party_gstin: supp2?.gstin,
      supplier_name: supp2?.name,
      taxable_value: 45000,
      cgst: 0,
      sgst: 0,
      igst: 8100,
      cess: 0,
      itc_eligible: 1
    }
  ];

  for(const pur of purchases) {
    const res = await fetch(`${API_BASE}/purchases`, {
      method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(pur)
    }).then(r => r.json());
    console.log('Purchase created:', res.message || res.success);
  }

  console.log('Seeding completed successfully!');
}
run();
