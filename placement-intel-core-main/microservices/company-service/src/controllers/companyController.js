const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await prisma.companies.findMany({ include: { jobs: true } });
    const data = companies.map(c => {
      const charCode = c.id.charCodeAt(0);
      const h_vel = charCode % 3 === 0 ? 'High' : charCode % 3 === 1 ? 'Moderate' : 'Low';
      const prof = charCode % 2 === 0 ? 'Profitable' : 'Bootstrapped';
      const rem = charCode % 3 === 0 ? 'Remote' : charCode % 3 === 1 ? 'Hybrid' : 'On-Site';
      
      let h_status = charCode % 5 === 0 ? 'Registration Open' : h_vel === 'High' ? 'Actively Hiring' : h_vel === 'Moderate' ? 'Scheduled' : 'Closed';
      if (c.name.toLowerCase().includes('accenture')) h_status = 'Registration Open';
      const pkgMin = (charCode % 5) + 6;
      const pkgMax = pkgMin + (charCode % 8) + 4;
      const pkg = `${pkgMin}-${pkgMax} LPA`;
      
      return {
        ...c,
        category: c.industry || 'Technology',
        hiring_velocity: h_vel,
        hiringVelocity: h_vel,
        hiring_status: h_status,
        package: pkg,
        profitability: prof,
        remotePolicy: rem,
        jobs: c.jobs
      };
    });
    res.json({ success: true, data, count: data.length });
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.getCompanyStats = async (req, res) => {
  try {
    const companies = await prisma.companies.findMany();
    const byCategory = {};
    const byHiringVelocity = {};
    const byProfitability = {};
    const byRemotePolicy = {};

    companies.forEach(c => {
      const cat = c.industry || 'Technology';
      const charCode = c.id.charCodeAt(0);
      const h_vel = charCode % 3 === 0 ? 'High' : charCode % 3 === 1 ? 'Moderate' : 'Low';
      const prof = charCode % 2 === 0 ? 'Profitable' : 'Bootstrapped';
      const rem = charCode % 3 === 0 ? 'Remote' : charCode % 3 === 1 ? 'Hybrid' : 'On-Site';

      byCategory[cat] = (byCategory[cat] || 0) + 1;
      byHiringVelocity[h_vel] = (byHiringVelocity[h_vel] || 0) + 1;
      byProfitability[prof] = (byProfitability[prof] || 0) + 1;
      byRemotePolicy[rem] = (byRemotePolicy[rem] || 0) + 1;
    });

    res.json({
      success: true,
      stats: {
        total: companies.length,
        byCategory,
        byHiringVelocity,
        byProfitability,
        byRemotePolicy
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await prisma.companies.findUnique({
      where: { id },
      include: { jobs: true }
    });

    if (!company) {
      return res.status(404).json({ success: false, error: 'Company not found' });
    }

    const charCode = company.id.charCodeAt(0);
    const h_vel = charCode % 3 === 0 ? 'High' : charCode % 3 === 1 ? 'Moderate' : 'Low';
    const prof = charCode % 2 === 0 ? 'Profitable' : 'Bootstrapped';
    const rem = charCode % 3 === 0 ? 'Remote' : charCode % 3 === 1 ? 'Hybrid' : 'On-Site';

    let h_status = charCode % 5 === 0 ? 'Registration Open' : h_vel === 'High' ? 'Actively Hiring' : h_vel === 'Moderate' ? 'Scheduled' : 'Closed';
    if (company.name.toLowerCase().includes('accenture')) h_status = 'Registration Open';
    const pkgMin = (charCode % 5) + 6;
    const pkgMax = pkgMin + (charCode % 8) + 4;
    const pkg = `${pkgMin}-${pkgMax} LPA`;

    const data = {
      ...company,
      category: company.industry || 'Technology',
      hiring_velocity: h_vel,
      hiringVelocity: h_vel,
      hiring_status: h_status,
      package: pkg,
      profitability: prof,
      remotePolicy: rem,
      jobs: company.jobs
    };

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching company:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.getRecentNotifications = async (req, res) => {
  try {
    const companies = await prisma.companies.findMany({
      take: 6,
      orderBy: { created_at: 'desc' } // Just take some companies
    });
    
    const badges = [
      'Deadline Approaching', 'Interview Tomorrow', 'Results Published', 
      'Hiring Open', 'Registration Open', 'New Update'
    ];
    
    const messages = [
      'The registration deadline is closing soon. Ensure your profile is updated.',
      'Aptitude and Technical rounds are scheduled for tomorrow. Check your email.',
      'Final shortlist has been released. 12 students selected.',
      'New campus hiring drive announced for SDE roles.',
      'Registration is now open on the placement portal.',
      'Package details and job description have been updated.'
    ];

    const data = companies.map((c, i) => ({
      id: `notif-${c.id}`,
      company: c.name,
      company_id: c.id,
      short_name: c.name,
      status: i % 3 === 0 ? 'Actively Hiring' : i % 3 === 1 ? 'Scheduled' : 'Closed',
      badge: badges[i % badges.length],
      message: messages[i % messages.length]
    }));

    res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

exports.createJob = async (req, res) => {
  try {
    // Note: Admin authorization should ideally be verified in the API Gateway
    const { company_id, title, ctc, min_cgpa, allowed_branches, allows_backlogs } = req.body;

    const job = await prisma.jobs.create({
      data: {
        company_id,
        title,
        ctc,
        min_cgpa,
        allowed_branches,
        allows_backlogs
      }
    });

    // TODO: Publish event to Message Broker (e.g., RabbitMQ) so Notification Service 
    // can alert students about the new job.

    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
