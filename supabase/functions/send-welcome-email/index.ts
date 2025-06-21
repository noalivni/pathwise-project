
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: WelcomeEmailRequest = await req.json();

    const emailResponse = await resend.emails.send({
      from: "Pathwise <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to Pathwise - Your Career Journey Starts Here!",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: linear-gradient(135deg, #14b8a6, #2563eb); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Pathwise!</h1>
          </div>
          
          <div style="padding: 40px 20px; background: #f8fafc;">
            <h2 style="color: #1e293b; margin-bottom: 20px;">Hi ${name},</h2>
            
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">
              Thank you for joining Pathwise! We're excited to help you navigate your career journey with personalized guidance and AI-powered insights.
            </p>
            
            <div style="background: white; padding: 30px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #14b8a6;">
              <h3 style="color: #14b8a6; margin-top: 0;">What's Next?</h3>
              <ul style="color: #475569; line-height: 1.8;">
                <li>Complete your onboarding questionnaire</li>
                <li>Take our comprehensive skills assessment</li>
                <li>Get personalized job recommendations</li>
                <li>Access curated learning resources</li>
                <li>Practice interviews with our AI coach</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${Deno.env.get('SITE_URL') || 'https://pathwise.lovable.app'}" 
                 style="background: linear-gradient(135deg, #14b8a6, #2563eb); color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                Get Started Now
              </a>
            </div>
            
            <p style="color: #64748b; font-size: 14px; text-align: center; margin-top: 40px;">
              Need help? Reply to this email or contact our support team.
            </p>
          </div>
          
          <div style="background: #1e293b; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              © 2024 Pathwise. All rights reserved.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Welcome email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending welcome email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
