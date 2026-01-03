import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink } from "lucide-react";

const HelpSupport = () => {
  const faqs = [
    {
      question: "How do I approve an organization profile?",
      answer:
        "Navigate to Organization Verification from the sidebar. Click on a pending profile to review the details, then use the Approve, Request Changes, or Reject buttons to take action.",
    },
    {
      question: "How do I create an invite code?",
      answer:
        "Go to User Management and click on 'Invite Codes'. Click 'Create Invite Code', select the role to assign, set an optional expiration date, and the system will generate a unique code.",
    },
    {
      question: "How do I change a user's role?",
      answer:
        "Navigate to User Management, find the user in the list, click the edit button, and select a new role from the dropdown. Save your changes to update the user's permissions.",
    },
    {
      question: "Where can I see system activity?",
      answer:
        "The Audit Logs section shows all system activities including user actions, profile changes, and content modifications. Use filters to narrow down specific events.",
    },
    {
      question: "How do I manage website content?",
      answer:
        "Use the Content Management section to manage blog posts, grants, team members, job opportunities, and announcements. Each content type has its own management interface.",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Help & Support</h1>
        <p className="text-muted-foreground">Find answers and get assistance</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Quick Links
            </CardTitle>
            <CardDescription>Helpful resources and documentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Book className="h-4 w-4 mr-2" />
              Admin Documentation
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              User Guides
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-2" />
              Video Tutorials
              <ExternalLink className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact Support
            </CardTitle>
            <CardDescription>Get help from our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Need assistance? Our support team is here to help you with any questions or issues.
            </p>
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Email:</strong> support@optimiz.com
              </p>
              <p className="text-sm">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
            <Button className="w-full">
              <Mail className="h-4 w-4 mr-2" />
              Send Support Request
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
          <CardDescription>Common questions and answers</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default HelpSupport;
