export const getBaseTemplate = (content: string, title: string = 'ATS Notification') => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1a1a;
            background-color: #f8f9fa;
        }
        
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 32px 24px;
        }
        
        .button {
            display: inline-block;
            background-color: #1a1a1a;
            color: #ffffff;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 16px 0;
            transition: background-color 0.2s ease;
        }
        
        .button:hover {
            background-color: #2d2d2d;
        }
        
        .button-secondary {
            background-color: #f1f1f1;
            color: #1a1a1a;
        }
        
        .button-secondary:hover {
            background-color: #e5e5e5;
        }
        
        .footer {
            background-color: #f8f9fa;
            padding: 24px;
            text-align: center;
            border-top: 1px solid #e5e5e5;
        }
        
        .footer p {
            font-size: 14px;
            color: #666666;
            margin-bottom: 8px;
        }
        
        .footer a {
            color: #1a1a1a;
            text-decoration: none;
        }
        
        .status-badge {
            display: inline-block;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .status-pending {
            background-color: #fef3c7;
            color: #92400e;
        }
        
        .status-reviewed {
            background-color: #dbeafe;
            color: #1e40af;
        }
        
        .status-shortlisted {
            background-color: #d1fae5;
            color: #065f46;
        }
        
        .status-rejected {
            background-color: #fee2e2;
            color: #991b1b;
        }
        
        .status-hired {
            background-color: #dcfce7;
            color: #166534;
        }
        
        .job-card {
            background-color: #f8f9fa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 20px;
            margin: 16px 0;
        }
        
        .job-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 8px;
        }
        
        .job-company {
            font-size: 16px;
            color: #666666;
            margin-bottom: 4px;
        }
        
        .job-location {
            font-size: 14px;
            color: #888888;
        }
        
        @media (max-width: 600px) {
            .container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 24px 16px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        ${content}
        <div class="footer">
            <p>© 2024 HireLoom. All rights reserved.</p>
            <p>This email was sent to you as part of your HireLoom account activity.</p>
        </div>
    </div>
</body>
</html>
`;