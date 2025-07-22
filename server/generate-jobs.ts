import { PrismaClient, EmploymentType } from '@prisma/client';

const prisma = new PrismaClient();

const COMPANY_ID = 'e33f1f4b-68b5-4616-bf24-9b7c5235fb93';

const jobData = [
  // Frontend Development Jobs
  {
    title: 'Senior React Developer',
    description:
      'We are seeking a Senior React Developer to join our dynamic frontend team. You will be responsible for building scalable web applications using React, TypeScript, and modern frontend technologies. Experience with state management libraries like Redux or Zustand is essential. You will collaborate with UX/UI designers and backend developers to deliver exceptional user experiences.',
    location: 'San Francisco, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: ['React', 'TypeScript', 'Redux', 'JavaScript', 'CSS', 'HTML'],
    isRemote: false,
  },
  {
    title: 'Frontend Developer',
    description:
      'Join our team as a Frontend Developer working with Vue.js and modern JavaScript frameworks. You will be responsible for creating responsive web applications, optimizing performance, and ensuring cross-browser compatibility. Experience with Vue 3, Composition API, and CSS preprocessors is preferred.',
    location: 'Austin, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Webpack', 'SASS'],
    isRemote: true,
  },
  {
    title: 'Junior Frontend Developer',
    description:
      'Entry-level position for a passionate Junior Frontend Developer. You will work with HTML, CSS, JavaScript, and learn modern frameworks like React or Angular. This is a great opportunity to grow your skills in a supportive environment with mentorship from senior developers.',
    location: 'New York, NY',
    employmentType: EmploymentType.FULL_TIME,
    experience: 1,
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'Git', 'Responsive Design'],
    isRemote: false,
  },
  {
    title: 'Angular Developer',
    description:
      'We are looking for an experienced Angular Developer to build enterprise-level applications. You will work with Angular 15+, TypeScript, RxJS, and NgRx for state management. Experience with Angular Material and testing frameworks like Jasmine and Karma is required.',
    location: 'Seattle, WA',
    employmentType: EmploymentType.CONTRACT,
    experience: 4,
    tags: ['Angular', 'TypeScript', 'RxJS', 'NgRx', 'Jasmine', 'Karma'],
    isRemote: true,
  },
  {
    title: 'UI/UX Frontend Developer',
    description:
      'Seeking a Frontend Developer with strong UI/UX skills to create beautiful and intuitive user interfaces. You will work closely with designers to implement pixel-perfect designs using modern CSS techniques, animations, and responsive design principles.',
    location: 'Los Angeles, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'CSS',
      'JavaScript',
      'UI/UX',
      'Figma',
      'Animation',
      'Responsive Design',
    ],
    isRemote: false,
  },

  // Backend Development Jobs
  {
    title: 'Senior Node.js Developer',
    description:
      'We are seeking a Senior Node.js Developer to architect and build scalable backend services. You will work with Express.js, MongoDB, Redis, and microservices architecture. Experience with Docker, Kubernetes, and cloud platforms (AWS/GCP) is essential.',
    location: 'Boston, MA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: ['Node.js', 'Express.js', 'MongoDB', 'Redis', 'Docker', 'AWS'],
    isRemote: true,
  },
  {
    title: 'Python Backend Developer',
    description:
      'Join our backend team as a Python Developer working with Django/Flask frameworks. You will design and implement RESTful APIs, work with PostgreSQL databases, and integrate with third-party services. Experience with celery for background tasks is a plus.',
    location: 'Chicago, IL',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: ['Python', 'Django', 'Flask', 'PostgreSQL', 'REST API', 'Celery'],
    isRemote: false,
  },
  {
    title: 'Java Spring Boot Developer',
    description:
      'We are looking for a Java Developer with expertise in Spring Boot framework. You will develop enterprise applications, work with microservices architecture, and implement security best practices. Experience with Maven, JUnit, and database technologies is required.',
    location: 'Denver, CO',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: ['Java', 'Spring Boot', 'Microservices', 'Maven', 'JUnit', 'MySQL'],
    isRemote: true,
  },
  {
    title: 'C# .NET Developer',
    description:
      'Seeking a skilled C# .NET Developer to work on enterprise applications using .NET Core/Framework. You will develop web APIs, work with Entity Framework, and implement clean architecture patterns. Experience with Azure cloud services is preferred.',
    location: 'Dallas, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'C#',
      '.NET Core',
      'Entity Framework',
      'Azure',
      'SQL Server',
      'Web API',
    ],
    isRemote: false,
  },
  {
    title: 'Go Backend Developer',
    description:
      'Join our team as a Go Developer building high-performance backend services. You will work with Go, gRPC, PostgreSQL, and distributed systems. Experience with concurrency patterns and performance optimization is essential.',
    location: 'Portland, OR',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'Go',
      'gRPC',
      'PostgreSQL',
      'Distributed Systems',
      'Docker',
      'Kubernetes',
    ],
    isRemote: true,
  },

  // Full Stack Development Jobs
  {
    title: 'Senior Full Stack Developer',
    description:
      'We are seeking a Senior Full Stack Developer proficient in both frontend and backend technologies. You will work with React, Node.js, TypeScript, and cloud platforms to build end-to-end solutions. Leadership and mentoring experience is preferred.',
    location: 'Miami, FL',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: ['React', 'Node.js', 'TypeScript', 'AWS', 'MongoDB', 'GraphQL'],
    isRemote: true,
  },
  {
    title: 'Full Stack JavaScript Developer',
    description:
      'Join our team as a Full Stack JavaScript Developer working with the MERN stack (MongoDB, Express, React, Node.js). You will develop complete web applications from database design to user interface implementation.',
    location: 'Phoenix, AZ',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: ['JavaScript', 'React', 'Node.js', 'Express.js', 'MongoDB', 'MERN'],
    isRemote: false,
  },
  {
    title: 'Full Stack Python Developer',
    description:
      'We are looking for a Full Stack Python Developer with experience in Django and React. You will build web applications, design database schemas, and create responsive user interfaces. Experience with deployment and DevOps practices is a plus.',
    location: 'Atlanta, GA',
    employmentType: EmploymentType.CONTRACT,
    experience: 4,
    tags: ['Python', 'Django', 'React', 'PostgreSQL', 'Docker', 'AWS'],
    isRemote: true,
  },

  // DevOps and Infrastructure Jobs
  {
    title: 'Senior DevOps Engineer',
    description:
      'We are seeking a Senior DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines. You will work with AWS/Azure, Terraform, Jenkins, and Kubernetes to ensure scalable and reliable deployments. Experience with monitoring and logging tools is essential.',
    location: 'San Jose, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: ['AWS', 'Terraform', 'Jenkins', 'Kubernetes', 'Docker', 'Monitoring'],
    isRemote: true,
  },
  {
    title: 'Cloud Infrastructure Engineer',
    description:
      'Join our infrastructure team as a Cloud Engineer specializing in AWS services. You will design and implement scalable cloud architectures, automate deployments, and optimize costs. Experience with Infrastructure as Code and security best practices is required.',
    location: 'Raleigh, NC',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: ['AWS', 'CloudFormation', 'Lambda', 'EC2', 'S3', 'IAM'],
    isRemote: false,
  },
  {
    title: 'DevOps Engineer',
    description:
      'We are looking for a DevOps Engineer to streamline our development and deployment processes. You will work with CI/CD pipelines, containerization, and monitoring tools. Experience with GitLab CI, Docker, and Prometheus is preferred.',
    location: 'Nashville, TN',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: ['GitLab CI', 'Docker', 'Prometheus', 'Grafana', 'Linux', 'Bash'],
    isRemote: true,
  },
  {
    title: 'Site Reliability Engineer',
    description:
      'Seeking an SRE to ensure the reliability and performance of our production systems. You will implement monitoring, alerting, and incident response procedures. Experience with observability tools and chaos engineering is a plus.',
    location: 'Salt Lake City, UT',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: [
      'SRE',
      'Monitoring',
      'Alerting',
      'Incident Response',
      'Observability',
      'Chaos Engineering',
    ],
    isRemote: true,
  },

  // Data Science and Analytics Jobs
  {
    title: 'Senior Data Scientist',
    description:
      'We are seeking a Senior Data Scientist to lead our analytics initiatives. You will work with Python, R, machine learning algorithms, and big data technologies to extract insights from complex datasets. Experience with MLOps and model deployment is essential.',
    location: 'San Francisco, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: ['Python', 'R', 'Machine Learning', 'TensorFlow', 'PyTorch', 'MLOps'],
    isRemote: true,
  },
  {
    title: 'Data Engineer',
    description:
      'Join our data team as a Data Engineer building robust data pipelines and infrastructure. You will work with Apache Spark, Kafka, and cloud data services to process and transform large datasets. Experience with data warehousing is preferred.',
    location: 'New York, NY',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: ['Apache Spark', 'Kafka', 'Python', 'SQL', 'Data Warehousing', 'ETL'],
    isRemote: false,
  },
  {
    title: 'Machine Learning Engineer',
    description:
      'We are looking for an ML Engineer to deploy and maintain machine learning models in production. You will work with MLOps tools, containerization, and cloud ML services. Experience with model monitoring and A/B testing is required.',
    location: 'Seattle, WA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Machine Learning',
      'MLOps',
      'Docker',
      'Kubernetes',
      'AWS SageMaker',
      'Python',
    ],
    isRemote: true,
  },
  {
    title: 'Data Analyst',
    description:
      'Seeking a Data Analyst to transform raw data into actionable business insights. You will work with SQL, Python, and visualization tools like Tableau or Power BI. Strong analytical and communication skills are essential.',
    location: 'Chicago, IL',
    employmentType: EmploymentType.FULL_TIME,
    experience: 2,
    tags: [
      'SQL',
      'Python',
      'Tableau',
      'Power BI',
      'Data Analysis',
      'Statistics',
    ],
    isRemote: false,
  },

  // Quality Assurance Jobs
  {
    title: 'Senior QA Automation Engineer',
    description:
      'We are seeking a Senior QA Automation Engineer to lead our testing initiatives. You will design and implement automated testing frameworks using Selenium, Cypress, or Playwright. Experience with API testing and performance testing is essential.',
    location: 'Austin, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: [
      'Selenium',
      'Cypress',
      'Playwright',
      'API Testing',
      'Performance Testing',
      'Java',
    ],
    isRemote: true,
  },
  {
    title: 'QA Engineer',
    description:
      'Join our QA team as a Quality Assurance Engineer responsible for manual and automated testing. You will create test plans, execute test cases, and work closely with development teams to ensure product quality.',
    location: 'Denver, CO',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'Manual Testing',
      'Automated Testing',
      'Test Planning',
      'Bug Tracking',
      'Agile',
      'JIRA',
    ],
    isRemote: false,
  },
  {
    title: 'Mobile QA Engineer',
    description:
      'We are looking for a Mobile QA Engineer specializing in iOS and Android testing. You will test mobile applications, perform device compatibility testing, and implement mobile automation frameworks.',
    location: 'Los Angeles, CA',
    employmentType: EmploymentType.CONTRACT,
    experience: 4,
    tags: [
      'Mobile Testing',
      'iOS',
      'Android',
      'Appium',
      'Device Testing',
      'Mobile Automation',
    ],
    isRemote: true,
  },

  // Cybersecurity Jobs
  {
    title: 'Senior Cybersecurity Engineer',
    description:
      'We are seeking a Senior Cybersecurity Engineer to protect our infrastructure and applications. You will implement security controls, conduct vulnerability assessments, and respond to security incidents. Experience with SIEM tools and penetration testing is required.',
    location: 'Washington, DC',
    employmentType: EmploymentType.FULL_TIME,
    experience: 7,
    tags: [
      'Cybersecurity',
      'SIEM',
      'Penetration Testing',
      'Vulnerability Assessment',
      'Incident Response',
      'Security Controls',
    ],
    isRemote: false,
  },
  {
    title: 'Information Security Analyst',
    description:
      'Join our security team as an Information Security Analyst monitoring and analyzing security events. You will work with security tools, investigate incidents, and develop security policies and procedures.',
    location: 'Tampa, FL',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'Information Security',
      'Security Monitoring',
      'Incident Investigation',
      'Security Policies',
      'Risk Assessment',
      'Compliance',
    ],
    isRemote: true,
  },

  // Database and Systems Jobs
  {
    title: 'Database Administrator',
    description:
      'We are seeking a Database Administrator to manage our database infrastructure. You will work with PostgreSQL, MySQL, and MongoDB to ensure optimal performance, backup strategies, and security. Experience with database tuning and replication is essential.',
    location: 'Minneapolis, MN',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: [
      'PostgreSQL',
      'MySQL',
      'MongoDB',
      'Database Tuning',
      'Backup',
      'Replication',
    ],
    isRemote: false,
  },
  {
    title: 'Systems Administrator',
    description:
      'Join our IT team as a Systems Administrator managing Linux and Windows servers. You will handle server maintenance, user management, and system monitoring. Experience with virtualization and cloud platforms is preferred.',
    location: 'Kansas City, MO',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Linux',
      'Windows Server',
      'Virtualization',
      'System Monitoring',
      'User Management',
      'Cloud Platforms',
    ],
    isRemote: true,
  },

  // Mobile Development Jobs
  {
    title: 'Senior iOS Developer',
    description:
      'We are seeking a Senior iOS Developer to build native iOS applications using Swift and SwiftUI. You will work with iOS frameworks, implement complex UI components, and integrate with backend APIs. Experience with App Store deployment is required.',
    location: 'San Francisco, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: ['iOS', 'Swift', 'SwiftUI', 'Xcode', 'App Store', 'Core Data'],
    isRemote: true,
  },
  {
    title: 'Android Developer',
    description:
      'Join our mobile team as an Android Developer working with Kotlin and modern Android development practices. You will build native Android applications, implement Material Design, and work with Android Jetpack components.',
    location: 'Austin, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Android',
      'Kotlin',
      'Material Design',
      'Android Jetpack',
      'Room Database',
      'Retrofit',
    ],
    isRemote: false,
  },
  {
    title: 'React Native Developer',
    description:
      'We are looking for a React Native Developer to build cross-platform mobile applications. You will work with React Native, TypeScript, and native modules to create performant mobile apps for both iOS and Android platforms.',
    location: 'Seattle, WA',
    employmentType: EmploymentType.CONTRACT,
    experience: 3,
    tags: [
      'React Native',
      'TypeScript',
      'iOS',
      'Android',
      'Cross-platform',
      'Native Modules',
    ],
    isRemote: true,
  },
  {
    title: 'Flutter Developer',
    description:
      'Seeking a Flutter Developer to create beautiful cross-platform mobile applications using Dart and Flutter framework. You will implement custom widgets, handle state management, and integrate with various APIs and services.',
    location: 'Portland, OR',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'Flutter',
      'Dart',
      'Cross-platform',
      'State Management',
      'Custom Widgets',
      'API Integration',
    ],
    isRemote: true,
  },

  // Product and Project Management
  {
    title: 'Technical Product Manager',
    description:
      'We are seeking a Technical Product Manager to drive product strategy and roadmap for our technology products. You will work closely with engineering teams, analyze market requirements, and define product specifications. Technical background is essential.',
    location: 'San Francisco, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: [
      'Product Management',
      'Product Strategy',
      'Roadmap',
      'Requirements Analysis',
      'Agile',
      'Stakeholder Management',
    ],
    isRemote: true,
  },
  {
    title: 'IT Project Manager',
    description:
      'Join our team as an IT Project Manager overseeing technology projects from initiation to completion. You will manage project timelines, resources, and stakeholder communications. PMP certification and Agile experience are preferred.',
    location: 'Chicago, IL',
    employmentType: EmploymentType.FULL_TIME,
    experience: 6,
    tags: [
      'Project Management',
      'PMP',
      'Agile',
      'Scrum',
      'Stakeholder Management',
      'Resource Planning',
    ],
    isRemote: false,
  },

  // Emerging Technologies
  {
    title: 'Blockchain Developer',
    description:
      'We are looking for a Blockchain Developer to work on decentralized applications and smart contracts. You will work with Ethereum, Solidity, Web3.js, and various blockchain protocols. Experience with DeFi and NFT projects is a plus.',
    location: 'New York, NY',
    employmentType: EmploymentType.CONTRACT,
    experience: 3,
    tags: [
      'Blockchain',
      'Ethereum',
      'Solidity',
      'Web3.js',
      'Smart Contracts',
      'DeFi',
    ],
    isRemote: true,
  },
  {
    title: 'AI/ML Research Engineer',
    description:
      'Seeking an AI/ML Research Engineer to work on cutting-edge artificial intelligence projects. You will research and implement novel algorithms, work with large language models, and contribute to AI product development.',
    location: 'Boston, MA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'AI',
      'Machine Learning',
      'Research',
      'Large Language Models',
      'Deep Learning',
      'NLP',
    ],
    isRemote: true,
  },

  // Support and Operations
  {
    title: 'Technical Support Engineer',
    description:
      'We are seeking a Technical Support Engineer to provide technical assistance to our customers. You will troubleshoot software issues, create documentation, and work with development teams to resolve complex problems.',
    location: 'Phoenix, AZ',
    employmentType: EmploymentType.FULL_TIME,
    experience: 2,
    tags: [
      'Technical Support',
      'Troubleshooting',
      'Documentation',
      'Customer Service',
      'Problem Solving',
      'Software Support',
    ],
    isRemote: false,
  },
  {
    title: 'IT Operations Specialist',
    description:
      'Join our IT operations team as a specialist responsible for maintaining IT infrastructure and supporting end users. You will handle hardware/software installations, network troubleshooting, and IT asset management.',
    location: 'Dallas, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 3,
    tags: [
      'IT Operations',
      'Infrastructure',
      'Network Troubleshooting',
      'Hardware Support',
      'Asset Management',
      'End User Support',
    ],
    isRemote: false,
  },

  // Architecture and Leadership
  {
    title: 'Solutions Architect',
    description:
      'We are seeking a Solutions Architect to design and implement enterprise-level technology solutions. You will work with stakeholders to understand requirements, design system architectures, and guide implementation teams.',
    location: 'Atlanta, GA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 8,
    tags: [
      'Solutions Architecture',
      'Enterprise Architecture',
      'System Design',
      'Stakeholder Management',
      'Technical Leadership',
      'Cloud Architecture',
    ],
    isRemote: true,
  },
  {
    title: 'Engineering Manager',
    description:
      'Join our team as an Engineering Manager leading a team of software developers. You will be responsible for team management, technical decision-making, and ensuring project delivery. Strong technical background and leadership experience are essential.',
    location: 'San Jose, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 7,
    tags: [
      'Engineering Management',
      'Team Leadership',
      'Technical Leadership',
      'Project Delivery',
      'People Management',
      'Software Development',
    ],
    isRemote: true,
  },

  // Specialized Roles
  {
    title: 'Game Developer',
    description:
      'We are looking for a Game Developer to create engaging gaming experiences using Unity or Unreal Engine. You will work on game mechanics, graphics programming, and performance optimization. Experience with C# or C++ is required.',
    location: 'Los Angeles, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Game Development',
      'Unity',
      'Unreal Engine',
      'C#',
      'C++',
      'Graphics Programming',
    ],
    isRemote: false,
  },
  {
    title: 'Embedded Systems Engineer',
    description:
      'Seeking an Embedded Systems Engineer to develop firmware and software for embedded devices. You will work with microcontrollers, real-time operating systems, and hardware interfaces. Experience with C/C++ and hardware debugging is essential.',
    location: 'San Diego, CA',
    employmentType: EmploymentType.FULL_TIME,
    experience: 5,
    tags: [
      'Embedded Systems',
      'Firmware',
      'Microcontrollers',
      'RTOS',
      'C/C++',
      'Hardware Debugging',
    ],
    isRemote: false,
  },
  {
    title: 'Network Engineer',
    description:
      'We are seeking a Network Engineer to design, implement, and maintain our network infrastructure. You will work with routers, switches, firewalls, and network protocols. Cisco certifications and experience with network security are preferred.',
    location: 'Houston, TX',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Network Engineering',
      'Cisco',
      'Routers',
      'Switches',
      'Firewalls',
      'Network Security',
    ],
    isRemote: false,
  },
  {
    title: 'Cloud Solutions Engineer',
    description:
      'Join our cloud team as a Solutions Engineer helping customers adopt cloud technologies. You will provide technical guidance, design cloud architectures, and support migration projects. Multi-cloud experience is a plus.',
    location: 'Raleigh, NC',
    employmentType: EmploymentType.FULL_TIME,
    experience: 4,
    tags: [
      'Cloud Solutions',
      'AWS',
      'Azure',
      'GCP',
      'Cloud Migration',
      'Technical Consulting',
    ],
    isRemote: true,
  },
  {
    title: 'Performance Engineer',
    description:
      'We are looking for a Performance Engineer to optimize application and system performance. You will conduct performance testing, analyze bottlenecks, and implement optimization strategies. Experience with load testing tools is required.',
    location: 'Nashville, TN',
    employmentType: EmploymentType.CONTRACT,
    experience: 5,
    tags: [
      'Performance Engineering',
      'Load Testing',
      'Performance Optimization',
      'Bottleneck Analysis',
      'JMeter',
      'Performance Monitoring',
    ],
    isRemote: true,
  },
];

async function generateJobs() {
  try {
    console.log('Starting job generation...');

    // Verify company exists
    const company = await prisma.company.findUnique({
      where: { id: COMPANY_ID },
    });

    if (!company) {
      throw new Error(`Company with ID ${COMPANY_ID} not found`);
    }

    console.log(`Found company: ${company.name}`);

    // Create jobs
    const createdJobs = [];
    for (const job of jobData) {
      const createdJob = await prisma.job.create({
        data: {
          ...job,
          companyId: COMPANY_ID,
        },
      });
      (createdJobs as any[]).push(createdJob);
      console.log(`Created job: ${createdJob.title}`);
    }

    console.log(`\nSuccessfully created ${createdJobs.length} jobs!`);
    console.log('Job generation completed.');
  } catch (error) {
    console.error('Error generating jobs:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
generateJobs();
