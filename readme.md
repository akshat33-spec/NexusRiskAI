Nexus Risk AI

An intelligent, end-to-end risk monitoring and mitigation platform designed to aggregate multi-source news streams, evaluate threat levels using LLM-driven reasoning, persist structured risk data, and broadcast real-time alerts.

🏗️ Architecture & Overview

Nexus Risk AI orchestrates a pipeline that continuously monitors external threat signals, analyzes risk factors using AI, and notifies stakeholders when actionable metrics cross defined thresholds.

+---------------+     HTTPS     +--------------------+     API Call     +---------------------------+
| User / Laptop | ------------> | Next.js Frontend   | ---------------> | AWS Lambda Orchestrator   |
+---------------+               +--------------------+                  +---------------------------+
                                                                                      |
         +----------------------+-----------------------+-----------------------------+
         |                      |                       |                             |
         v                      v                       v                             v
  +--------------+       +--------------+     +------------------+           +------------------+
  |  News API    |       |   Groq AI    |     |   AWS DynamoDB   |           |    Amazon SNS    |
  | (News Fetch) |       | (Reasoning)  |     |  (Read / Write)  |           | (Alert Trigger)  |
  +--------------+       +--------------+     +------------------+           +------------------+
                                                                                      |
                                                                                      v
                                                                             +------------------+
                                                                             |    User Email    |
                                                                             +------------------+


Key Components

⚬ Frontend Interface: Built with Next.js to provide a real-time visualization dashboard and management console.
⚬ Orchestration Engine: Hosted on AWS Lambda for scalable, serverless backend execution.
⚬ Data Aggregation: Integrates with NewsAPI to collect real-time data feeds and news developments.
⚬ AI Reasoning Layer: Powered by Groq AI models to classify, evaluate, and extract risk metrics from raw contextual data.
⚬ Persistence Layer: Amazon DynamoDB for structured, fast, and scalable storage of historical risk evaluations and context logs.
⚬ Notification Engine: Amazon SNS handles critical alerting via automated email distributions to users and administrators.

🛠️ Tech Stack

⚬ Frontend: Next.js, React, Tailwind CSS
⚬ Backend & Serverless: AWS Lambda, Node.js
⚬ Database: Amazon DynamoDB
⚬ AI & ML Integration: Groq SDK (Llama 3 / Fast Inference Models)
⚬ External APIs: NewsAPI
⚬ Notification Services: Amazon Simple Notification Service (SNS)

🚀 Getting Started

Prerequisites

Ensure you have the following tools and accounts configured on your environment:

⚬ Node.js (v18.x or higher) and npm / yarn / pnpm
⚬ AWS CLI installed and configured with valid credentials (aws configure)
⚬ Groq API Key
⚬ NewsAPI Key

Installation

1. Clone the repository:
   git clone https://github.com/your-username/nexus-risk-ai.git
   cd nexus-risk-ai
   
2. Install frontend and backend dependencies:
   npm install
   
3. Configure Environment Variables:
   Create a .env.local (or .env) file in the root directory and define the required credentials:
   # AWS Configuration
   AWS_REGION=us-east-1
   DYNAMODB_TABLE_NAME=nexus_risk_events
   SNS_TOPIC_ARN=arn:aws:sns:us-east-1:123456789012:nexus-risk-alerts
   
   # AI & External APIs
   GROQ_API_KEY=your_groq_api_key_here
   NEWS_API_KEY=your_news_api_key_here
   
   # Next.js App Config
   NEXT_PUBLIC_API_ENDPOINT=https://your-lambda-endpoint.amazonaws.com/prod
   

💻 Running the Application Locally

1. Launch Next.js Frontend

npm run dev


Open http://localhost:3000 in your browser to inspect the application.

2. Local Backend Execution / Testing

If testing AWS Lambda functions locally using serverless frameworks or SAM:

npm run sam:local
# OR
node scripts/test-lambda-event.js


🗺️ System Flow

1. Triggering Ingestion: The frontend or scheduled event triggers the AWS Lambda orchestration routine.
2. Data Ingestion: Lambda executes requests against NewsAPI to retrieve topic-relevant news articles.
3. AI Risk Assessment: Unstructured article text is dispatched to Groq AI to perform risk score evaluations and extract structured summary objects.
4. Data Persistence: Evaluated records are saved to Amazon DynamoDB for historical auditing.
5. Threshold-based Alerting: If an evaluated risk score exceeds specified criteria, Lambda triggers an Amazon SNS topic to immediately deliver email alerts to subscribed endpoints.

📄 License

Distributed under the MIT License. See LICENSE for details.