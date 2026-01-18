import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // Validation could happen here

        const N8N_webhook = process.env.N8N_COPY_WEBHOOK_URL;

        if (!N8N_webhook) {
            // Fallback for demo mode if no env var
            console.log('Mocking N8N call with body:', body);
            return NextResponse.json({
                jobId: 'mock-' + crypto.randomUUID(),
                status: 'queued',
                message: 'Mock job created (Setup N8N_COPY_WEBHOOK_URL to use real backend)'
            }, { status: 202 });
        }

        // Call n8n
        const res = await fetch(N8N_webhook, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            throw new Error(`n8n error: ${res.statusText}`);
        }

        const data = await res.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
