import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text
} from "@react-email/components";

interface VerifyEmailProps {
  verificationCode: string;
  verificationUrl: string;
}

export default function VerifyEmail({
  verificationCode,
  verificationUrl
}: VerifyEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Verify your UploadX account</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify Your UploadX Account</Heading>

          <Text style={text}>
            Use the verification code below or click the button to verify your
            account:
          </Text>

          <Section style={codeContainer}>
            <Text style={code}>{verificationCode}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button
              style={{
                ...button,
                paddingLeft: 20,
                paddingRight: 20,
                paddingTop: 12,
                paddingBottom: 12
              }}
              href={verificationUrl}
            >
              Verify Account
            </Button>
          </Section>

          <Text style={footer}>
            If you didn&apos;t request this verification, please ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  padding: "60px 0"
} as const;

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #eee",
  borderRadius: "5px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
  margin: "0 auto",
  padding: "40px 30px",
  maxWidth: "465px"
} as const;

const h1 = {
  color: "#1a1a1a",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: "24px",
  fontWeight: "600",
  lineHeight: "40px",
  margin: "0 0 20px",
  textAlign: "center"
} as const;

const text = {
  color: "#444",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: "15px",
  lineHeight: "24px",
  textAlign: "center"
} as const;

const codeContainer = {
  background: "#f5f5f5",
  borderRadius: "4px",
  margin: "16px 0 32px",
  padding: "20px 30px"
} as const;

const code = {
  color: "#1a1a1a",
  fontFamily: "monospace",
  fontSize: "30px",
  fontWeight: "700",
  letterSpacing: "6px",
  lineHeight: "1",
  margin: "0",
  textAlign: "center",
  wordSpacing: "12px"
} as const;

const buttonContainer = {
  textAlign: "center",
  margin: "32px 0"
} as const;

const button = {
  backgroundColor: "#4f46e5",
  borderRadius: "4px",
  color: "#fff",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: "1",
  textDecoration: "none",
  textAlign: "center",
  display: "inline-block",
  padding: "12px 24px",
  margin: "0 auto"
} as const;

const footer = {
  color: "#666",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  fontSize: "13px",
  lineHeight: "20px",
  textAlign: "center",
  margin: "12px 0"
} as const;
