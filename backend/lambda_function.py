import boto3
import json
import urllib3
import datetime
import re
import os

# ==============================================================================
# CONFIGURATION
# ==============================================================================
# API keys are now fetched from Lambda Environment Variables for security
CONFIG = {
    "GROQ_API_KEY": os.environ.get("GROQ_API_KEY", "MISSING_KEY"),
    "NEWS_API_KEY": os.environ.get("NEWS_API_KEY", "MISSING_KEY"),
    "VENDORS_TABLE": "Vendors",
    "RISK_TABLE": "RiskEvents",
    "SNS_TOPIC_ARN": os.environ.get("SNS_TOPIC_ARN", "PASTE_YOUR_SNS_TOPIC_ARN_HERE"),
    "NEWS_QUERY": "port+strike+OR+earthquake+OR+flood+OR+geopolitical+crisis",
}

# Initialize AWS clients OUTSIDE the handler to optimize "warm" starts
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
http = urllib3.PoolManager()

def lambda_handler(event, context):
    try:
        # 1. FETCH NEWS
        news_url = f"https://newsapi.org/v2/everything?q={CONFIG['NEWS_QUERY']}&language=en&pageSize=5&apiKey={CONFIG['NEWS_API_KEY']}"
        news_response = http.request('GET', news_url)
        news_data = json.loads(news_response.data.decode('utf-8'))
        articles = news_data.get('articles', [])
        news_summary = "\n".join([f"- {a.get('title', 'N/A')}: {a.get('description', 'N/A')}" for a in articles])

        # 2. READ VENDORS
        vendor_table = dynamodb.Table(CONFIG['VENDORS_TABLE'])
        vendors_response = vendor_table.scan()
        vendors = vendors_response.get('Items', [])
        vendor_summary = "\n".join([f"- {v.get('vendor_name', 'Unknown')} (ID: {v.get('vendor_id', 'N/A')}, Loc: {v.get('location', 'N/A')}, Crit: {v.get('criticality', 'N/A')})" for v in vendors])

        # 3. AI REASONING
        prompt = f"""
        <role>You are the NexusRisk Autonomous Orchestrator.</role>
        <inputs>
        <news_feed>{news_summary}</news_feed>
        <vendor_matrix>{vendor_summary}</vendor_matrix>
        </inputs>
        <instructions>
        Analyze news vs vendors. Find risks. Score 1-10.
        Output ONLY a valid JSON array inside <json_output> tags.
        Schema: [{{ "vendor_id": "string", "risk_score": number, "status": "Critical|Warning|Stable", "event_summary": "string", "mitigation_strategy": "string" }}]
        </instructions>
        """
        url = "https://api.groq.com/openai/v1/chat/completions"
        headers = {"Authorization": f"Bearer {CONFIG['GROQ_API_KEY']}", "Content-Type": "application/json"}
        data = json.dumps({"model": "openai/gpt-oss-120b", "messages": [{"role": "user", "content": prompt}]})

        response = http.request('POST', url, body=data, headers=headers)
        response_body = json.loads(response.data.decode('utf-8'))
        ai_raw_text = response_body['choices'][0]['message']['content']

        # Parse JSON from tags
        json_match = re.search(r'<json_output>(.*?)</json_output>', ai_raw_text, re.DOTALL)
        risks = json.loads(json_match.group(1).strip()) if json_match else []

        # 4. PERSISTENCE & AUTONOMOUS ALERTING
        risk_table = dynamodb.Table(CONFIG['RISK_TABLE'])
        for risk in risks:
            v_id = risk.get('vendor_id', 'Unknown')
            r_score = risk.get('risk_score', 0)

            # Write to DB
            timestamp = datetime.datetime.now(datetime.timezone.utc).isoformat()
            risk_table.put_item(Item={
                'event_id': v_id,
                'timestamp': timestamp,
                'risk_score': r_score,
                'status': risk.get('status', 'Stable'),
                'event': risk.get('event_summary', 'N/A'),
                'mitigation': risk.get('mitigation_strategy', 'N/A')
            })

            # --- THE AUTONOMOUS TRIGGER ---
            if r_score >= 8:
                message = f"⚠️ CRITICAL RISK DETECTED\nVendor: {v_id}\nScore: {r_score}/10\nEvent: {risk.get('event_summary')}\nAction: {risk.get('mitigation_strategy')}"
                sns.publish(TopicArn=CONFIG['SNS_TOPIC_ARN'], Message=message, Subject="NEXUS RISK CRITICAL ALERT")

        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,GET'
            },
            'body': json.dumps({'status': 'Success', 'risks_found': len(risks), 'details': risks})
        }

    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'OPTIONS,GET'
            },
            'body': json.dumps({'error': str(e)})
        }
